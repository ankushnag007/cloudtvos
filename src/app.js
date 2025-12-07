const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const configRoutes = require('./routes/configRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'HEAD'],
  allowedHeaders: ['X-Country', 'X-Gender', 'X-Age', 'Content-Type'],
  exposedHeaders: ['Content-Length', 'X-Response-Time'],
  maxAge: 600, // 10 minutes
  credentials: true
}));

// Compression middleware (gzip)
app.use(compression({
  level: 6, // Optimal compression level
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
  });
  
  next();
});

// Routes
app.use('/', configRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
});

// Add this import
const responseTimeLogger = require('./middleware/responseTimeLogger');

// Add this middleware after security middleware
app.use(responseTimeLogger);
// Global error handler
app.use(errorHandler);


module.exports = app;