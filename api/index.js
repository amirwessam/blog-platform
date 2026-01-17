const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('../config/db');
const blogRoutes = require('../routes/blogRoutes');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Initialize database connection
connectDB();

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

// API routes
app.use('/api/blogs', blogRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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
