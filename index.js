// index.js in the root directory
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// for model (abe)
const axios = require('axios');

dotenv.config(); // Load API key from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Allow JSON requests


const geminiApiKey = process.env.GEMINI_API_KEY;

// API Endpoint for Generating Trip Plans
app.post("/api/generate-trip", async (req, res) => {
  try {
    const { destination, days, travelerCategory, tripType, vehicle } = req.body;

    // Construct the AI prompt
    const prompt = `Plan a ${days}-day trip to ${destination} for a ${travelerCategory}. 
                    The trip should focus on ${tripType} and use ${vehicle} for travel.`;

    // Send request to Gemini AI
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText",
      {
        prompt: { text: prompt },
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: geminiApiKey },
      }
    );

    // Send the AI-generated trip plan to frontend
    res.json({ tripPlan: response.data });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "Failed to generate trip plan" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// Import all routes
const placeRoutes = require('./routes/placeRoutes');
const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/places', placeRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/auth', authRoutes);

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

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`- /api/places: Places API`);
  console.log(`- /api/trips: Trips API`);
  console.log(`- /api/expenses: Expenses API`);
  console.log(`- /api/auth: Authentication API`);
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