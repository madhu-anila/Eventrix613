const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const bookingRoutes = require('./routes/bookings');

const app = express();

const PORT = process.env.PORT || 4003;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventsphere-bookings';

// ✅ CORS WHITELIST
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventrix613.vercel.app', // ✅ Vercel production
  'https://wonderful-water-07646600f.3.azurestaticapps.net',
  'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
];

// ✅ CORS MIDDLEWARE (MUST BE BEFORE ROUTES)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, curl, mobile apps
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json());

// ✅ ROUTES
app.use('/api/bookings', bookingRoutes);

// ✅ HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'Booking service is running',
    timestamp: new Date()
  });
});

// ✅ MONGODB CONNECTION
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Booking service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
