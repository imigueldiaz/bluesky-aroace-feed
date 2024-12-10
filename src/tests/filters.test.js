/* eslint-disable no-console */
/**
 * ⚠️ TRIGGER WARNING ⚠️
 * This test file contains examples of hate speech, discriminatory language, and other
 * potentially triggering content that are used to validate the content filtering system.
 * These examples are necessary for testing purposes but may be distressing to read.
 * Please exercise caution when reviewing this file.
 */

import { describe, test, expect } from 'vitest';
import { aceFilters } from '../filters.js';

describe('aceFilters', () => {
  describe('isAppropriate', () => {
    // Helper para crear un post de prueba
    const createTestPost = (text, langs = []) => ({
      text,
      record: {
        text,
        langs,
      },
    });

    // Tests for empty or invalid input
    test('should return true for empty text', () => {
      expect(aceFilters.isAppropriate('')).toBe(true);
      expect(aceFilters.isAppropriate(null)).toBe(true);
      expect(aceFilters.isAppropriate(undefined)).toBe(true);
    });

    // Positive tests - English
    test('should allow positive English content about ace/aro community', () => {
      const positiveTexts = [
        'Being asexual is a beautiful part of who I am',
        'The aroace community has given me so much support and understanding',
        'Celebrating ace week with my amazing friends!',
        'Finding out I was ace helped me understand myself better',
        'Proud to be part of the ace spectrum community',
      ];

      positiveTexts.forEach((text) => {
        const post = createTestPost(text, ['en']);
        expect(aceFilters.isAppropriate(text, post)).toBe(true);
      });
    });

    // Negative tests - English
    test('should filter out negative English content targeting ace/aro community', () => {
      const negativeTexts = [
        'I hate how asexuals try to be part of LGBT',
        'Aces should die because they are not normal',
        'These ace people need to kill themselves',
        'Death to all aroace people',
        'Asexuals are just confused and need to die',
      ];

      negativeTexts.forEach((text) => {
        const post = createTestPost(text, ['en']);
        expect(aceFilters.isAppropriate(text, post)).toBe(false);
      });
    });

    // Positive tests - Spanish
    test('should allow positive Spanish content about ace/aro community', () => {
      const positiveTexts = [
        'Ser asexual es una parte hermosa de mi identidad',
        'La comunidad aroace me ha dado tanto apoyo y comprensión',
        'Celebrando la semana ace con mis amigos increíbles',
        'Descubrir que soy ace me ayudó a entenderme mejor',
        'Orgulloso de ser parte del espectro asexual',
      ];

      positiveTexts.forEach((text) => {
        const post = createTestPost(text, ['es']);
        expect(aceFilters.isAppropriate(text, post)).toBe(true);
      });
    });

    // Negative tests - Spanish
    test('should filter out negative Spanish content targeting ace/aro community', () => {
      const negativeTexts = [
        'Odio como los asexuales intentan ser parte de LGBT',
        'Los aces deberían morir porque no son normales',
        'Esta gente ace necesita suicidarse',
        'Muerte a todos los aroace',
        'Los asexuales están confundidos y deben morir',
      ];

      negativeTexts.forEach((text) => {
        const post = createTestPost(text, ['es']);
        expect(aceFilters.isAppropriate(text, post)).toBe(false);
      });
    });

    // Positive tests - French
    test('should allow positive French content about ace/aro community', () => {
      const positiveTexts = [
        'Être asexuel est une belle partie de mon identité',
        "La communauté aroace m'a tellement soutenu et compris",
        'Je célèbre la semaine ace avec mes amis formidables',
        "Découvrir que je suis ace m'a aidé à mieux me comprendre",
        'Fier de faire partie de la communauté asexuelle',
      ];

      positiveTexts.forEach((text) => {
        const post = createTestPost(text, ['fr']);
        expect(aceFilters.isAppropriate(text, post)).toBe(true);
      });
    });

    // Negative tests - French
    test('should filter out negative French content targeting ace/aro community', () => {
      const negativeTexts = [
        'Je déteste comment les asexuels essaient de faire partie des LGBT',
        'Les aces devraient mourir car ils ne sont pas normaux',
        'Ces personnes ace doivent se suicider',
        'Mort à tous les aroace',
        'Les asexuels sont juste confus et doivent mourir',
      ];

      negativeTexts.forEach((text) => {
        const post = createTestPost(text, ['fr']);
        expect(aceFilters.isAppropriate(text, post)).toBe(false);
      });
    });

    // Positive tests - German
    test('should allow positive German content about ace/aro community', () => {
      const positiveTexts = [
        'Asexuell zu sein ist ein schöner Teil meiner Identität',
        'Die Aroace-Gemeinschaft hat mir so viel Unterstützung gegeben',
        'Feiere die Ace-Woche mit meinen tollen Freunden',
        'Zu entdecken, dass ich ace bin, half mir, mich besser zu verstehen',
        'Stolz darauf, Teil des asexuellen Spektrums zu sein',
      ];

      positiveTexts.forEach((text) => {
        const post = createTestPost(text, ['de']);
        expect(aceFilters.isAppropriate(text, post)).toBe(true);
      });
    });

    // Negative tests - German
    test('should filter out negative German content targeting ace/aro community', () => {
      const negativeTexts = [
        'Ich hasse wie Asexuelle versuchen Teil der LGBT zu sein',
        'Aces sollten sterben, weil sie nicht normal sind',
        'Diese Ace-Leute müssen sich umbringen',
        'Tod allen Aroace-Menschen',
        'Asexuelle sind nur verwirrt und sollten sterben',
      ];

      negativeTexts.forEach((text) => {
        const post = createTestPost(text, ['de']);
        expect(aceFilters.isAppropriate(text, post)).toBe(false);
      });
    });

    // Tests for spam detection
    test('should filter out spam content', () => {
      const spamTexts = [
        'ace ace ace ace ace ace ace', // Repetitive
        'asexual asexual asexual asexual', // Repetitive
        'FREE ACE DATING SITE CLICK HERE', // Spam-like
        'CHEAP ACE MERCHANDISE BUY NOW', // Spam-like
        'ace ace ace win free prize now', // Mixed spam
      ];

      spamTexts.forEach((text) => {
        const post = createTestPost(text, ['en']);
        expect(aceFilters.isAppropriate(text, post)).toBe(false);
      });
    });

    // Tests for context sensitivity
    test('should handle context-sensitive cases appropriately', () => {
      // Positive contexts
      expect(
        aceFilters.isAppropriate(
          'As an ace person, I feel alive and happy with who I am',
          createTestPost(
            'As an ace person, I feel alive and happy with who I am',
            ['en']
          )
        )
      ).toBe(true);

      // Gaming contexts (should be filtered)
      expect(
        aceFilters.isAppropriate(
          'Got an ace in poker last night!',
          createTestPost('Got an ace in poker last night!', ['en'])
        )
      ).toBe(false);

      // Mixed contexts
      expect(
        aceFilters.isAppropriate(
          'Being ace is great, unlike getting an ace in poker',
          createTestPost('Being ace is great, unlike getting an ace in poker', [
            'en',
          ])
        )
      ).toBe(true);
    });

    // Tests for language detection fallback
    test('should use language detection when langs is not available', () => {
      const germanText = 'Tod allen Aroace-Menschen';
      expect(aceFilters.isAppropriate(germanText)).toBe(false);

      const frenchText = 'Je déteste les asexuels';
      expect(aceFilters.isAppropriate(frenchText)).toBe(false);
    });
  });
});
