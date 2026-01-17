const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('../config/db');
const blogRoutes = require('../routes/blogRoutes');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Connect to database on first request (lazy initialization)
let dbConnected = false;

app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(503).json({
        error: 'Database connection failed',
        message: 'The service is temporarily unavailable. Please check your MONGO_URI configuration.',
        status: 503
      });
    }
  }
  next();
});

// Middleware
app.use(compression());
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL || ''
    ].filter(Boolean),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve React frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API routes
app.use('/api/blogs', blogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), db: dbConnected ? 'connected' : 'connecting' });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// Export for Vercel serverless function
module.exports = app;

module.exports = app;
