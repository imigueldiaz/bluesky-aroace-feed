import { describe, it, expect, vi } from 'vitest';
import { aceFilters, filterRelevantPosts } from './filters.js';

vi.mock('./utils.js', () => ({
  LanguageDetector: {
    detect: (text) => {
      if (text.includes('comprar')) return 'es';
      if (text.includes('kaufen')) return 'de';
      if (text.includes('acheter')) return 'fr';
      return 'en';
    },
  },
}));

describe('aceFilters', () => {
  describe('isAppropriate', () => {
    it('should return true for appropriate content', () => {
      const text = 'This is a nice post about being aromantic and asexual';
      expect(aceFilters.isAppropriate(text)).toBe(true);
    });

    it('should return false for spam content in English', () => {
      const text = 'buy buy buy discount offer promo click win';
      expect(aceFilters.isAppropriate(text)).toBe(false);
    });

    it('should return false for spam content in Spanish', () => {
      const text = 'comprar vender descuento oferta promo';
      expect(aceFilters.isAppropriate(text)).toBe(false);
    });

    it('should return false for spam content in German', () => {
      const text = 'kaufen verkaufen rabatt angebot promo';
      expect(aceFilters.isAppropriate(text)).toBe(false);
    });

    it('should return false for spam content in French', () => {
      const text = 'acheter vendre réduction offre promo';
      expect(aceFilters.isAppropriate(text)).toBe(false);
    });

    it('should return false for explicit content', () => {
      const text = 'This post contains nsfw content';
      expect(aceFilters.isAppropriate(text)).toBe(false);
    });

    it('should return false for aroacePhobic content', () => {
      const text = "You just haven't found the right person yet";
      expect(aceFilters.isAppropriate(text)).toBe(false);
    });

    it('should return false for trigger warning content', () => {
      const text = 'Content warning: This post contains mentions of suicide';
      expect(aceFilters.isAppropriate(text)).toBe(false);
    });

    it('should return true for empty text', () => {
      expect(aceFilters.isAppropriate('')).toBe(true);
      expect(aceFilters.isAppropriate(null)).toBe(true);
      expect(aceFilters.isAppropriate(undefined)).toBe(true);
    });
  });
});

describe('filterRelevantPosts', () => {
  it('should filter out inappropriate posts', () => {
    const posts = [
      { text: 'A nice post about being aroace' },
      { text: 'buy buy buy discount offer' },
      { text: 'Another good post' },
      { text: 'nsfw content here' },
    ];

    const filtered = filterRelevantPosts(posts);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].text).toBe('A nice post about being aroace');
    expect(filtered[1].text).toBe('Another good post');
  });

  it('should handle empty or invalid input', () => {
    expect(filterRelevantPosts([])).toEqual([]);
    expect(filterRelevantPosts(null)).toEqual([]);
    expect(filterRelevantPosts(undefined)).toEqual([]);
    expect(
      filterRelevantPosts([null, undefined, { text: 'valid post' }])
    ).toEqual([{ text: 'valid post' }]);
  });
});
