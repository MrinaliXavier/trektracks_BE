// routes/authRoutes.js
const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register and login routes
router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', getMe);

module.exports = router;