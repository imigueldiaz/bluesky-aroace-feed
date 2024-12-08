import 'dotenv/config';
import express from 'express';
import { AtpAgent } from '@atproto/api';
import config from './config.js';
import { aceFilters } from './filters.js';
import { Logger } from './utils.js';
import { analyze } from './analyze.js';
import { FeedDatabase } from './db.js';
import { LanguageDetector } from './utils.js';

// Inicializar el logger
Logger.init(config.logging);

// Asegurar que cerramos el logger al salir
process.on('SIGTERM', () => {
  Logger.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  Logger.close();
  process.exit(0);
});

// Basic Auth middleware for debug endpoints
const debugAuth = (req, res, next) => {
  // Get credentials from request header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Get encoded credentials
  const encoded = authHeader.split(' ')[1];
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');

  // Check credentials against environment variables
  if (
    username === process.env.DEBUG_USERNAME &&
    password === process.env.DEBUG_PASSWORD
  ) {
    next();
  } else {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).json({ error: 'Invalid credentials' });
  }
};

class FeedGenerator {
  constructor() {
    this.app = express();
    this.agent = new AtpAgent({
      service: 'https://bsky.social',
    });

    this.db = new FeedDatabase();

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();

    // Setup periodic cleanup
    setInterval(
      () => {
        this.db.cleanup(config.limits.maxPostAgeHours || 24);
      },
      60 * 60 * 1000
    ); // Run every hour
  }

  async login() {
    try {
      await this.agent.login({
        identifier: process.env.BLUESKY_IDENTIFIER,
        password: process.env.BLUESKY_PASSWORD,
      });
      Logger.info('Successfully logged in to Bluesky');
    } catch (error) {
      Logger.error('Failed to login to Bluesky', error);
      throw error;
    }
  }

  setupMiddleware() {
    this.app.use(express.json());

    // Logging middleware
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        Logger.info('Request processed', {
          method: req.method,
          url: req.url,
          duration,
          status: res.statusCode,
        });
      });
      next();
    });
  }

  setupRoutes() {
    // Main feed route
    this.app.get('/xrpc/app.bsky.feed.getFeedSkeleton', async (req, res) => {
      try {
        const feed = await this.getFeedPosts(req.query);
        res.json(feed);
      } catch (error) {
        Logger.error('Feed error', error);
        res.status(500).json({ error: 'Error getting feed' });
      }
    });

    // Debug endpoint to analyze a specific post (protected)
    this.app.get('/debug/post', debugAuth, async (req, res) => {
      try {
        const { uri } = req.query;

        if (!uri) {
          return res.status(400).json({ error: 'Post URI is required' });
        }

        // Get post details from Bluesky
        const postView = await this.agent.api.app.bsky.feed.getPosts({
          uris: [uri],
        });

        if (!postView.success || postView.data.posts.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }

        const post = postView.data.posts[0];
        const postText = post.record.text;

        // Analyze the post
        const { isRelevant, matchedKeywords, relevanceScore } =
          analyze(postText);
        const analysis = {
          uri: post.uri,
          text: postText,
          author: post.author.handle,
          timestamp: post.indexedAt,
          analysis: {
            isRelevant,
            isAppropriate: aceFilters.isAppropriate(postText),
            relevanceScore,
            matchedKeywords,
          },
        };

        res.json(analysis);
      } catch (error) {
        Logger.error('Debug error', error);
        res.status(500).json({ error: 'Error analyzing post' });
      }
    });

    // Healthcheck
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        version: process.env.npm_package_version,
        uptime: process.uptime(),
      });
    });

    // Stats (protected)
    this.app.get('/stats', debugAuth, (req, res) => {
      res.json({
        cacheSize: this.db.getPostCount(),
        cacheHits: 0,
        cacheMisses: 0,
      });
    });
  }

  setupErrorHandling() {
    // Error handler
    this.app.use((err, req, res, _next) => {
      Logger.error('Server error', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }

  async getFeedPosts(params) {
    const limit = Math.min(params.limit ?? 20, 100);
    const posts = await this.db.getPosts(limit, params.cursor);

    return {
      cursor:
        posts.length > 0
          ? posts[posts.length - 1].timestamp.toString()
          : undefined,
      feed: posts.map((post) => ({
        post: post.uri,
        replyParent: undefined,
        replyRoot: undefined,
      })),
    };
  }

  async getFeedPost(uri) {
    return await this.db.getPost(uri);
  }

  async processPost(uri, cid, author, text, timestamp) {
    const analysisResult = analyze(text);
    if (!analysisResult.isRelevant) return false;

    if (!aceFilters.isAppropriate(text)) return false;

    const post = {
      uri,
      cid,
      author,
      text,
      timestamp,
      relevanceScore: analysisResult.relevanceScore,
      matchedKeywords: analysisResult.matchedKeywords,
      language: LanguageDetector.detect(text),
    };

    return await this.db.addPost(post);
  }

  start() {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      Logger.info(`Server started on port ${port}`);
    });
  }
}

const feedGenerator = new FeedGenerator();
feedGenerator.start();
