// routes/travelRoutes.js
const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// POST /api/travel - Process travel form
router.post('/', travelController.processTravelForm);

// GET /api/travel/:id - Get travel plan by ID
router.get('/:id', travelController.getTravelPlan);

module.exports = router;