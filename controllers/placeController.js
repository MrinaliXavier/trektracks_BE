// Create this file at: controllers/placeController.js

const Place = require('../models/Place');

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
      // Use text search for more relevant results
      searchQuery.$or = [
        { name: { $regex: new RegExp(q, 'i') }},
        { description: { $regex: new RegExp(q, 'i') }},
        { location: { $regex: new RegExp(q, 'i') }},
        { category: { $regex: new RegExp(q, 'i') }}
      ];
    }

    if (category && category !== 'All') {
      searchQuery.category = category;
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

// Get places by category
exports.getPlacesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: 'Category parameter is required'
      });
    }

    let query = {};
    
    if (category !== 'All') {
      query.category = category;
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