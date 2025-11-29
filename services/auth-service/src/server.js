const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const debugRoutes = require('./routes/debug');

const app = express();

const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventsphere-auth';

// ✅ CORS options
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://eventrix613.vercel.app', // ✅ your Vercel frontend
    'https://wonderful-water-07646600f.3.azurestaticapps.net',
    'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// ✅ Middleware
app.use(cors(corsOptions));
// ✅ Explicitly handle preflight
app.options('*', cors(corsOptions));

app.use(express.json());

// ✅ Routes
// keep old prefix if anything still uses it
app.use('/api/auth', authRoutes);
// and ALSO expose the path your frontend is calling:
app.use('/auth', authRoutes);

app.use('/api/debug', debugRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Auth service is running', timestamp: new Date() });
});

// MongoDB connection
mongoose.connect(MONGO_URI)
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
