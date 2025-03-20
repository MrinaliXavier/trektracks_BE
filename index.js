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
app.use(express.json());

// For stricter CORS settings, you could use:
app.use(cors({
  origin: ['http://localhost:3000', 'exp://192.168.1.100:19000'], // Add your Expo development URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/places', placeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes); 
app.use('/api/ai-plan', aiPlanRoutes);
app.use('/api/gemini', geminiRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
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