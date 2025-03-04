import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  Cache,
  LanguageDetector,
  MorphologyProcessor,
  Logger,
} from '../utils.js';
import { mockFs, mockPath } from '../../vitest.setup.js';

describe('Cache', () => {
  test('should store and retrieve values', () => {
    const cache = new Cache();
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  test('should handle cache misses', () => {
    const cache = new Cache();
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  test('should respect TTL', async () => {
    const cache = new Cache(100);
    cache.set('key', 'value');
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(cache.get('key')).toBeUndefined();
  });
});

describe('LanguageDetector', () => {
  test('should detect language', () => {
    const result = LanguageDetector.detect('Hello, this is English text');
    expect(result).toBe('en');
  });

  test('should handle empty input', () => {
    const result = LanguageDetector.detect('');
    expect(result).toBe('und');
  });
});

describe('MorphologyProcessor', () => {
  test('should process text', () => {
    const processor = new MorphologyProcessor();
    const result = processor.process('running');
    expect(result).toContain('run');
  });

  test('should handle empty input', () => {
    const processor = new MorphologyProcessor();
    const result = processor.process('');
    expect(result).toBe('');
  });
});

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFs.existsSync.mockImplementation(() => false);
    mockFs.mkdirSync.mockImplementation(() => {});
    mockFs.appendFileSync.mockImplementation(() => {});
    mockPath.dirname.mockImplementation((p) =>
      p.split('/').slice(0, -1).join('/')
    );
  });

  test('should create log directory if it does not exist', () => {
    mockFs.existsSync.mockReturnValue(false);
    const logger = new Logger('./logs/test.log');
    logger.info('test message');

    expect(mockFs.mkdirSync).toHaveBeenCalledWith('./logs', {
      recursive: true,
    });
    expect(mockFs.appendFileSync).toHaveBeenCalled();
  });

  test('should not create directory if it exists', () => {
    mockFs.existsSync.mockReturnValue(true);
    const logger = new Logger('./logs/test.log');
    logger.info('test message');

    expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    expect(mockFs.appendFileSync).toHaveBeenCalled();
  });

  test('should format log messages correctly', () => {
    mockFs.existsSync.mockReturnValue(true);
    const logger = new Logger('./logs/test.log');
    const message = 'test message';
    logger.info(message);

    const appendCall = mockFs.appendFileSync.mock.calls[0];
    expect(appendCall[1]).toMatch(
      /\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] INFO: test message\n/
    );
  });
});
