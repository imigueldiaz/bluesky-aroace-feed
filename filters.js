import nlp from 'compromise';
import { keywords } from './keywords.js';
import { LanguageDetector } from './utils.js';

export const aceFilters = {
  // Check if post contains ace/aro related content
  isAceAroContent: (text) => {
    const language = LanguageDetector.detect(text);
    const lowerText = text.toLowerCase();
    
    // Check for ace/aro keywords with word boundaries
    const relevantKeywords = keywords[language] || keywords.en;
    return relevantKeywords.some(keyword => {
      // Escape special characters and create pattern
      const escapedKeyword = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
      return pattern.test(lowerText);
    });
  },

  // Filter out potentially inappropriate or off-topic content
  isAppropriate: (text) => {
    const doc = nlp(text);
    
    // Check for explicit content markers
    const hasExplicitContent = doc.match('#Explicit').found;
    if (hasExplicitContent) return false;
    
    // Check for spam patterns
    const isSpam = doc.match('#Spam').found ||
      text.match(/\b(buy|sell|discount|offer)\b/gi)?.length > 2;
    if (isSpam) return false;
    
    return true;
  },

  // Calculate relevance score for sorting
  getRelevanceScore: (text) => {
    const language = LanguageDetector.detect(text);
    const lowerText = text.toLowerCase();
    const relevantKeywords = keywords[language] || keywords.en;
    let score = 0;
    
    // Score based on keyword matches with word boundaries
    relevantKeywords.forEach(keyword => {
      const escapedKeyword = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
      const matches = (text.match(pattern) || []).length;
      score += matches;
    });
    
    return score;
  }
};

export const sentimentConfig = {
  positive: [
    'pride', 'happy', 'valid', 'acceptance', 'community',
    'support', 'love', 'understanding', 'authentic', 'belonging'
  ],
  negative: [
    'hate', 'invalid', 'broken', 'wrong', 'sick',
    'unnatural', 'confused', 'phase', 'lonely', 'reject'
  ]
};