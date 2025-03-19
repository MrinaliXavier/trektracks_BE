// controllers/geminiController.js
const axios = require('axios');
require('dotenv').config();

// Helper function to construct a prompt for Gemini based on trip details
const constructTripPrompt = (tripDetails) => {
  const {
    travelerCategory,
    tripType,
    destination,
    from,
    days,
    budget,
    vehicle
  } = tripDetails;

  return `Create a detailed ${days}-day travel itinerary for a ${travelerCategory} traveling from ${from} to ${destination} in Sri Lanka. 
This is a ${tripType} focused trip with a budget of ${budget} LKR using ${vehicle} as the primary mode of transportation.

Please include:
1. Day-by-day breakdown with morning, afternoon, and evening activities
2. Recommended religious and cultural sites to visit based on the ${tripType} theme
3. Estimated costs for activities, meals, and transportation
4. Suggestions for local experiences and food to try
5. Tips for traveling with ${travelerCategory} in Sri Lanka
6. How to best utilize ${vehicle} for this journey

Format the response as a detailed itinerary with clear headings for each day and provide a total cost estimate to ensure it stays within the ${budget} LKR budget.`;
};

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

    // Construct the prompt
    const prompt = constructTripPrompt(tripDetails);
    
    console.log('Sending prompt to Gemini API:', prompt);
    
    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }
    );

    // Check if the response has the expected structure
    if (!response.data || !response.data.candidates || !response.data.candidates[0] || 
        !response.data.candidates[0].content || !response.data.candidates[0].content.parts || 
        !response.data.candidates[0].content.parts[0].text) {
      console.error('Unexpected response structure from Gemini API:', JSON.stringify(response.data));
      throw new Error('Invalid response from Gemini API');
    }

    // Extract the generated text from the response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    console.log('Generated travel plan successfully');
    
    // Return the generated travel plan
    res.status(200).json({
      status: 'success',
      data: {
        plan: generatedText
      }
    });
  } catch (error) {
    console.error('Error generating travel plan:', error);
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Gemini API error response:', error.response.data);
      res.status(error.response.status).json({
        status: 'error',
        message: error.response.data.error?.message || 'Error from Gemini API',
        details: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from Gemini API');
      res.status(503).json({
        status: 'error',
        message: 'No response received from AI service. Please try again later.'
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to generate travel plan'
      });
    }
  }
};

// Optional: Function to analyze an existing trip and provide recommendations
exports.analyzeTripPlan = async (req, res) => {
  try {
    const { tripData, question } = req.body;
    
    if (!tripData || !question) {
      return res.status(400).json({
        status: 'error',
        message: 'Trip data and question are required'
      });
    }
    
    // Create a prompt for analyzing the trip
    const prompt = `
      As a Sri Lankan travel expert, analyze this trip plan and answer the following question:
      
      Trip Details:
      ${JSON.stringify(tripData, null, 2)}
      
      Question: ${question}
      
      Please provide a comprehensive answer with specific recommendations for Sri Lanka.
    `;
    
    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4, // Lower temperature for more focused response
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        }
      }
    );
    
    // Extract the generated text from the response
    const generatedText = response.data.candidates[0].content.parts[0].text;
    
    // Return the analysis
    res.status(200).json({
      status: 'success',
      data: {
        analysis: generatedText
      }
    });
  } catch (error) {
    console.error('Error analyzing trip:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to analyze trip plan'
    });
  }
};