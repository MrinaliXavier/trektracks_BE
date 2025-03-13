// models/Trip.js

const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  // Budget information
  budget: {
    amount: {
      type: Number,
      required: false
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  // Places to visit during the trip
  places: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],
  // Additional meta information
  isActive: {
    type: Boolean,
    default: true
  },
  coverImage: {
    type: String
  },
  // Additional notes or details
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
tripSchema.index({ startDate: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ isActive: 1 });

module.exports = mongoose.model('Trip', tripSchema);