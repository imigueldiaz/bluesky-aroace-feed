import { describe, expect, it } from 'vitest';
import { analyze } from './analyze.js';

describe('analyze', () => {
  describe('WHEN the text is relevant', () => {
    it('SHOULD return true for exact match', () => {
      const result = analyze('I am asexual');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(true);
    });

    it('SHOULD return true for partial match', () => {
      const result = analyze('As an ace person, I feel...');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(true);
    });

    it('SHOULD return true for multiple matches', () => {
      const result = analyze('Being aroace is great!');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(true);
    });
  });

  describe('WHEN the text is not relevant', () => {
    it('SHOULD return false for unrelated text', () => {
      const result = analyze('Just a normal day');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(false);
    });

    it('SHOULD return false for similar but unrelated words', () => {
      const result = analyze('I got an ace in poker!');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(false);
    });

    it('SHOULD return false for partial matches in other words', () => {
      const result = analyze('The space race was interesting');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(false);
    });
  });

  describe('WHEN the text is empty or invalid', () => {
    it('SHOULD handle empty string', () => {
      const result = analyze('');
      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    it('SHOULD handle null or undefined', () => {
      const nullResult = analyze(null);
      const undefinedResult = analyze(undefined);
      expect(nullResult).toBeDefined();
      expect(nullResult).toBe(false);
      expect(undefinedResult).toBeDefined();
      expect(undefinedResult).toBe(false);
    });
  });
});
