// routes/travelRoutes.js
const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');

// POST /api/travel/:id - Process travel form
router.post('/:id', travelController.processTravelForm);

module.exports = router;