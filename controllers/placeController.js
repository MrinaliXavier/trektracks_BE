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
exports.createPlace = async (req, res) => {
  try {
    const newPlace = await Place.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newPlace
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
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
      query.category = { $regex: new RegExp(normalizedCat, 'i') };
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