import keywords from './keywords';
import { LanguageDetector } from './utils';

export const analyze = (text) => {
  let matchedKeywords = [];
  let relevanceScore = 0;

  const language = LanguageDetector.detect(text);
  const relevantKeywords = keywords[language] || keywords.en;

  relevantKeywords.forEach((keyword) => {
    // Escape special characters and create pattern
    const escapedKeyword = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\b${escapedKeyword}\\b`, 'i');

    // Score based on keyword matches with word boundaries
    const lowerText = text.toLowerCase();
    const matches = (lowerText.match(pattern) || []).length;
    relevanceScore += matches;

    // Get matched keywords for debugging
    if (matches > 0) {
      matchedKeywords.push(keyword);
    }
  });

  return {
    isRelevant: relevanceScore > 0,
    matchedKeywords,
    relevanceScore,
  };
};
