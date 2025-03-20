// models/Trip.js

const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
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
  // places: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Place'
  // }],
  // Additional meta information

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
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
tripSchema.index({ startDate: -1 });
tripSchema.index({ destination: 1 });
tripSchema.index({ isActive: 1 });

module.exports = mongoose.model('Trip', tripSchema);