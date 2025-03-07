// Create this file at: models/Place.js

const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Beach', 'Mountain', 'Cultural', 'Religious', 'Adventure', 'Nature',
      'Ancient Cities', 'Religious Sites', 'Engineering Marvels', 
      'Royal Residences', 'Rock Art', 'Prehistoric Sites', 'Sacred Mountains'
    ]
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String  // URLs to images
  }],
  openingHours: {
    open: String,
    close: String
  },
  contactInfo: {
    phone: String,
    email: String
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create text indexes for better search functionality
placeSchema.index({ 
  name: 'text', 
  description: 'text', 
  location: 'text', 
  category: 'text' 
});

module.exports = mongoose.model('Place', placeSchema);