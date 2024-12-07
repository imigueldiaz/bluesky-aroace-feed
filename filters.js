import nlp from 'compromise';

export const aceFilters = {
  // Filter out potentially inappropriate or off-topic content
  isAppropriate: (text) => {
    const doc = nlp(text);

    // Check for explicit content markers
    const hasExplicitContent = doc.match('#Explicit').found;
    if (hasExplicitContent) return false;

    // Check for spam patterns
    const isSpam =
      doc.match('#Spam').found || text.match(/\b(buy|sell|discount|offer)\b/gi)?.length > 2;
    if (isSpam) return false;

    return true;
  },
};

export const sentimentConfig = {
  positive: [
    'pride',
    'happy',
    'valid',
    'acceptance',
    'community',
    'support',
    'love',
    'understanding',
    'authentic',
    'belonging',
  ],
  negative: [
    'hate',
    'invalid',
    'broken',
    'wrong',
    'sick',
    'unnatural',
    'confused',
    'phase',
    'lonely',
    'reject',
  ],
};
