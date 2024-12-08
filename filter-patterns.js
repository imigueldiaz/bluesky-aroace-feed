// Spam patterns by language
export const spamPatterns = {
  en: /\b(buy|sell|discount|offer|promo|click|win|sale|deal)\b/gi,
  es: /\b(comprar|vender|descuento|oferta|promo|clic|ganar|venta|promoción)\b/gi,
  de: /\b(kaufen|verkaufen|rabatt|angebot|promo|klicken|gewinnen|verkauf)\b/gi,
  fr: /\b(acheter|vendre|réduction|offre|promo|cliquer|gagner|vente|promotion)\b/gi,
};

// Potentially sensitive or harmful content
const SENSITIVE_CONTENT = {
  en: [
    // Explicit content
    'nsfw',
    'explicit',
    'xxx',
    'porn',
    // Potentially harmful terms for the aroace community
    'broken',
    'fix you',
    'not human',
    'robot',
    'emotionless',
    "just haven't found",
    "haven't met",
    "haven't found",
    'will change',
    'phase',
    'grow out',
    'get over it',
    'everyone feels',
    'everyone experiences',
    'normal people',
    'conversion therapy',
    'cure',
    'treatment',
    'heal',
    // Violence or disturbing content
    'suicide',
    'death',
    'kill',
    'die',
    'blood',
    'trigger warning',
  ],
  es: [
    // Contenido explícito
    'nsfw',
    'explícito',
    'xxx',
    'porno',
    // Términos potencialmente hirientes para la comunidad aroace
    'roto',
    'arreglarte',
    'no humano',
    'robot',
    'sin emociones',
    'no has encontrado',
    'no has conocido',
    'cambiará',
    'fase',
    'superarás',
    'todo el mundo siente',
    'todo el mundo experimenta',
    'gente normal',
    'terapia de conversión',
    'cura',
    'tratamiento',
    'sanar',
    // Violencia o contenido perturbador
    'suicidio',
    'muerte',
    'matar',
    'morir',
    'sangre',
    'aviso de contenido sensible',
  ],
  de: [
    // Expliziter Inhalt
    'nsfw',
    'explizit',
    'xxx',
    'porno',
    // Potenziell verletzende Begriffe für die aroace Gemeinschaft
    'kaputt',
    'reparieren',
    'nicht menschlich',
    'roboter',
    'emotionslos',
    'noch nicht gefunden',
    'noch nicht getroffen',
    'wird sich ändern',
    'phase',
    'wächst sich aus',
    'jeder fühlt',
    'jeder erlebt',
    'normale menschen',
    'konversionstherapie',
    'heilung',
    'behandlung',
    'heilen',
    // Gewalt oder verstörender Inhalt
    'selbstmord',
    'tod',
    'töten',
    'sterben',
    'blut',
    'triggerwarnung',
  ],
  fr: [
    // Contenu explicite
    'nsfw',
    'explicite',
    'xxx',
    'porno',
    // Termes potentiellement blessants pour la communauté aroace
    'cassé',
    'réparer',
    'pas humain',
    'robot',
    'sans émotions',
    "n'as pas trouvé",
    "n'as pas rencontré",
    'changera',
    'phase',
    'passera',
    'tout le monde ressent',
    'tout le monde expérimente',
    'gens normaux',
    'thérapie de conversion',
    'guérison',
    'traitement',
    'guérir',
    // Violence ou contenu perturbant
    'suicide',
    'mort',
    'tuer',
    'mourir',
    'sang',
    'avertissement de contenu',
  ],
};

// Gaming and sports contexts
export const gamingContexts = {
  en: {
    before: [
      'poker',
      'tennis',
      'playing',
      'played',
      'got',
      'got an',
      'dealt',
      'dealt an',
    ],
    after: [
      'card',
      'cards',
      'serve',
      'player',
      'game',
      'pilot',
      'of spades',
      'of hearts',
      'of diamonds',
      'of clubs',
      'in poker',
      'in tennis',
    ],
  },
  es: {
    before: [
      'poker',
      'tenis',
      'jugando',
      'jugué',
      'saqué',
      'saqué un',
      'tengo',
      'tengo un',
    ],
    after: [
      'carta',
      'cartas',
      'servicio',
      'jugador',
      'juego',
      'piloto',
      'de espadas',
      'de corazones',
      'de diamantes',
      'de tréboles',
    ],
  },
  de: {
    before: ['poker', 'tennis', 'spielen', 'gespielt', 'habe', 'habe ein'],
    after: [
      'karte',
      'karten',
      'aufschlag',
      'spieler',
      'spiel',
      'pilot',
      'pik',
      'herz',
      'karo',
      'kreuz',
    ],
  },
  fr: {
    before: ['poker', 'tennis', 'jouer', 'joué', 'avoir', 'avoir un'],
    after: [
      'carte',
      'cartes',
      'service',
      'joueur',
      'jeu',
      'pilote',
      'pique',
      'coeur',
      'carreau',
      'trèfle',
    ],
  },
};

// Function to detect gaming context in text
export function hasGamingContext(text, language = 'en') {
  text = text.toLowerCase();

  // Check for gaming context words before "ace"
  const beforeWords =
    gamingContexts[language]?.before || gamingContexts.en.before;
  const hasBeforeContext = beforeWords.some((word) => {
    const beforeAce = text.indexOf('ace');
    const beforeText = text.substring(0, beforeAce).toLowerCase();
    return beforeText.includes(word.toLowerCase());
  });

  // Check for gaming context words after "ace"
  const afterWords = gamingContexts[language]?.after || gamingContexts.en.after;
  const hasAfterContext = afterWords.some((word) => {
    const afterAce = text.indexOf('ace') + 3;
    const afterText = text.substring(afterAce).toLowerCase();
    return afterText.includes(word.toLowerCase());
  });

  return hasBeforeContext || hasAfterContext;
}

// Get sensitive terms for a specific language
export const getAllSensitiveTerms = (language) => {
  return SENSITIVE_CONTENT[language] || SENSITIVE_CONTENT.en;
};
