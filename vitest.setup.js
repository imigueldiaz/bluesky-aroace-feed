// Este archivo se ejecutará antes de cada test
import { vi } from 'vitest';

// Configuración global para los tests
// Mock fs module
const mockFs = {
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  appendFileSync: vi.fn(),
  unlinkSync: vi.fn(),
  rmdirSync: vi.fn(),
  writeFileSync: vi.fn(),
  readFileSync: vi.fn(),
  promises: {
    writeFile: vi.fn(),
    readFile: vi.fn(),
    mkdir: vi.fn(),
  },
};

// Mock better-sqlite3
const mockDb = {
  exec: vi.fn(),
  prepare: vi.fn(() => ({
    run: vi.fn(),
    get: vi.fn(),
    all: vi.fn(),
  })),
  close: vi.fn(),
};

// Mock path
const mockPath = {
  dirname: vi.fn((p) => p.split('/').slice(0, -1).join('/')),
  join: vi.fn((...args) => args.join('/')),
};

// Mock Logger
class MockLogger {
  constructor(logDir = './logs') {
    this.logDir = mockPath.dirname(logDir);
    this.createLogDirectory();
  }

  createLogDirectory() {
    if (!mockFs.existsSync('./logs')) {
      mockFs.mkdirSync('./logs', { recursive: true });
    }
  }

  getLogPath() {
    const date = new Date().toISOString().split('T')[0];
    return mockPath.join(this.logDir, `${date}.log`);
  }

  info(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}\n`;
    mockFs.appendFileSync(this.getLogPath(), logMessage);
  }

  error(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}\n`;
    mockFs.appendFileSync(this.getLogPath(), logMessage);
  }

  warn(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}\n`;
    mockFs.appendFileSync(this.getLogPath(), logMessage);
  }

  debug(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] DEBUG: ${message}\n`;
    mockFs.appendFileSync(this.getLogPath(), logMessage);
  }
}

const mockLogger = new MockLogger();

// Mock LanguageDetector
const mockLanguageDetector = {
  detect: vi.fn((text) => (text ? 'en' : 'und')),
};

// Mock Cache implementation
class MockCache {
  constructor(ttl = 100) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const timestamp = Date.now();
    this.cache.set(key, { value, timestamp });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return undefined;

    const age = Date.now() - item.timestamp;
    if (age > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }
}

// Mock MorphologyProcessor
class MockMorphologyProcessor {
  process(text) {
    if (!text) return '';
    // Simple mock implementation that removes 'ing' suffix
    return text.replace(/ing$/, '');
  }
}

// Mock fs module
vi.mock('fs', () => ({
  ...mockFs,
  default: mockFs,
}));

// Mock better-sqlite3
vi.mock('better-sqlite3', () => ({
  default: vi.fn(() => mockDb),
}));

// Mock path module
vi.mock('path', () => ({
  __esModule: true,
  default: mockPath,
  dirname: mockPath.dirname,
  join: mockPath.join,
}));

// Mock utils.js
vi.mock('src/utils.js', () => ({
  Logger: MockLogger,
  LanguageDetector: {
    detect: mockLanguageDetector.detect,
  },
  Cache: MockCache,
  MorphologyProcessor: MockMorphologyProcessor,
}));

// Clean up mocks after each test
vi.mock('vitest', async (importOriginal) => {
  const vitest = await importOriginal();
  return {
    ...vitest,
    afterEach: (fn) => {
      vi.clearAllMocks();
      fn && fn();
    },
  };
});

// Exportar los mocks para uso en tests
export { mockFs, mockDb, mockLogger, mockPath };
