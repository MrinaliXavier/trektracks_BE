// controllers/aiController.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to generate a travel plan using Gemini API
exports.generateTripPlan = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        message: 'Prompt is required'
      });
    }
    
    // For logging/debugging
    console.log('Generating trip plan with prompt:', prompt);
    
    // Initialize the model (you can choose the appropriate model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Return the generated plan
    return res.status(200).json({
      status: 'success',
      response: text
    });
    
  } catch (error) {
    console.error('Error generating trip plan:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Error generating trip plan'
    });
  }
};

// Optional: Function to analyze an existing trip and provide recommendations
exports.analyzeTrip = async (req, res) => {
  try {
    const { tripData, question } = req.body;
    
    if (!tripData || !question) {
      return res.status(400).json({
        status: 'error',
        message: 'Trip data and question are required'
      });
    }
    
    // Create a prompt from the trip data and question
    const prompt = `
      Analyze this trip plan and answer the following question:
      
      Trip Details:
      ${JSON.stringify(tripData, null, 2)}
      
      Question: ${question}
    `;
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Return the analysis
    return res.status(200).json({
      status: 'success',
      response: text
    });
    
  } catch (error) {
    console.error('Error analyzing trip:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Error analyzing trip'
    });
  }
};