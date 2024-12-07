import nlp from 'compromise';
import config from './config.js';

// Por ahora usaremos solo el soporte básico de compromise
// TODO: Añadir soporte multilingüe más adelante

// Clase para gestionar el caché
export class Cache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return null;
    }
    this.hits++;
    return item.value;
  }

  size() {
    return this.cache.size;
  }
}

// Detector de idioma basado en nlp
export class LanguageDetector {
  static detect(text) {
    try {
      const doc = nlp(text);
      return doc.language();
    } catch (error) {
      return config.languages.default;
    }
  }
}

// Procesador morfológico
export class MorphologyProcessor {
  process(text, language) {
    const doc = nlp(text);
    return {
      tokens: doc.terms().out('array'),
      tags: doc.terms().out('tags'),
      normalized: doc.normalize().out('text')
    };
  }
}

// Sistema de logging mejorado
export class Logger {
  static info(message, data = {}) {
    console.log(JSON.stringify({ level: 'info', message, ...data, timestamp: new Date().toISOString() }));
  }

  static error(message, error = {}) {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
  }

  static debug(message, data = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify({ level: 'debug', message, ...data, timestamp: new Date().toISOString() }));
    }
  }
}

export default {
  Cache,
  LanguageDetector,
  MorphologyProcessor,
  Logger
};