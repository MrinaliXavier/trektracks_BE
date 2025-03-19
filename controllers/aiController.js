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
    
    console.log('Generating trip plan with prompt:', prompt);
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate content
    const result = await model.generateContent(prompt);

    // Validate response
    if (!result?.candidates || result.candidates.length === 0) {
      throw new Error('No response generated from the AI model.');
    }

    const text = result.candidates[0].content || 'No meaningful response';

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
    
    const prompt = `
      Analyze this trip plan and answer the following question:
      
      Trip Details:
      ${JSON.stringify(tripData, null, 2)}
      
      Question: ${question}
    `;
    
    console.log('Analyzing trip with prompt:', prompt);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    if (!result?.candidates || result.candidates.length === 0) {
      throw new Error('No response generated for trip analysis.');
    }

    const text = result.candidates[0].content || 'No meaningful response';

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
