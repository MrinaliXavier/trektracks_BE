// routes/aiPlanRoutes.js
const express = require('express');
const router = express.Router();
const aiPlanController = require('../controllers/aiPlanController');

// POST /api/ai-plan/generate - Generate AI trip plan
router.post('/generate', aiPlanController.generatePlan);

// GET /api/ai-plan/:id - Get a generated plan by ID
router.get('/:id', aiPlanController.getPlan);

module.exports = router;