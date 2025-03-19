// index.js in the root directory
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import all routes
const placeRoutes = require('./routes/placeRoutes');
const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes'); 
const aiPlanRoutes = require('./routes/aiPlanRoutes');
const geminiRoutes = require('./routes/geminiRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // Increased limit for larger JSON payloads from Gemini

// For stricter CORS settings, you could use:
app.use(cors({
  origin: ['http://localhost:3000', 
    'http://localhost:19006',
    'exp://192.168.1.x:19000',
    'http://192.168.1.x:19006'], // Add your Expo development URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Routes
app.use('/api/places', placeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes); 
app.use('/api/ai-plan', aiPlanRoutes);
app.use('/api/gemini', geminiRoutes);  // Make sure this line is present

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// In your index.js, add this route
app.get('/api/test-connection', (req, res) => {
  res.json({ success: true, message: 'Connection successful!' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit with failure
  }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`- /api/places: Places API`);
  console.log(`- /api/trips: Trips API`);
  console.log(`- /api/expenses: Expenses API`);
  console.log(`- /api/auth: Authentication API`);
  console.log(`- /api/ai: AI Trip Planning API`); 
  console.log(`- /api/ai-plan: AI Trip Planning API`);
  console.log(`- /api/gemini: Gemini API for trip planning`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});