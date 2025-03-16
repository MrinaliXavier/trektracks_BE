// models/Place.js

const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    
  },
  location: {
    type: Object,//change this after seed change Object --> String
    required: false
  },
  description: {
    type: String,
    required: true
  },
  reviews: {
    type: Array,
    required: false
  },
  category: {
    type: Array,
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  images: [{
    type: String
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