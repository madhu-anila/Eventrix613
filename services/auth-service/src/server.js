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
  'https://eventrix613.vercel.app', // ✅ Vercel frontend
  'https://wonderful-water-07646600f.3.azurestaticapps.net',
  'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
];

// ✅ CORS middleware (must be before routes)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / curl, server-to-server
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Handle preflight explicitly (safety)
//app.options('*', cors());

app.use(express.json());

// ✅ Routes (match what frontend is calling!)
app.use('/auth', authRoutes);   // ⬅ changed from '/api/auth'
app.use('/debug', debugRoutes); // ⬅ changed from '/api/debug'

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
