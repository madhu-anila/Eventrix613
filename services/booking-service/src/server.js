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

// ✅ Allow all origins for now (we can restrict later)
app.use(cors());

// ❌ REMOVE this line (it causes the PathError)
// app.options('*', cors());

// Parse JSON request bodies
app.use(express.json());

// Booking routes
app.use('/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Booking service root is alive' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Booking service running', timestamp: new Date() });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB (bookings)');
    app.listen(PORT, () => {
      console.log(`🚀 Booking service running on port ${PORT}`);
      console.log('   Listening on /bookings');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error (bookings):', err);
    process.exit(1);
  });

module.exports = app;
