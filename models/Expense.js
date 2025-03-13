// models/Expense.js

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food', 'Transportation', 'Accommodation', 'Activities', 
      'Shopping', 'Entertainment', 'Souvenirs', 'Other'
    ]
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  // If you want to associate expenses with trips
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: false
  },
  // If you want to associate expenses with specific places
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: false
  },
  // If you want to track currency information
  currency: {
    type: String,
    default: 'USD'
  },
  // If you want to track payment methods
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Mobile Payment', 'Other'],
    default: 'Cash'
  },
  // If you want to add image receipts in the future
  receiptImage: {
    type: String // URL to image
  },
  // For any custom tags the user might want to add
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Add indexes for improved query performance
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ trip: 1 });

module.exports = mongoose.model('Expense', expenseSchema);