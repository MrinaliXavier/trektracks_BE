// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/generate-plan - Generate a trip plan using AI
router.post('/generate-plan', aiController.generateTripPlan);

// POST /api/ai/analyze-trip - Analyze an existing trip
router.post('/analyze-trip', aiController.analyzeTrip);

module.exports = router;
