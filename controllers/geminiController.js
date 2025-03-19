// controllers/geminiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
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

    console.log("Generating AI plan with:", JSON.stringify(tripDetails));

    // Initialize the Gemini API with your API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Using the appropriate model
    });

    // Construct the prompt
    const prompt = `Create a detailed ${tripDetails.days}-day travel itinerary for a group of ${tripDetails.travelerCategory} traveling from ${tripDetails.from} to ${tripDetails.destination} in Sri Lanka. 
This is a ${tripDetails.tripType} focused trip with a budget of ${tripDetails.budget} LKR using ${tripDetails.vehicle} as the primary mode of transportation.

Please include:
1. Day-by-day breakdown with morning, afternoon, and evening activities
2. Recommended sites to visit based on the ${tripDetails.tripType} theme
3. Estimated costs for activities, meals, and transportation
4. Suggestions for local experiences and food to try
5. Tips for traveling in Sri Lanka
6. How to best utilize ${tripDetails.vehicle} for this journey

Format the response as a detailed itinerary with clear headings for each day and provide a total cost estimate to ensure it stays within the ${tripDetails.budget} LKR budget.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generatedPlan = response.text();
    
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