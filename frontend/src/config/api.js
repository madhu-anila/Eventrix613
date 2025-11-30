const API_CONFIG = {
  // Base URLs for each service (NO /api suffix here)
  auth: process.env.REACT_APP_AUTH_API_URL || 'http://localhost:4001',
  event: process.env.REACT_APP_EVENT_API_URL || 'http://localhost:4002',
  booking: process.env.REACT_APP_BOOKING_API_URL || 'http://localhost:4003'
};

export default API_CONFIG;
