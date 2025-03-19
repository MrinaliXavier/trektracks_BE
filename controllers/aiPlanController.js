// controllers/aiPlanController.js
const AIPlan = require('../models/AIPlan');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI trip plan
exports.generatePlan = async (req, res) => {
  try {
    const { destination, days, travelerCategory, tripType, vehicle, budget } = req.body;
    
    if (!destination || !days) {
      return res.status(400).json({
        status: 'error',
        message: 'Destination and days are required'
      });
    }
    
    // Construct the prompt
    const prompt = `Create a detailed ${days}-day travel itinerary for a ${travelerCategory || 'traveler'} 
    traveling to ${destination} in Sri Lanka. This is a ${tripType || 'general'} focused trip 
    with a budget of ${budget || 'moderate'} LKR using ${vehicle || 'mixed'} transportation.
    
    Please include:
    1. Day-by-day breakdown with morning, afternoon, and evening activities
    2. Recommended sites to visit based on the ${tripType || 'requested'} theme
    3. Estimated costs for activities, meals, and transportation
    4. Suggestions for local experiences and food to try
    5. Travel tips for Sri Lanka
    6. Recommended hotels to stay
    
    Format the response as a detailed itinerary with clear headings for each day and provide a total cost estimate.`;
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });  // Use 12.0-flash for better results
    
    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const text = result.candidates[0]?.content?.parts?.[0]?.text || "No response generated.";

    // Save the plan to database
    const aiPlan = new AIPlan({
      userInput: { destination, days, travelerCategory, tripType, vehicle, budget },
      generatedPlan: { content: text, createdAt: new Date() },
      rawResponse: text
    });
    
    await aiPlan.save();
    
    return res.status(200).json({
      status: 'success',
      data: { plan: text, planId: aiPlan._id }
    });
    
  } catch (error) {
    console.error('Error generating AI plan:', error.response?.data || error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Error generating travel plan'
    });
  }
};

// Get an already generated plan by ID
exports.getPlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await AIPlan.findById(planId);
    
    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Plan not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: plan
    });
    
  } catch (error) {
    console.error('Error retrieving AI plan:', error.response?.data || error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Error retrieving travel plan'
    });
  }
};
