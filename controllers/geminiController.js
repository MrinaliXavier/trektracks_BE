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
    
    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }
    );

    // Debugging: Log the raw response
    console.log('Gemini API response:', JSON.stringify(response.data, null, 2));

    // Extract the generated text from the response
    const generatedText = response.data.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") || "No response generated";

    // Return the generated travel plan
    res.status(200).json({
      status: 'success',
      data: {
        plan: generatedText
      }
    });
  } catch (error) {
    console.error('Error generating travel plan:', error.response?.data || error.message);

    res.status(500).json({
      status: 'error',
      message: error.response?.data?.error?.message || 'Failed to generate travel plan'
    });
  }
};
