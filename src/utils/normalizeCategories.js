// src/utils/normalizeCategories.js
const mongoose = require('mongoose');
require('dotenv').config();
const Place = require('../../models/Place');
const { normalizeCategory } = require('./categoryUtils');

// Function to update existing categories to normalized format
const normalizeCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for category normalization');

    // Get all places
    const places = await Place.find({});
    console.log(`Found ${places.length} places to normalize`);

    // Keep track of updates
    let updatedCount = 0;

    // Update each place with normalized category
    for (const place of places) {
      const originalCategory = place.category;
      const normalizedCategory = normalizeCategory(originalCategory);
      
      // Only update if the category actually changed
      if (normalizedCategory && normalizedCategory !== originalCategory) {
        place.category = normalizedCategory;
        await place.save();
        updatedCount++;
        console.log(`Updated: ${originalCategory} -> ${normalizedCategory}`);
      }
    }

    console.log(`Successfully normalized ${updatedCount} places out of ${places.length}`);
    console.log('Category normalization completed successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error during category normalization:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the normalization
normalizeCategories();