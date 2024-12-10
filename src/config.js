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
    description:
      'Feed de contenido relacionado con la comunidad asexual y arromántica',
    avatar: process.env.FEED_AVATAR || 'https://ejemplo.com/avatar.jpg',
    createdBy: process.env.BLUESKY_HANDLE,
  },

  // Configuración de caché
  cacheConfig: {
    stemCacheDuration: 1000 * 60 * 60, // 1 hora
    maxCacheEntries: 10000,
  },

  // Configuración de logs
  logging: {
    // Si estamos bajo Nginx, usar el directorio de logs de Nginx, si no, usar el directorio actual
    logFile: process.env.NGINX_LOGS_DIR
      ? `${process.env.NGINX_LOGS_DIR}/aroace-feed.log`
      : './logs/aroace-feed.log',
    // Nivel de log: debug, info, warn, error
    level: process.env.LOG_LEVEL || 'info',
    // Si es false, solo escribe en archivo. Si es true, también muestra en consola
    console: process.env.LOG_CONSOLE !== 'false',
  },

  // Límites y umbrales
  limits: {
    maxPostsPerRequest: 50,
    minScoreThreshold: 2,
    maxCacheAge: 1000 * 60 * 5, // 5 minutos
    maxCacheEntries: 10000,
    maxPostsPerFeed: 50,
    maxPostAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxPostAgeHours: 24, // How long to keep posts in the database
    maxBatchSize: 100,
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  languages: {
    supported: ['en', 'es', 'de', 'fr'],
    default: 'en',
  },
  filtering: {
    minConfidenceScore: 0.7,
    minPostLength: 10,
    maxPostLength: 1000,
  },
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
  },
}[process.env.NODE_ENV || 'development'];

export default { ...config, ...envConfig };
