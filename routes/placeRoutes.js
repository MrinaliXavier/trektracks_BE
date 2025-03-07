// Create this file at: routes/placeRoutes.js

const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

// GET /api/places - Get all places
router.get('/', placeController.getAllPlaces);

// GET /api/places/search - Search places
router.get('/search', placeController.searchPlaces);

// GET /api/places/category/:category - Get places by category
router.get('/category/:category', placeController.getPlacesByCategory);

// GET /api/places/popular - Get popular places
router.get('/popular', placeController.getPopularPlaces);

// GET /api/places/:id - Get a specific place
router.get('/:id', placeController.getPlace);

// POST /api/places - Create a new place
router.post('/', placeController.createPlace);

module.exports = router;