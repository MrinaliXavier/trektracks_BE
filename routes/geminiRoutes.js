// routes/geminiRoutes.js

const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

// POST /api/gemini/generate-plan - Generate a travel plan
router.post('/generate-plan', geminiController.generateTravelPlan);

module.exports = router;