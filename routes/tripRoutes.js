// routes/tripRoutes.js

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authController = require('../controllers/authController');

// GET /api/trips - Get all trips
router.get('/', tripController.getAllTrips);

// GET /api/trips/:id - Get all trips
router.get('/mytrip/:id', tripController.getTripforUser);

// GET /api/trips/active - Get active trips
router.get('/active', tripController.getActiveTrips);

// GET /api/trips/stats - Get trip statistics
router.get('/stats', tripController.getTripStats);

// GET /api/trips/:id - Get a specific trip
router.get('/:id', tripController.getTrip);

// POST /api/trips - Create a new trip
router.post('/', tripController.createTrip);

// PATCH /api/trips/:id - Update a trip
router.patch('/:id', tripController.updateTrip);

// POST /api/trips/expense/:id - Update a trip
router.post('/expense/:id', tripController.updateTripExpense);

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', tripController.deleteTrip);

// POST /api/trips/:id/places - Add a place to a trip
router.post('/:id/places', tripController.addPlaceToTrip);

// DELETE /api/trips/:id/places/:placeId - Remove a place from a trip
router.delete('/:id/places/:placeId', tripController.removePlaceFromTrip);

// GET /api/trips/category/:id - Get a specific trip
router.get('/category/:id', tripController.getTransactionsByCategory);

module.exports = router;