const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');

class ConfigService {
  constructor() {
    this.jsonFilesPath = path.resolve(config.JSON_FILES_PATH);
    this.fallbackFile = 'any_any_any.json';
  }

  async getConfig(country, gender, age) {
    // Generate filename based on headers
    const fileName = `${country}_${gender}_${age}.json`;
    const cacheKey = cacheService.generateCacheKey(country, gender, age);
    
    // Check cache first
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      logger.debug('Cache hit', { fileName, cacheKey });
      return cachedData; // Return cached JSON data directly
    }

    logger.debug('Cache miss', { fileName, cacheKey });

    try {
      // Try to read the specific file
      const filePath = path.join(this.jsonFilesPath, fileName);
      const data = await this.readFile(filePath);
      
      // Add metadata to the JSON (optional)
      data._metadata = {
        sourceFile: fileName,
        timestamp: new Date().toISOString(),
        headersUsed: {
          country: country === 'any' ? null : country,
          gender: gender === 'any' ? null : gender,
          age: age === 'any' ? null : age
        }
      };
      
      // Cache the data
      cacheService.set(cacheKey, data);
      
      logger.info('File selected', { fileName, cacheKey });
      return data; // Return JSON data directly
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File not found, try fallback
        logger.debug('File not found, trying fallback', { fileName });
        
        try {
          const fallbackPath = path.join(this.jsonFilesPath, this.fallbackFile);
          const fallbackData = await this.readFile(fallbackPath);
          
          // Add fallback metadata
          fallbackData._metadata = {
            sourceFile: this.fallbackFile,
            requestedFile: fileName,
            isFallback: true,
            timestamp: new Date().toISOString(),
            headersUsed: {
              country: country === 'any' ? null : country,
              gender: gender === 'any' ? null : gender,
              age: age === 'any' ? null : age
            }
          };
          
          // Cache the fallback response
          cacheService.set(cacheKey, fallbackData);
          
          logger.info('Fallback file selected', { 
            requestedFile: fileName, 
            fallbackFile: this.fallbackFile 
          });
          return fallbackData; // Return fallback JSON data directly
        } catch (fallbackError) {
          logger.error('Fallback file not found', { error: fallbackError.message });
          throw new Error('Configuration file not found');
        }
      } else {
        logger.error('Error reading config file', { 
          fileName, 
          error: error.message 
        });
        throw error;
      }
    }
  }

  async readFile(filePath) {
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const parsedData = JSON.parse(fileContent);
      return parsedData;
    } catch (error) {
      if (error instanceof SyntaxError) {
        logger.error('Invalid JSON in file', { filePath, error: error.message });
        throw new Error('Invalid configuration file format');
      }
      throw error;
    }
  }
}

module.exports = new ConfigService();