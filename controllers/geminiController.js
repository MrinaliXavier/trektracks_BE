// controllers/geminiController.js
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
require('dotenv').config();

// Generate travel plan using Gemini API
exports.generateTravelPlan = async (req, res) => {
  try {
    const tripDetails = req.body;
    
    // Validate required fields
    const requiredFields = ['travelerCategory', 'tripType', 'destination', 'from', 'days', 'budget', 'vehicle'];
    for (const field of requiredFields) {
      if (!tripDetails[field]) {
        return res.status(400).json({
          status: 'error',
          message: `Missing required field: ${field}`
        });
      }
    }

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Using the model from your code snippet
    });
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    // Construct the prompt
    const prompt = `Create a detailed ${tripDetails.days}-day travel itinerary for a ${tripDetails.travelerCategory} traveling from ${tripDetails.from} to ${tripDetails.destination} in Sri Lanka. 
This is a ${tripDetails.tripType} focused trip with a budget of ${tripDetails.budget} LKR using ${tripDetails.vehicle} as the primary mode of transportation.

Please include:
1. Day-by-day breakdown with morning, afternoon, and evening activities
2. Recommended religious and cultural sites to visit based on the ${tripDetails.tripType} theme
3. Estimated costs for activities, meals, and transportation
4. Suggestions for local experiences and food to try
5. Tips for traveling with ${tripDetails.travelerCategory} in Sri Lanka
6. How to best utilize ${tripDetails.vehicle} for this journey

Format the response as a detailed itinerary with clear headings for each day and provide a total cost estimate to ensure it stays within the ${tripDetails.budget} LKR budget.`;

    // Start chat session and send message
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    
    const result = await chatSession.sendMessage(prompt);
    const generatedPlan = result.response.text();
    
    // Return the generated travel plan
    res.status(200).json({
      status: 'success',
      data: {
        plan: generatedPlan
      }
    });
  } catch (error) {
    console.error('Error generating travel plan:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate travel plan'
    });
  }
};