const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./routes/events');

const app = express();

const PORT = process.env.PORT || 4002;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventsphere-events';

// ✅ CORS whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventrix613.vercel.app', // ✅ Vercel production
  'https://wonderful-water-07646600f.3.azurestaticapps.net',
  'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
];

// ✅ CORS middleware (before routes)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / curl etc.
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json());

// ✅ Routes
app.use('/api/events', eventRoutes);

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Event service is running',
    timestamp: new Date()
  });
});

// ✅ MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Event service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
