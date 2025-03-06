// models/Place.js
const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'] // Only allow 'Point' type
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Beach', 'Mountain', 'Cultural', 'Religious', 'Adventure', 'Nature']
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

// Create a compound index for improved search functionality
placeSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Place', placeSchema);