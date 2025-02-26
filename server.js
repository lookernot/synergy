require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const winston = require('winston');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Initialize express app
const app = express();

// Security configurations
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX
});

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
            fontSrc: ["'self'", 'cdnjs.cloudflare.com', 'fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));
app.use(cors({
    origin: process.env.DOMAIN,
    credentials: true
}));
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }
}));
app.use(express.static('public')); // Serve static files from public directory
app.use('/public', express.static(path.join(__dirname, 'public'))); // Also serve with /public prefix

// Error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'production' ? 
            'Internal server error' : err.message
    });
});

// Routes
app.get('/api/power-data', (req, res) => {
    try {
        res.json({
            powerPercentage: Math.floor(Math.random() * (90 - 80 + 1)) + 80
        });
    } catch (error) {
        logger.error('Error in power-data endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'home.html'));
});

// Catch-all route for 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pages', '404.html'));
});

// For production hosting
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    logger.info(`Server running on port ${process.env.PORT || 3000}`);
});
