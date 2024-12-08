import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  Cache,
  LanguageDetector,
  MorphologyProcessor,
  Logger,
} from './utils.js';
import { mockFs } from './vitest.setup.js';

describe('Cache', () => {
  it('should store and retrieve values', () => {
    const cache = new Cache();
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  it('should handle cache misses', () => {
    const cache = new Cache();
    expect(cache.get('nonexistent')).toBeUndefined();
  });

  it('should respect TTL', async () => {
    const cache = new Cache(100);
    cache.set('key', 'value');
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(cache.get('key')).toBeUndefined();
  });
});

describe('LanguageDetector', () => {
  it('should detect language', () => {
    const result = LanguageDetector.detect('Hello, this is English text');
    expect(result).toBe('en');
  });

  it('should handle empty input', () => {
    const result = LanguageDetector.detect('');
    expect(result).toBe('und');
  });
});

describe('MorphologyProcessor', () => {
  it('should process text', () => {
    const processor = new MorphologyProcessor();
    const result = processor.process('running');
    expect(result).toContain('run');
  });

  it('should handle empty input', () => {
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
  });

  it('should create log directory if it does not exist', () => {
    mockFs.existsSync.mockReturnValue(false);
    const logger = new Logger('./logs/test.log');
    logger.info('test message');

    expect(mockFs.mkdirSync).toHaveBeenCalledWith('./logs', {
      recursive: true,
    });
    expect(mockFs.appendFileSync).toHaveBeenCalled();
  });

  it('should not create directory if it exists', () => {
    mockFs.existsSync.mockReturnValue(true);
    const logger = new Logger('./logs/test.log');
    logger.info('test message');

    expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    expect(mockFs.appendFileSync).toHaveBeenCalled();
  });

  it('should format log messages correctly', () => {
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
