const axios = require("axios");

const generateTripPlan = async (req, res) => {
  try {
    const { destination, days, travelerCategory, tripType, vehicle } = req.body;

    // Create a request message for Gemini AI
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
        params: { key: process.env.GEMINI_API_KEY },
      }
    );

    // Send the trip plan to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ message: "Failed to generate trip plan" });
  }
};

module.exports = { generateTripPlan };
