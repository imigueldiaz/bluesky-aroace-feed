import nlp from 'compromise';
import config from './config.js';
import fs from 'fs';
import path from 'path';

// Clase para gestionar el caché
class Cache {
  constructor(ttl = 100) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }
}

// Detector de idioma basado en nlp
class LanguageDetector {
  static detect(text) {
    if (!text) return 'und';

    const doc = nlp(text);

    // Use compromise's built-in features to analyze the text
    const terms = doc.terms().out('array');
    const normalizedText = doc.normalize().out('text');

    // Improved language detection using compromise's tokenization
    const enPatterns = ['the', 'is', 'are', 'and', 'this', 'that'];
    const esPatterns = ['el', 'la', 'los', 'las', 'es', 'son', 'esto', 'eso'];

    // Check both original terms and normalized text for better accuracy
    let enScore = terms.filter((term) =>
      enPatterns.includes(term.toLowerCase())
    ).length;
    let esScore = terms.filter((term) =>
      esPatterns.includes(term.toLowerCase())
    ).length;

    // Add additional score from normalized text analysis
    enScore += enPatterns.filter((pattern) =>
      normalizedText.toLowerCase().includes(pattern)
    ).length;
    esScore += esPatterns.filter((pattern) =>
      normalizedText.toLowerCase().includes(pattern)
    ).length;

    // Use config's default language if scores are equal
    if (enScore === esScore) {
      return config.defaultLanguage || 'en';
    }

    return enScore > esScore ? 'en' : 'es';
  }
}

// Procesador morfológico
class MorphologyProcessor {
  process(text) {
    if (!text) return '';

    const doc = nlp(text);

    // Use compromise's natural language processing capabilities
    return doc
      .normalize({
        whitespace: true,
        punctuation: true,
        case: true,
        numbers: true,
        plurals: true,
        verbs: true,
      })
      .terms()
      .out('array');
  }
}

// Sistema de logging mejorado
/* eslint-disable no-console */
class Logger {
  constructor(logFile = './logs/app.log') {
    this.logFile = logFile;
    this.createLogDirectory();
  }

  createLogDirectory() {
    const dir = path.dirname(this.logFile);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  info(message) {
    this.log('INFO', message);
  }

  error(message) {
    this.log('ERROR', message);
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}\n`;
    fs.appendFileSync(this.logFile, logMessage);
  }
}

export { Cache, LanguageDetector, MorphologyProcessor, Logger };
