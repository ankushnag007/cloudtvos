require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 900000, 
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100, // Limit each IP to 100 requests per windowMs
  CACHE_TTL: process.env.CACHE_TTL || 300000, 
  JSON_FILES_PATH: process.env.JSON_FILES_PATH || './src/data/jsonFiles/'
};