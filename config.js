import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  
  // Configuración de Bluesky
  handle: process.env.BLUESKY_HANDLE,
  password: process.env.BLUESKY_PASSWORD,
  
  // Configuración del feed
  feedConfig: {
    name: 'ace-community',
    displayName: 'Comunidad Ace',
    description: 'Feed de contenido relacionado con la comunidad asexual y arromántica',
    avatar: process.env.FEED_AVATAR || 'https://ejemplo.com/avatar.jpg',
    createdBy: process.env.BLUESKY_HANDLE
  },
  
  // Configuración de caché
  cacheConfig: {
    stemCacheDuration: 1000 * 60 * 60, // 1 hora
    maxCacheEntries: 10000,
  },
  
  // Configuración de logs
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  
  // Límites y umbrales
  limits: {
    maxPostsPerRequest: 50,
    minScoreThreshold: 2,
    maxCacheAge: 1000 * 60 * 5, // 5 minutos
    maxCacheEntries: 1000,
    maxPostsPerFeed: 50,
    maxPostAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  },
  languages: {
    supported: ['en', 'es', 'de', 'fr'],
    default: 'en'
  },
  filtering: {
    minConfidenceScore: 0.7,
    minPostLength: 10,
    maxPostLength: 1000
  }
};

// Configuración por entorno
export const envConfig = {
  development: {
    debug: true,
    verbose: true,
  },
  production: {
    debug: false,
    verbose: false,
  },
  test: {
    debug: true,
    verbose: true,
    mock: true,
  }
}[process.env.NODE_ENV || 'development'];

export default { ...config, ...envConfig };