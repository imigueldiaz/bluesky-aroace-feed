import { describe, expect, test, beforeEach, vi } from 'vitest';
import { FeedDatabase } from './db.js';
import { mockFs, mockDb } from './vitest.setup.js';

describe('FeedDatabase', () => {
  let db;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock the prepare statement and its methods
    mockDb.prepare.mockReturnValue({
      all: vi.fn().mockReturnValue([
        {
          uri: 'test-uri',
          text: 'test text',
          matched_keywords: '[]',
          timestamp: Date.now(),
        },
      ]),
      run: vi.fn(),
      get: vi.fn(),
    });
    db = new FeedDatabase(':memory:');
  });

  describe('initialization', () => {
    test('should create database file if it does not exist', () => {
      expect(db).toBeDefined();
      expect(mockDb.exec).toHaveBeenCalled();
    });

    test('should not create file if it exists', () => {
      mockFs.existsSync.mockReturnValue(true);
      const existingDb = new FeedDatabase(':memory:');
      expect(existingDb).toBeDefined();
      expect(mockDb.exec).toHaveBeenCalled();
    });
  });

  describe('post operations', () => {
    test('should add a post', () => {
      const post = {
        uri: 'test-uri',
        cid: 'test-cid',
        author: 'test-author',
        text: 'test text',
        timestamp: Date.now(),
        relevance_score: 1,
      };

      db.addPost(post);
      expect(mockDb.prepare).toHaveBeenCalled();
    });

    test('should get posts', () => {
      const posts = db.getPosts();
      const preparedStatement = mockDb.prepare.mock.results[0].value;

      expect(mockDb.prepare).toHaveBeenCalled();
      expect(preparedStatement.all).toHaveBeenCalledWith({
        limit: 100,
        cursor: expect.any(Number),
      });
      expect(posts).toHaveLength(1);
      expect(posts[0].uri).toBe('test-uri');
    });
  });
});
