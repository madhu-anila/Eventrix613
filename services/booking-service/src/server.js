// src/server.js (Booking Service)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookings');

const app = express();

const PORT = process.env.PORT || 4003;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/eventsphere-bookings';

// ✅ CORS whitelist (all front-end URLs that call this service)
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventrix613.vercel.app', // main Vercel frontend
  'https://eventrix613-git-main-anilas-projects-dcd2cf5.vercel.app', // Vercel preview
  'https://wonderful-water-07646600f.3.azurestaticapps.net',
  'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
];

// ✅ CORS options: dynamic origin check + OPTIONS handling
const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server tools (no origin) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ✅ Apply CORS before anything else
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

// Parse JSON bodies
app.use(express.json());

// ✅ Routes — `/bookings`
app.use('/bookings', bookingRoutes);

// Simple root route (for quick sanity check)
app.get('/', (req, res) => {
  res.json({ message: 'Booking service root is alive' });
});

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Booking service is running', timestamp: new Date() });
});

// ✅ MongoDB connection + server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (bookings)');
    app.listen(PORT, () => {
      console.log(`🚀 Booking service running on port ${PORT}`);
      console.log(`   Listening on /bookings`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error (bookings):', err);
    process.exit(1);
  });

module.exports = app;
