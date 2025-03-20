// routes/tripRoutes.js

const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// GET /api/trips - Get all trips
router.get('/', tripController.getAllTrips);

// GET /api/trips/mytrip - Get all trips
router.get('/mytrip', tripController.getTripforUser);

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

// DELETE /api/trips/:id - Delete a trip
router.delete('/:id', tripController.deleteTrip);

// POST /api/trips/:id/places - Add a place to a trip
router.post('/:id/places', tripController.addPlaceToTrip);

// DELETE /api/trips/:id/places/:placeId - Remove a place from a trip
router.delete('/:id/places/:placeId', tripController.removePlaceFromTrip);

module.exports = router;