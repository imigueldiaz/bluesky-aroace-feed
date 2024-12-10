// keywords.js
export const keywords = {
  en: [
    // Asexual terms
    'asexual',
    'ace',
    'acespec',
    'asexuality',
    'demisexual',
    'graysexual',
    'greysexual',
    'aspec',
    'acespectrum',
    // Aromantic terms
    'aromantic',
    'aro',
    'arro',
    'arospec',
    'aromanticism',
    'demiromantic',
    'grayromantic',
    'greyromantic',
    'arospectrum',
    // Combined terms
    'aroace',
    'acearo',
    'aaro',
    'aace',
    // Community terms
    'lgbtqia',
    'queer',
    'pride',
    'identity',
    'orientation',
  ],

  es: [
    // Términos asexuales
    'asexual',
    'ace',
    'acespec',
    'asexualidad',
    'demisexual',
    'grisexual',
    'graysexual',
    'greysexual',
    'espectro asexual',
    'aspec',
    'espectro ace',
    'acespectro',
    // Términos aromáticos
    'aromático',
    'aromántica',
    'aro',
    'arro',
    'arospec',
    'arromántico',
    'arromántique',
    'demiromático',
    'demiromática',
    'griromático',
    'griromática',
    'grisromático',
    'grisromántique',
    'espectro aromático',
    'espectro aro',
    'arospectro',
    // Términos combinados
    'aroace',
    'acearo',
    'aaro',
    'aace',
    'arro ace',
    'ace arro',
    // Términos comunitarios
    'lgbtqia',
    'queer',
    'orgullo',
    'identidad',
    'orientación',
    // Términos coloquiales
    'asexualidad',
    'arrománticx',
    'aromáticx',
    // Hashtags comunes
    'comunidadace',
    'comunidadaro',
    'comunidadaroace',
    'orgulloace',
    'orgulloaro',
    'orgulloaroace',
  ],

  fr: [
    // Termes asexuels
    'asexuel',
    'asexuelle',
    'ace',
    'acespec',
    'asexualité',
    'demisexuel',
    'demisexuelle',
    'grisexuel',
    'grisexuelle',
    // Termes aromantiques
    'aromantique',
    'aro',
    'arospec',
    'aromanticism',
    'demiromantique',
    'grayromantic',
    'greyromantic',
    'arospectrum',
    // Termes combinés
    'aroace',
    'acearo',
    'aaro',
    'aace',
    // Termes communautaires
    'lgbtqia',
    'queer',
    'fierté',
    'identité',
    'orientation',
  ],

  de: [
    // Asexuelle Begriffe
    'asexuell',
    'ace',
    'acespec',
    'asexualität',
    'demisexuell',
    'grausexuell',
    'aspektrum',
    // Aromantische Begriffe
    'aromantisch',
    'aro',
    'arospec',
    'demiromantisch',
    'grauromantisch',
    'arospektrum',
    // Kombinierte Begriffe
    'aroace',
    'acearo',
    'aaro',
    'aace',
    // Gemeinschaftsbegriffe
    'lgbtqia',
    'queer',
    'stolz',
    'identität',
    'orientierung',
  ],

  // Microlabels comunes en todos los idiomas
  microlabels: [
    'aceflux',
    'acefluido',
    'acefluid',
    'acefluidité',
    'acefluide',
    'acefluidität',
    'aego',
    'aegoace',
    'aegoro',
    'apl',
    'aplatonic',
    'cupio',
    'cupioace',
    'cupioro',
    'fray',
    'frayace',
    'frayro',
    'kas',
    'kaul',
    'kaulace',
    'lit',
    'litho',
    'lithoace',
    'myr',
    'myrace',
    'novi',
    'novo',
    'novoace',
    'plac',
    'placio',
    'placioace',
  ],

  // Hashtags multilingües
  hashtags: [
    '#ace',
    '#asexual',
    '#asexuel',
    '#asexuell',
    '#aspec',
    '#acespec',
    '#acepride',
    '#asexualpride',
    '#acecommunity',
    '#acevisibility',
    '#aceweek',
    '#aceday',
    '#acemonth',
    '#asexualawarenessweek',
    '#asexualität',
    '#asexualite',
    '#asexualidad',
    '#demisexual',
    '#demisexuel',
    '#demisexuell',
    '#aromantic',
    '#aromantique',
    '#aromantisch',
    '#greyace',
    '#grayace',
    '#grisace',
    '#grauace',
    '#greyromantic',
    '#grayromantic',
    '#grisromantico',
    '#grisromantique',
    '#grauromantisch',
    '#homoromantic',
    '#biromantic',
    '#heteroromantic',
    '#homoromantisch',
    '#biromantisch',
    '#heteroromantisch',
    '#homoromantique',
    '#biromantique',
    '#heteroromantique',
    '#homoromantico',
    '#birromantico',
    '#heteroromantico',
  ],

  // Términos de comunidad
  community: {
    symbols: [
      'ace ring',
      'black ring',
      'white ring',
      'anillo ace',
      'anillo negro',
      'anillo blanco',
      'bague ace',
      'bague noire',
      'bague blanche',
      'ace ring',
      'schwarzer ring',
      'weißer ring',
    ],
    culture: [
      'dragon ace',
      'dragón ace',
      'acedrache',
      'ace cake',
      'pastel ace',
      'gâteau ace',
      'acekuchen',
      'ace space',
      'espacio ace',
      'espace ace',
      'ace-raum',
    ],
    emoji_patterns: [
      '🖤💜🤍', // colores bandera ace
      '🤍💚🖤', // colores bandera aro
      '💜🖤', // corazones ace
      '💚🖤', // corazones aro
      '🏳️ ace',
      '🏳️ aro',
      '🐉 ace', // dragón
      '🍰 ace', // pastel
      '💍 ace', // anillo
    ],
  },
};

// Función helper para obtener todas las keywords en un solo Set
export function getAllKeywords() {
  const allKeywords = new Set();

  // Función recursiva para añadir palabras de objetos anidados
  function addKeywordsFromObject(obj) {
    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) {
        value.forEach((keyword) => allKeywords.add(keyword.toLowerCase()));
      } else if (typeof value === 'object') {
        addKeywordsFromObject(value);
      }
    }
  }

  addKeywordsFromObject(keywords);
  return allKeywords;
}

export default keywords;
