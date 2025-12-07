const configService = require("../services/configService");
const logger = require("../utils/logger");

class ConfigController {
  async getConfig(req, res, next) {
    const startTime = Date.now();
    const { country, gender, age } = req.parsedHeaders;

    try {
      const configData = await configService.getConfig(country, gender, age);

      const responseTime = Date.now() - startTime;

      logger.info("Config delivered", {
        country,
        gender,
        age,
        responseTime: `${responseTime}ms`,
        fileSelected: `${country}_${gender}_${age}.json`,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      res.set("X-Response-Time", `${responseTime}ms`);
      res.set("Cache-Control", "public, max-age=300");
      res.set("Content-Type", "application/json; charset=utf-8");

      res.json(configData);
    } catch (error) {
      const responseTime = Date.now() - startTime;
      logger.error("Request failed", {
        country,
        gender,
        age,
        responseTime: `${responseTime}ms`,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      next(error);
    }
  }
}

module.exports = new ConfigController();
