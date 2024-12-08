import { describe, expect, it } from 'vitest';
import { analyze } from './analyze';

describe('analyze', () => {
  describe('WHEN the text is relevant', () => {
    const relevantText =
      'This text contains the following relevant keywords: aroace, acespec, aromantic.';

    it('SHOULD identify relevant content', () => {
      const { isRelevant } = analyze(relevantText);
      expect(isRelevant).toBe(true);
    });

    it('SHOULD get matched keywords', () => {
      const { matchedKeywords } = analyze(relevantText);
      expect(matchedKeywords).toEqual(expect.arrayContaining(['aroace', 'acespec', 'aromantic']));
    });

    it('SHOULD calculate relevance score', () => {
      const { relevanceScore } = analyze(relevantText);
      expect(relevanceScore).toBe(3);
    });
  });
  describe('WHEN the text is NOT relevant', () => {
    const nonRelevantText = 'This is a text containing non relevant content';

    it('SHOULD NOT identify relevant content', () => {
      const { isRelevant } = analyze(nonRelevantText);
      expect(isRelevant).toBe(false);
    });

    it('SHOULD NOT get matched keywords', () => {
      const { matchedKeywords } = analyze(nonRelevantText);
      expect(matchedKeywords.length).toBe(0);
    });

    it('SHOULD return a relevance score of 0', () => {
      const { relevanceScore } = analyze(nonRelevantText);
      expect(relevanceScore).toBe(0);
    });
  });
});
