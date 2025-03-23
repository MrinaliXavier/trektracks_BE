// models/Trip.js

const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  budget: {
    type: Number,
    required: false
  },
  totalExpense: {
    type: Number,
    required: false,
    default: 0
  },
  currency: {
    type: String,
    default: 'LKR'
  },

  userId: {
    type: String,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  coverImage: {
    type: String,
    default: ""
  },
  travelCategory: {
    type: String,
  },
  tripType: {
    type: String,
  },
  vehicle: {
    type: String,
  },
  notes: {
    type: String
  },
  transactions: {
    type: Array
  },
  plan: {
    type: String
  },
}, {
  timestamps: true
});

// Create indexes for efficient querying
tripSchema.index({ startDate: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ isActive: 1 });

module.exports = mongoose.model('Trip', tripSchema);