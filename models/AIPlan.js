// models/AIPlan.js
const mongoose = require('mongoose');

const AIPlanSchema = new mongoose.Schema({
  userInput: {
    destination: {
      type: String,
      required: true
    },
    days: {
      type: String,
      required: true
    },
    travelerCategory: String,
    tripType: String,
    vehicle: String,
    budget: String
  },
  generatedPlan: {
    type: Object,
    required: true
  },
  rawResponse: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIPlan', AIPlanSchema);