// // src/server.js (Booking Service)
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const bookingRoutes = require('./routes/bookings');

// const app = express();

// const PORT = process.env.PORT || 4003;
// const MONGO_URI =
//   process.env.MONGO_URI ||
//   'mongodb://127.0.0.1:27017/eventsphere-bookings';

// // ✅ CORS whitelist (same as other services)
// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://eventrix613.vercel.app', // Vercel frontend
//   'https://eventrix613-git-main-anilas-projects-dcd2cf5.vercel.app', // Vercel preview
//   'https://wonderful-water-07646600f.3.azurestaticapps.net',
//   'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
// ];

// // ✅ CORS middleware
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
//   })
// );

// // Parse JSON bodies
// app.use(express.json());

// // ✅ Routes —`/bookings`
// app.use('/bookings', bookingRoutes);

// // ✅ Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'Booking service is running', timestamp: new Date() });
// });

// // ✅ MongoDB connection + server start
// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log('✅ Connected to MongoDB (bookings)');
//     app.listen(PORT, () => {
//       console.log(`🚀 Booking service running on port ${PORT}`);
//       console.log(`   Listening on /bookings`);
//     });
//   })
//   .catch(err => {
//     console.error('❌ MongoDB connection error (bookings):', err);
//     process.exit(1);
//   });

// module.exports = app;

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

// ✅ CORS whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'https://eventrix613.vercel.app',
  'https://eventrix613-git-main-anilas-projects-dcd2cf5.vercel.app',
  'https://wonderful-water-07646600f.3.azurestaticapps.net',
  'https://wonderful-water-07646600f-preview.eastus2.3.azurestaticapps.net'
];

// ✅ CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours - cache preflight requests
};

// ✅ Apply CORS before other middleware
app.use(cors(corsOptions));

// ✅ Parse JSON bodies AFTER CORS
app.use(express.json());

// ✅ Request logging (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// ✅ Routes — `/bookings`
app.use('/bookings', bookingRoutes);

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Booking service is running', timestamp: new Date() });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// ✅ MongoDB connection + server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (bookings)');
    app.listen(PORT, () => {
      console.log(`🚀 Booking service running on port ${PORT}`);
      console.log(`   Listening on /bookings`);
      console.log(`   Allowed origins:`, allowedOrigins);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error (bookings):', err);
    process.exit(1);
  });

module.exports = app;