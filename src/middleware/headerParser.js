const logger = require('../utils/logger');

const headerParser = (req, res, next) => {
  const country = (req.headers['x-country'] || 'any').toLowerCase();
  const gender = (req.headers['x-gender'] || 'any').toLowerCase();
  const age = (req.headers['x-age'] || 'any').toLowerCase();
  
  req.parsedHeaders = {
    country: country !== 'any' ? country.toUpperCase() : 'any',
    gender: gender !== 'any' ? gender : 'any',
    age: age !== 'any' ? age : 'any'
  };
  
  logger.info('Headers received', {
    country: req.parsedHeaders.country,
    gender: req.parsedHeaders.gender,
    age: req.parsedHeaders.age,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  next();
};

module.exports = headerParser;