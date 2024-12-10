import { describe, test, expect } from 'vitest';
import { analyze } from '../analyze.js';

describe('analyze', () => {
  describe('WHEN the text is relevant', () => {
    test('SHOULD return true for exact match', () => {
      const result = analyze('I am asexual');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(true);
    });

    test('SHOULD return true for partial match', () => {
      const result = analyze('As an ace person, I feel...');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(true);
    });

    test('SHOULD return true for multiple matches', () => {
      const result = analyze('Being aroace is great!');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(true);
    });
  });

  describe('WHEN the text is not relevant', () => {
    test('SHOULD return false for unrelated text', () => {
      const result = analyze('Just a normal day');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(false);
    });

    test('SHOULD return false for similar but unrelated words', () => {
      const result = analyze('I got an ace in poker!');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(false);
    });

    test('SHOULD return false for partial matches in other words', () => {
      const result = analyze('The space race was interesting');
      expect(result).toBeDefined();
      expect(result.isRelevant).toBe(false);
    });
  });

  describe('WHEN the text is empty or invalid', () => {
    test('SHOULD handle empty string', () => {
      const result = analyze('');
      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    test('SHOULD handle null', () => {
      const result = analyze(null);
      expect(result).toBeDefined();
      expect(result).toBe(false);
    });

    test('SHOULD handle undefined', () => {
      const result = analyze(undefined);
      expect(result).toBeDefined();
      expect(result).toBe(false);
    });
  });
});
