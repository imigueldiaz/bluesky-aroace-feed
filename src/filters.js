/* eslint-disable no-console */
import { LanguageDetector } from './utils.js';
import { spamPatterns, getAllSensitiveTerms } from './filter-patterns.js';
import nlp from 'compromise';

export const aceFilters = {
  isAppropriate: (text, post = null) => {
    if (!text || typeof text !== 'string') {
      console.log('Invalid text input');
      return true;
    }

    console.log('\n=== Starting content analysis ===');
    console.log('Input text:', text);

    if (!text) {
      console.log('Empty text, returning true');
      return true;
    }

    // Detectar idioma usando el campo langs de Bluesky si está disponible
    let detectedLanguage;
    if (
      post &&
      post.record &&
      post.record.langs &&
      post.record.langs.length > 0
    ) {
      // Mapear códigos de idioma de Bluesky a nuestros códigos
      const langMap = {
        en: 'en',
        es: 'es',
        fr: 'fr',
        de: 'de',
      };
      detectedLanguage =
        langMap[post.record.langs[0]] || LanguageDetector.detect(text);
    } else {
      detectedLanguage = LanguageDetector.detect(text);
    }

    // Improve language detection
    const germanKeywords = [
      'der',
      'die',
      'das',
      'und',
      'ist',
      'sind',
      'allen',
      'menschen',
    ];
    const frenchKeywords = [
      'le',
      'la',
      'les',
      'et',
      'est',
      'sont',
      'tous',
      'toutes',
    ];
    const loweCaseWords = text.toLowerCase().split(/\s+/);

    // Check for German
    if (loweCaseWords.some((word) => germanKeywords.includes(word))) {
      detectedLanguage = 'de';
    }
    // Check for French
    else if (loweCaseWords.some((word) => frenchKeywords.includes(word))) {
      detectedLanguage = 'fr';
    }

    console.log('Detected language:', detectedLanguage);

    // Correct common language detection errors
    const correctedLanguage =
      detectedLanguage === 'und' ? 'en' : detectedLanguage;
    console.log('Corrected language:', correctedLanguage);

    // Lista de palabras clave por idioma para mejorar la detección
    const languageKeywords = {
      en: [
        'the',
        'is',
        'are',
        'and',
        'with',
        'who',
        'that',
        'this',
        'was',
        'were',
      ],
      es: ['el', 'la', 'los', 'las', 'es', 'son', 'con', 'que', 'este', 'esta'],
      fr: [
        'le',
        'la',
        'les',
        'est',
        'sont',
        'avec',
        'qui',
        'je',
        'être',
        'cette',
        'ces',
        'dans',
      ],
      de: [
        'der',
        'die',
        'das',
        'ist',
        'sind',
        'mit',
        'wer',
        'zu',
        'ein',
        'eine',
        'diese',
        'ich',
      ],
    };

    // Verificar si el texto contiene palabras clave de otro idioma
    const words = text
      .toLowerCase()
      .split(/[\s,.!?]+/)
      .filter(Boolean);
    let maxKeywords = 0;

    for (const [lang, keywords] of Object.entries(languageKeywords)) {
      const keywordCount = keywords.filter((keyword) =>
        words.includes(keyword)
      ).length;
      if (keywordCount > maxKeywords) {
        maxKeywords = keywordCount;
        detectedLanguage = lang;
      }
    }
    console.log('Corrected language:', detectedLanguage);

    const lowerText = text.toLowerCase();
    console.log('Processed words:', words);

    // Mejorar detección de spam
    const wordFrequency = {};
    for (const word of words) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      if (wordFrequency[word] > 3) {
        console.log(
          `Word "${word}" appears too frequently (${wordFrequency[word]} times)`
        );
        return false;
      }
    }

    // Verificar patrones de spam según el idioma
    const spamPattern = spamPatterns[detectedLanguage] || spamPatterns.en;
    const spamMatches = lowerText.match(spamPattern) || [];
    console.log('Spam matches found:', spamMatches);

    if (spamMatches.length > 0) {
      console.log('Spam detected, returning false');
      return false;
    }

    // Palabras clave que indican spam comercial
    const commercialSpamTerms = {
      en: [
        'free',
        'click',
        'dating',
        'site',
        'buy',
        'cheap',
        'offer',
        'price',
        'deal',
        'discount',
      ],
      es: [
        'gratis',
        'clic',
        'citas',
        'sitio',
        'comprar',
        'barato',
        'oferta',
        'precio',
        'descuento',
      ],
      fr: [
        'gratuit',
        'cliquez',
        'rencontre',
        'site',
        'acheter',
        'prix',
        'offre',
        'réduction',
      ],
      de: [
        'kostenlos',
        'klicken',
        'dating',
        'seite',
        'kaufen',
        'billig',
        'angebot',
        'preis',
      ],
    };

    const currentCommercialTerms =
      commercialSpamTerms[detectedLanguage] || commercialSpamTerms.en;
    const hasCommercialSpam = currentCommercialTerms.some((term) =>
      words.includes(term)
    );

    if (
      hasCommercialSpam &&
      words.some((w) => w === 'ace' || w === 'asexual')
    ) {
      console.log(
        'Commercial spam detected with ace-related terms, returning false'
      );
      return false;
    }

    // Verificar términos sensibles
    const sensitiveTerms = getAllSensitiveTerms(detectedLanguage);
    console.log('Checking sensitive terms for language:', detectedLanguage);

    const hasSensitiveContent = sensitiveTerms.some((term) => {
      if (detectedLanguage === 'de' && term === 'die') return false;
      const pattern = new RegExp(`\\b${term}\\b`, 'i');
      const matches = pattern.test(lowerText);
      if (matches) {
        console.log('Found sensitive term:', term);
        return true;
      }
      return false;
    });

    if (hasSensitiveContent) {
      console.log('Sensitive content found, returning false');
      return false;
    }

    // Detectar contexto de juegos
    const gamingWords = {
      en: ['game', 'play', 'player', 'gaming', 'poker', 'cards', 'deck'],
      es: ['juego', 'jugar', 'jugador', 'gaming', 'poker', 'cartas', 'baraja'],
      fr: ['jeu', 'jouer', 'joueur', 'gaming', 'poker', 'cartes'],
      de: ['spiel', 'spielen', 'spieler', 'gaming', 'poker', 'karten'],
    };

    const hasGamingContext = (text, lang = 'en') => {
      const words = text.toLowerCase().split(/\s+/);
      const currentGamingWords = gamingWords[lang] || gamingWords.en;
      return words.some((word) => currentGamingWords.includes(word));
    };

    // First check if we're in a gaming context when "ace" is present
    const hasAce = lowerText.includes('ace');
    const isInGamingContext =
      hasAce && hasGamingContext(text, detectedLanguage);
    const hasIdentityContext =
      lowerText.includes('being ace') ||
      lowerText.includes('am ace') ||
      lowerText.includes('identify as ace') ||
      lowerText.includes('aroace') ||
      lowerText.includes('ace person') ||
      lowerText.includes('as an ace');

    // If we have both gaming and identity contexts, prioritize identity context
    if (hasAce && isInGamingContext && !hasIdentityContext) {
      console.log(
        'Gaming context detected without identity context, returning false'
      );
      return false;
    }

    // If we have identity context, allow it regardless of gaming context
    if (hasIdentityContext) {
      console.log('Identity context detected, continuing with analysis');
    }

    // Términos ace por idioma
    const aceTerms = {
      en: [
        'ace',
        'aces',
        'aroace',
        'asexual',
        'asexuals',
        'aromantic',
        'aros',
        'aro',
      ],
      es: [
        'ace',
        'aces',
        'aroace',
        'asexual',
        'asexuales',
        'aromántico',
        'aros',
        'aro',
      ],
      fr: [
        'ace',
        'aces',
        'aroace',
        'asexuel',
        'asexuels',
        'aromantique',
        'aros',
        'aro',
      ],
      de: [
        'ace',
        'aces',
        'aroace',
        'asexuell',
        'asexuelle',
        'aromantisch',
        'aros',
        'aro',
      ],
    };

    const currentAceTerms = aceTerms[detectedLanguage] || aceTerms.en;

    // Función simple de stemming
    const simpleStem = (word) => {
      word = word.toLowerCase();
      // Eliminar acentos
      word = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      // Eliminar sufijos comunes en varios idiomas
      const suffixes = ['ing', 'ed', 'es', 's', 'arse', 'se', 'er', 'en', 'e'];
      for (const suffix of suffixes) {
        if (word.endsWith(suffix) && word.length > suffix.length + 2) {
          return word.slice(0, -suffix.length);
        }
      }
      return word;
    };

    // Términos negativos por idioma (usando roots)
    const negativeTerms = {
      en: [
        'hate',
        'death',
        'kill',
        'die',
        'suicid',
        'should',
        'confus',
        'normal',
        'try',
        'need',
        'broke',
        'fix',
        'robot',
        'emotion',
        'phase',
        'therap',
        'cure',
        'treat',
      ],
      es: [
        'odi',
        'muert',
        'mat',
        'mor',
        'suicid',
        'deb',
        'confund',
        'normal',
        'intent',
        'necesit',
        'rot',
        'arregl',
        'robot',
        'emocion',
        'fas',
        'terap',
        'cur',
        'tratamient',
      ],
      fr: [
        'detest',
        'mort',
        'tue',
        'mour',
        'suicid',
        'devr',
        'confus',
        'normal',
        'essay',
        'besoin',
        'cass',
        'repar',
        'robot',
        'emot',
        'phase',
        'therap',
        'guer',
        'trait',
      ],
      de: [
        'hass',
        'tod',
        'tot',
        'sterb',
        'selbstmord',
        'soll',
        'verwirr',
        'normal',
        'versuch',
        'muss',
        'kaputt',
        'repar',
        'robot',
        'emotion',
        'phase',
        'therap',
        'heil',
        'behandl',
      ],
    };

    // Verificar términos negativos usando stemming manual
    const currentNegativeTerms =
      negativeTerms[detectedLanguage] || negativeTerms.en;
    const doc = nlp(text);
    const rootWords = doc.terms().map((term) => simpleStem(term.text()));

    console.log('Root words:', rootWords);
    console.log('Checking for negative terms:', currentNegativeTerms);

    // Primero buscar términos ace
    const aceIndices = [];
    rootWords.forEach((word, index) => {
      if (currentAceTerms.some((aceTerm) => word.includes(aceTerm))) {
        aceIndices.push(index);
      }
    });

    console.log('Found ace terms at indices:', aceIndices);

    // Luego buscar términos negativos cerca de los términos ace
    for (const aceIndex of aceIndices) {
      // Buscar en una ventana de 3 palabras antes y después
      const start = Math.max(0, aceIndex - 3);
      const end = Math.min(rootWords.length, aceIndex + 4);
      const window = rootWords.slice(start, end);

      console.log(
        `Checking window around ace term at index ${aceIndex}:`,
        window
      );

      for (const word of window) {
        if (currentNegativeTerms.some((negTerm) => word.includes(negTerm))) {
          console.log('Found negative term near ace term:', word);
          console.log('Negative context found, returning false');
          return false;
        }
      }
    }

    console.log('Content passed all filters, returning true');
    return true;
  },
};

export const filterRelevantPosts = (posts) => {
  if (!Array.isArray(posts)) return [];

  return posts.filter((post) => {
    if (!post || !post.text) return false;
    return aceFilters.isAppropriate(post.text, post);
  });
};
