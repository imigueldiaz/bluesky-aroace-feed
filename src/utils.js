/* eslint-disable no-console */
import nlp from 'compromise';
import fs from 'fs';
import path from 'path';

// Clase para gestionar el caché
export class Cache {
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

// Detector de idioma basado en nlp
export class LanguageDetector {
  static detect(text) {
    if (!text) return 'und';

    const doc = nlp(text);
    let scores = {
      en: 0,
      es: 0,
      fr: 0,
      de: 0,
    };

    // Usar nlp para análisis gramatical
    const hasEnglishGrammar =
      doc.has('#Determiner #Noun') || doc.has('#Pronoun #Verb');
    const hasSpanishGrammar = doc.has('el? #Noun') || doc.has('la? #Noun');
    const hasFrenchGrammar = doc.has('le? #Noun') || doc.has('la? #Noun');
    const hasGermanGrammar = doc.has('(der|die|das) #Noun');

    if (hasEnglishGrammar) scores.en += 2;
    if (hasSpanishGrammar) scores.es += 2;
    if (hasFrenchGrammar) scores.fr += 2;
    if (hasGermanGrammar) scores.de += 2;

    // Palabras clave específicas por idioma
    const keywords = {
      en: ['the', 'is', 'are', 'be', 'to', 'in', 'that', 'have', 'it'],
      es: [
        'el',
        'la',
        'los',
        'las',
        'es',
        'son',
        'estar',
        'que',
        'en',
        'tiene',
      ],
      fr: ['le', 'la', 'les', 'est', 'sont', 'être', 'que', 'en', 'avoir'],
      de: [
        'der',
        'die',
        'das',
        'ist',
        'sind',
        'sein',
        'allen',
        'zu',
        'haben',
        'menschen',
      ],
    };

    // Normalizar texto para comparación de palabras clave
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);

    // Contar palabras clave por idioma
    for (const [lang, keywordList] of Object.entries(keywords)) {
      for (const keyword of keywordList) {
        if (words.includes(keyword)) {
          scores[lang] += 2;
        }
      }
    }

    // Patrones específicos por idioma
    if (normalizedText.match(/\b(der|die|das|den|dem|des)\b/)) scores.de += 3;
    if (normalizedText.match(/\b(el|la|los|las)\b/)) scores.es += 2;
    if (normalizedText.match(/\b(le|la|les|des)\b/)) scores.fr += 2;
    if (normalizedText.match(/\b(the|an?)\b/)) scores.en += 2;

    // German-specific patterns
    if (normalizedText.match(/\b(allen|menschen|tod|sterben)\b/))
      scores.de += 3;
    // French-specific patterns
    if (normalizedText.match(/\b(tous|toutes|mort|mourir)\b/)) scores.fr += 3;

    // Analizar estructura de la frase usando NLP
    const terms = doc.terms().out('array');
    const tags = doc.terms().out('tags');

    // Check for language-specific grammar patterns
    for (let i = 0; i < terms.length - 1; i++) {
      // German compound nouns (typically capitalized)
      if (terms[i][0] === terms[i][0].toUpperCase() && terms[i].length > 7) {
        scores.de += 1;
      }

      // English patterns
      const currentTags = Object.values(tags[i])[0];
      const nextTags = i + 1 < tags.length ? Object.values(tags[i + 1])[0] : [];
      if (currentTags.includes('Determiner') && nextTags.includes('Noun')) {
        scores.en += 1;
      }

      // Spanish/French patterns
      if (
        ['el', 'la', 'les'].includes(terms[i].toLowerCase()) &&
        nextTags.includes('Noun')
      ) {
        scores.es += 1;
        scores.fr += 1;
      }
    }

    // Encontrar el idioma con mayor puntuación
    let maxScore = 0;
    let detectedLang = 'en';
    for (const [lang, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedLang = lang;
      }
    }

    console.log('Language scores:', scores);
    return detectedLang;
  }
}

// Procesador morfológico
export class MorphologyProcessor {
  process(text) {
    if (!text) return '';
    const doc = nlp(text);
    return doc.verbs().toInfinitive().out('text') || text;
  }
}

// Clase para gestionar logs
export class Logger {
  constructor(logFile = './logs/app.log') {
    this.logFile = logFile;
    this.logDir = path.dirname(logFile);
    this.createLogDirectory();
  }

  createLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
  }

  log(level, message) {
    const formattedMessage = this.formatMessage(level, message);
    fs.appendFileSync(this.logFile, formattedMessage);
  }

  info(message) {
    this.log('info', message);
  }

  error(message) {
    this.log('error', message);
  }

  warn(message) {
    this.log('warn', message);
  }

  debug(message) {
    this.log('debug', message);
  }
}

// Create a default instance for use throughout the application
export const defaultLogger = new Logger();
