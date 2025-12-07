const logger = require("../utils/logger");

const responseTimeLogger = (req, res, next) => {
  const start = process.hrtime();
  const requestId = Date.now() + Math.random().toString(36).substr(2, 9);

  req.requestId = requestId;

  logger.info("Incoming Request", {
    requestId,
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    query: req.query,
    headers: {
      country: req.headers["x-country"] || "not-provided",
      gender: req.headers["x-gender"] || "not-provided",
      age: req.headers["x-age"] || "not-provided",
    },
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    timestamp: new Date().toISOString(),
  });

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const responseTime = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds

    let performance = "good";
    if (responseTime > 100) performance = "slow";
    if (responseTime > 500) performance = "very-slow";
    if (responseTime > 1000) performance = "critical";

    logger.info("Request Completed", {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      responseTime: `${responseTime.toFixed(2)}ms`,
      responseTimeMs: responseTime,
      performance,
      contentLength: res.get("Content-Length") || 0,
      cacheStatus: res.get("X-Cache") || "miss",
      ip: req.ip,
      userAgent: req.get("user-agent"),
      timestamp: new Date().toISOString(),
    });

    res.setHeader("X-Response-Time", `${responseTime.toFixed(2)}ms`);
    res.setHeader("X-Performance", performance);
  });

  next();
};

module.exports = responseTimeLogger;
