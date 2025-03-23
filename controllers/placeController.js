// controllers/placeController.js

const Place = require('../models/Place');
const { normalizeCategory } = require('../src/utils/categoryUtils');

// Get all places
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({
      status: 'success',
      results: places.length,
      data: places
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Enhanced search places function
exports.searchPlaces = async (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q && !category) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Search query or category parameter is required' 
      });
    }

    let searchQuery = {};

    if (q) {
      // Case-insensitive search for text fields
      searchQuery.$or = [
        { name: { $regex: new RegExp(q, 'i') }},
        { description: { $regex: new RegExp(q, 'i') }},
        { location: { $regex: new RegExp(q, 'i') }}
      ];
    }

    if (category) {
      const normalizedCat = normalizeCategory(category);
      
      if (normalizedCat === 'all') {
        // Don't filter by category if 'all' is specified
      } else {
        // Use case-insensitive regex for category matching
        searchQuery.category = { $regex: new RegExp(normalizedCat, 'i') };
      }
    }

    const places = await Place.find(searchQuery);
    
    res.status(200).json({
      status: 'success',
      results: places.length,
      data: places
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single place
exports.getPlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({
        status: 'error',
        message: 'Place not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: place
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new place
// Create a new place
exports.createPlace = async (req, res) => {
  try {
    // Add the user ID to the place data if authenticated
    if (req.user) {
      req.body.createdBy = req.user._id;
    }
    
    // Check for required fields
    const requiredFields = ['name', 'description', 'category'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          status: 'error',
          message: `Missing required field: ${field}`
        });
      }
    }
    
    // Validate category is an array
    if (!Array.isArray(req.body.category)) {
      req.body.category = [req.body.category]; // Convert to array if it's a single string
    }
    
    // Handle image paths if files are uploaded
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }
    
    // Check if a place with the same name already exists
    const existingPlace = await Place.findOne({ name: req.body.name });
    if (existingPlace) {
      return res.status(400).json({
        status: 'error',
        message: 'A place with this name already exists'
      });
    }
    
    // Create the new place
    const newPlace = await Place.create(req.body);
    
    // Return the created place
    res.status(201).json({
      status: 'success',
      data: newPlace
    });
  } catch (error) {
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors: errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate field value. Please use another value.'
      });
    }
    
    // General error handling
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while creating the place'
    });
  }
};

// Get places by category (improved for user-friendliness)
exports.getPlacesByCategory = async (req, res) => {
  try {
    let { category } = req.params;
    
    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: 'Category parameter is required'
      });
    }

    // Normalize the category for better matching
    const normalizedCat = normalizeCategory(category);
    
    let query = {};
    
    if (normalizedCat !== 'all') {
      // Use regex for more flexible matching
      query.$or = [
        { category: { $regex: new RegExp(normalizedCat, 'i') } },
        { name: { $regex: new RegExp(normalizedCat, 'i') } },
        { description: { $regex: new RegExp(normalizedCat, 'i') } }
      ];
    }

    const places = await Place.find(query);
    
    res.status(200).json({
      status: 'success',
      results: places.length,
      data: places
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get popular places
exports.getPopularPlaces = async (req, res) => {
  try {
    const places = await Place.find({ isPopular: true });
    
    res.status(200).json({
      status: 'success',
      results: places.length,
      data: places
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a place
exports.updatePlace = async (req, res) => {
  try {
    // Find place first to check if it exists
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({
        status: 'error',
        message: 'Place not found'
      });
    }
    
    // Handle category updates - ensure it stays as an array
    if (req.body.category && !Array.isArray(req.body.category)) {
      req.body.category = [req.body.category]; // Convert to array if single string
    }
    
    // Handle image paths if files are uploaded
    if (req.files && req.files.length > 0) {
      // If we want to append new images to existing ones
      const existingImages = place.images || [];
      const newImages = req.files.map(file => file.path);
      req.body.images = [...existingImages, ...newImages];
    }
    
    // If name is being updated, check for duplicates
    if (req.body.name && req.body.name !== place.name) {
      const existingPlace = await Place.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id } // Exclude current place
      });
      
      if (existingPlace) {
        return res.status(400).json({
          status: 'error',
          message: 'A place with this name already exists'
        });
      }
    }
    
    // Update the place with validation
    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    res.status(200).json({
      status: 'success',
      data: updatedPlace
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation Error',
        errors: errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Duplicate field value. Please use another value.'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while updating the place'
    });
  }
};

// Delete a place
exports.deletePlace = async (req, res) => {
  try {
    // Find the place first to check if it exists
    const place = await Place.findById(req.params.id);
    
    if (!place) {
      return res.status(404).json({
        status: 'error',
        message: 'Place not found'
      });
    }
    
    // Optional: Check if the user has permission to delete
    // For example, only allow creators or admins to delete
    if (req.user && place.createdBy && 
        req.user.role !== 'admin' && 
        place.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to delete this place'
      });
    }

    // Optional: Delete associated image files from storage
    // If you're storing images on the server or cloud storage
    if (place.images && place.images.length > 0) {
      // This is placeholder logic - replace with your actual file deletion code
      // For example, if using AWS S3 or local file system
      /*
      for (const imagePath of place.images) {
        await deleteFileFromStorage(imagePath);
      }
      */
      console.log('Would delete images:', place.images);
    }
    
    // Optional: Delete associated content like reviews
    // If you have separate collections for reviews, etc.
    /*
    await Review.deleteMany({ place: req.params.id });
    */
    
    // Delete the place
    await Place.findByIdAndDelete(req.params.id);

    // Return success with no content
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error('Error deleting place:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while deleting the place'
    });
  }
};

exports.addReview =  async (req, res) => {
  try{

    if(req.body.reviews){
      const newReview = req.body.reviews;
      const place = await Place.findById(req.params.id);

    if ( Array.isArray(place.reviews) && place.reviews.length > 0) {
      place.reviews.push(newReview);  // Use push() instead of add()
    } else {
      place.reviews = [newReview];  // Initialize as an array with the new review
    }


      const updatedPlace = await Place.findByIdAndUpdate(
        req.params.id,
        place,
        {
          new: true, // Return the updated document
          runValidators: true // Run schema validators
        }
      );
      res.status(200).json({
        status: 'success',
        data: updatedPlace
      });

    }
    
  }
  catch(error){
    console.error('Error adding review place:', error);
    
    res.status(500).json({
      status: 'error',
      message: error.message || 'An error occurred while adding review to the place'
    });
  }
}