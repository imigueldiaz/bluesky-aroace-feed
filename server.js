import 'dotenv/config';
import express from 'express';
import { AtpAgent } from '@atproto/api';
import config from './config.js';
import { aceFilters } from './filters.js';
import { Cache, Logger } from './utils.js';
import { analyze } from './analyze.js';

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

  console.log('Debug Auth: Authentication attempt received');

  // Check credentials against environment variables
  if (username === process.env.DEBUG_USERNAME && password === process.env.DEBUG_PASSWORD) {
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

    this.postCache = new Cache(config.limits.maxCacheEntries);

    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.login();
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
        const feed = await this.getFeed(req.query);
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
        const postView = await this.agent.api.app.bsky.feed.getPosts({ uris: [uri] });

        if (!postView.success || postView.data.posts.length === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }

        const post = postView.data.posts[0];
        const postText = post.record.text;

        // Analyze the post
        const { isRelevant, matchedKeywords, relevanceScore } = analyze(postText);
        const analysis = {
          uri: post.uri,
          text: postText,
          author: post.author.handle,
          timestamp: post.indexedAt,
          analysis: {
            isRelevant,
            isAppropriate: aceFilters.isAppropriate(postText),
            relevanceScore,
            cached: this.postCache.get(uri) !== null,
            cacheValue: this.postCache.get(uri),
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
        cacheSize: this.postCache.size(),
        cacheHits: this.postCache.hits,
        cacheMisses: this.postCache.misses,
      });
    });
  }

  setupErrorHandling() {
    this.app.use((err, req, res, next) => {
      Logger.error('Unhandled error', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  async getFeed(params) {
    try {
      const { limit = 50, cursor } = params;

      // Get recent posts from the timeline
      const timelineResponse = await this.agent.api.app.bsky.feed.getTimeline({
        limit: limit * 2, // Get more posts to account for filtering
        cursor,
      });

      if (!timelineResponse.success) {
        throw new Error('Failed to fetch timeline');
      }

      const posts = timelineResponse.data.feed;

      // Filter and process posts
      const filteredPosts = posts.filter((post) => {
        // Check cache first
        const cachedResult = this.postCache.get(post.post.uri);
        if (cachedResult !== null) {
          return cachedResult;
        }

        const postText = post.post.record.text;

        // Apply ace/aro content filter
        const isRelevant = aceFilters.isAceAroContent(postText);

        // Check if content is appropriate
        const isAppropriate = aceFilters.isAppropriate(postText);

        // Calculate relevance score
        const relevanceScore = aceFilters.getRelevanceScore(postText);

        // Cache the result
        const shouldInclude =
          isRelevant && isAppropriate && relevanceScore >= config.filtering.minConfidenceScore;
        this.postCache.set(post.post.uri, shouldInclude);

        return shouldInclude;
      });

      // Sort by relevance score and remove duplicates
      const uniquePosts = new Map();
      const sortedPosts = filteredPosts
        .map((post) => ({
          post,
          score: aceFilters.getRelevanceScore(post.post.record.text),
        }))
        .sort((a, b) => b.score - a.score)
        .filter((item) => {
          // Si ya existe un post con el mismo URI, no lo incluimos
          if (uniquePosts.has(item.post.post.uri)) {
            return false;
          }
          uniquePosts.set(item.post.post.uri, true);
          return true;
        })
        .map((item) => item.post)
        .slice(0, limit);

      return {
        cursor: sortedPosts.length > 0 ? sortedPosts[sortedPosts.length - 1].post.cursor : null,
        feed: sortedPosts.map((post) => ({
          post: post.post.uri,
        })),
      };
    } catch (error) {
      Logger.error('Error in getFeed', error);
      throw error;
    }
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
