// controllers/placeController.js
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

// Search places
exports.searchPlaces = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Search query is required' 
      });
    }

    // Search in name, description, and category
    const places = await Place.find({
      $or: [
        { name: { $regex: new RegExp(q, 'i') }},
        { description: { $regex: new RegExp(q, 'i') }},
        { category: { $regex: new RegExp(`^${q}$`, 'i') }}
      ]
    });
    
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

// Get places by category
exports.getPlacesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const places = await Place.find({ category });
    
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