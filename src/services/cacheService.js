// In-memory cache for optimized performance
const NodeCache = require('node-cache');
const config = require('../config');

class CacheService {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.CACHE_TTL / 1000, // Convert to seconds
      checkperiod: 60, // Check for expired keys every 60 seconds
      useClones: false, // Optimize memory by storing references
      deleteOnExpire: true
    });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl = config.CACHE_TTL / 1000) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }

  // Generate cache key from headers
  generateCacheKey(country, gender, age) {
    return `${country}_${gender}_${age}`;
  }
}

// Singleton instance
module.exports = new CacheService();