const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const debugRoutes = require('./routes/debug');

const app = express();

const PORT = process.env.PORT || 4001;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventsphere-auth';

// ✅ CORS whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventrix613.vercel.app', // Vercel frontend
  'https://eventrix613-git-main-anilas-projects-dcd2cf5.vercel.app', // Vercel preview (if needed)
  'https://wonderful-water-07646600f.3.azurestaticapps.net',
  'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
];

// ✅ CORS middleware (simple, no manual error throwing)
app.use(
  cors({
    origin: allowedOrigins, // allow only these origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Parse JSON bodies
app.use(express.json());

// ✅ Routes (base paths must match frontend)
app.use('/auth', authRoutes);   // /auth/register, /auth/login, etc.
app.use('/debug', debugRoutes);

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Auth service is running', timestamp: new Date() });
});

// ✅ MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Auth service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
