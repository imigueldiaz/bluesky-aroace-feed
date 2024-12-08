import Database from 'better-sqlite3';
import { Logger } from './utils.js';

export class FeedDatabase {
  constructor(dbPath = 'feed.db') {
    this.db = new Database(dbPath);
    this.setupDatabase();
    this.logger = new Logger();
    this.logger.info('Database initialized');
  }

  setupDatabase() {
    // Create posts table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        uri TEXT PRIMARY KEY,
        cid TEXT NOT NULL,
        author TEXT NOT NULL,
        text TEXT,
        timestamp INTEGER,
        relevance_score INTEGER,
        matched_keywords TEXT,
        language TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_timestamp ON posts(timestamp);
      CREATE INDEX IF NOT EXISTS idx_relevance ON posts(relevance_score);
    `);
  }

  addPost(post) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO posts (uri, cid, author, text, timestamp, relevance_score, matched_keywords, language)
      VALUES (@uri, @cid, @author, @text, @timestamp, @relevanceScore, @matchedKeywords, @language)
    `);

    try {
      stmt.run({
        uri: post.uri,
        cid: post.cid,
        author: post.author,
        text: post.text,
        timestamp: post.timestamp || Date.now(),
        relevanceScore: post.relevanceScore || 0,
        matchedKeywords: JSON.stringify(post.matchedKeywords || []),
        language: post.language,
      });
      return true;
    } catch (error) {
      this.logger.error('Error adding post to database', error);
      return false;
    }
  }

  getPosts(limit = 100, cursor = null) {
    let query = `
      SELECT * FROM posts 
      WHERE timestamp < @cursor
      ORDER BY timestamp DESC 
      LIMIT @limit
    `;

    if (!cursor) {
      query = `
        SELECT * FROM posts 
        ORDER BY timestamp DESC 
        LIMIT @limit
      `;
    }

    try {
      const stmt = this.db.prepare(query);
      const posts = stmt.all({
        limit,
        cursor: cursor ? parseInt(cursor) : Date.now(),
      });

      return posts.map((post) => ({
        ...post,
        matchedKeywords: JSON.parse(post.matched_keywords),
      }));
    } catch (error) {
      this.logger.error('Error getting posts from database', error);
      return [];
    }
  }

  getPost(uri) {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE uri = ?');
    try {
      const post = stmt.get(uri);
      if (post) {
        post.matchedKeywords = JSON.parse(post.matched_keywords);
      }
      return post;
    } catch (error) {
      this.logger.error('Error getting post from database', error);
      return null;
    }
  }

  cleanup(maxAgeHours = 24) {
    const cutoffTime = Date.now() - maxAgeHours * 60 * 60 * 1000;
    try {
      const stmt = this.db.prepare('DELETE FROM posts WHERE timestamp < ?');
      const result = stmt.run(cutoffTime);
      this.logger.info(`Cleaned up ${result.changes} old posts`);
    } catch (error) {
      this.logger.error('Error cleaning up old posts', error);
    }
  }

  close() {
    this.db.close();
  }
}
