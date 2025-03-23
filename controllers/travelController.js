// controllers/travelController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Trip = require('../models/Trip');
const { ObjectId } = require('mongodb');
// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Process travel form and generate AI plan
exports.processTravelForm = async (req, res) => {
  try {
    
    const validId = new ObjectId(req.params.id);
    const {
      startLocation,
      endLocation,
      startDate,
      endDate,
      numPersons,
      travelerType,
      tripPreference,
      transportMode,
    } = req.body;

    // Validate required fields
    if (!startLocation || !endLocation || !startDate || !endDate  || !travelerType) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Calculate trip duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const tripDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Create prompt for AI
    const prompt = `
      Generate a Sri Lanka travel itinerary based on these details:
      - Start: ${startLocation}
      - End: ${endLocation}
      - Dates: ${startDate} to ${endDate} (${tripDuration} days)
      - Travelers: ${numPersons} (${travelerType})
      - Preference: ${tripPreference || 'General sightseeing'}
      - Transport: ${transportMode || 'Mixed'}

      Provide:
      1. **Low Budget Plan** (hostels, budget food, public transport)
      2. **Normal Budget Plan** (3-star hotels, restaurants, taxis)
      3. **Expensive Plan** (luxury hotels, fine dining, private transport)
      4. **Shopping Recommendations** (best local markets)
      5. **Emergency Contacts** (nearest police, hospital)
      6. **Entry Tickets** (places requiring tickets and prices)

      Format the response with clear headings and daily itineraries.
    `;

    // Generate AI content
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      },
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const aiGeneratedPlan = result.response.text();
    const trip = await Trip.findById(validId)
    trip.plan = aiGeneratedPlan;
    

    await trip.save();

    // Return success response
    res.status(200).json({
      status: 'success',
      message: 'Plan generated & saved successfully',
    });
  } catch (error) {
    console.error('Error processing travel form:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while processing the travel form'
    });
  }
};

