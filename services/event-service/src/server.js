// src/server.js (Event Service)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./routes/events');

const app = express();

const PORT = process.env.PORT || 4002;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/eventsphere-events';

// ✅ CORS whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventrix613.vercel.app', // Vercel frontend
  'https://eventrix613-git-main-anilas-projects-dcd2cf5.vercel.app', // Vercel preview
  'https://wonderful-water-07646600f.3.azurestaticapps.net',
  'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
];

// ✅ CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Parse JSON bodies
app.use(express.json());

// ✅ Routes — ONLY `/events` now
// Router defines GET '/', POST '/', etc. so full paths become:
//   GET    /events
//   POST   /events
//   PUT    /events/:id
//   DELETE /events/:id
app.use('/events', eventRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Event service is running', timestamp: new Date() });
});

// MongoDB connection + server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (events)');
    app.listen(PORT, () => {
      console.log(`🚀 Event service running on port ${PORT}`);
      console.log('   Listening on /events');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error (events):', err);
    process.exit(1);
  });

module.exports = app;
