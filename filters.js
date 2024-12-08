import nlp from 'compromise';
import { LanguageDetector } from './utils.js';
import { spamPatterns, getAllSensitiveTerms } from './filter-patterns.js';

export const aceFilters = {
  // Filtrar contenido inapropiado o fuera de tema
  isAppropriate: (text) => {
    if (!text) return true;

    const doc = nlp(text);
    const language = LanguageDetector.detect(text);
    const lowerText = text.toLowerCase();

    // Verificar patrones de spam según el idioma
    const spamPattern = spamPatterns[language] || spamPatterns.en;
    const spamCount = lowerText.match(spamPattern)?.length ?? 0;
    if (spamCount > 2) return false;

    // Verificar contenido sensible según el idioma
    const sensitiveTerms = getAllSensitiveTerms(language);
    const hasSensitiveContent = sensitiveTerms.some((term) => {
      // Buscar términos exactos o como parte de palabras más grandes
      const pattern = new RegExp(`\\b${term}\\b|${term}`, 'i');
      return pattern.test(lowerText);
    });

    if (hasSensitiveContent) return false;

    // Verificar el contexto general del texto
    const hasNegativeContext = doc.match('(hate|death|kill|die|suicide)').found;
    if (hasNegativeContext) return false;

    return true;
  },
};

export const filterRelevantPosts = (posts) => {
  if (!Array.isArray(posts)) return [];

  return posts.filter((post) => {
    if (!post || !post.text) return false;
    return aceFilters.isAppropriate(post.text);
  });
};
