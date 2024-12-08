// Este archivo se ejecutará antes de cada test
import { vi, afterEach } from 'vitest';

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

// Mock fs module
vi.mock('fs', () => ({
  default: mockFs,
  ...mockFs,
}));

// Mock better-sqlite3
vi.mock('better-sqlite3', () => {
  return {
    default: vi.fn(() => mockDb),
  };
});

// Limpiar todos los mocks después de cada test
afterEach(() => {
  vi.clearAllMocks();
});

// Exportar los mocks para uso en tests
export { mockFs, mockDb };
