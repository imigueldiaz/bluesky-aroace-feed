import keywords from './keywords';
import { LanguageDetector } from './utils';
import { hasGamingContext } from './filter-patterns.js';

const SPECIAL_CHARS_PATTERN = /[.*+?^${}()|[\]\\]/g;
const keywordPatternsCache = new Map();

// Create and cache a regex pattern for a keyword
const getKeywordPattern = (keyword) => {
  const lowercaseKeyword = keyword.toLowerCase();
  let pattern = keywordPatternsCache.get(lowercaseKeyword);

  if (!pattern) {
    const escapedKeyword = lowercaseKeyword.replace(
      SPECIAL_CHARS_PATTERN,
      '\\$&'
    );
    // Only match whole words, not parts of other words
    pattern = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
    keywordPatternsCache.set(lowercaseKeyword, pattern);
  }

  return pattern;
};

export function analyze(text) {
  if (!text) return false;

  let matchedKeywords = [];
  let relevanceScore = 0;

  const language = LanguageDetector.detect(text);
  const relevantKeywords = keywords[language] || keywords.en;
  const lowerText = text.toLowerCase();

  // First check if we're in a gaming context when "ace" is present
  const hasAce = lowerText.includes('ace');
  const isInGamingContext = hasAce && hasGamingContext(text, language);
  const hasIdentityContext =
    lowerText.includes('being ace') ||
    lowerText.includes('am ace') ||
    lowerText.includes('identify as ace') ||
    lowerText.includes('aroace');

  // Process each keyword
  for (const keyword of relevantKeywords) {
    const pattern = getKeywordPattern(keyword);
    const matches = (lowerText.match(pattern) || []).length;

    if (matches > 0) {
      // For "ace", handle mixed contexts
      if (keyword.toLowerCase() === 'ace') {
        if (isInGamingContext && !hasIdentityContext) {
          continue; // Skip only if in gaming context without identity context
        }
      }
      relevanceScore += matches;
      matchedKeywords.push(keyword);
    }
  }

  return {
    isRelevant: relevanceScore > 0,
    matchedKeywords,
    relevanceScore,
  };
}
