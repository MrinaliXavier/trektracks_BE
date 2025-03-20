// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

// POST /api/ai/generate-plan - Generate a trip plan using AI
router.post('/generate-plan', geminiController.generateTravelPlan);

// If you need the analyze trip function, you could use it from aiController
// router.post('/analyze-trip', aiController.analyzeTrip);

module.exports = router;