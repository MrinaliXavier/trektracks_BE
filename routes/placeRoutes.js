// routes/placeRoutes.js

const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');
const authController = require('../controllers/authController');

// GET /api/places - Get all places
router.get('/', placeController.getAllPlaces);

// GET /api/places/search - Search places (by query string or category)
router.get('/search', placeController.searchPlaces);

// GET /api/places/popular - Get popular places
router.get('/popular', placeController.getPopularPlaces);

// GET /api/places/category/:category - Get places by category
// This will handle variations like 'beaches', 'Beaches', 'beach', 'Beach', etc.
router.get('/category/:category', placeController.getPlacesByCategory);

// GET /api/places/:id - Get a specific place by ID
router.get('/:id', placeController.getPlace);

// POST /api/places - Create a new place
router.post('/', placeController.createPlace);

// POST /api/places/favourite/:id - favourite a specific trip
router.post('/favourite/:id', authController.addFavourite);

// GET /api/places/favourites/ - favourite a specific trip
router.get('/favourites/:id', authController.getFavourites);

// POST /api/places/favourites/ - favourite a specific trip
router.post('/favourites/remove/:id', authController.updateFavourite);



// Add more API endpoints for your specific needs
// For example, you might want to add:
// - GET /api/places/nearby - Get places near user's location
// - GET /api/places/recommended - Get personalized recommendations

// POST /api/places/:id - update a  place
router.post('/:id', placeController.updatePlace);

// DELETE /api/places/:id - delete a  place
router.delete('/:id', placeController.deletePlace);

// POST /api/places/review/:id - Add review to place
router.post('/review/:id', placeController.addReview);

module.exports = router;