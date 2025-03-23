// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Place = require('../models/Place');
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '10m'
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      } else {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      phoneNumber
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          phoneNumber: user.phoneNumber
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration' + error
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
    return res
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user'
    });
  }
};



exports.addFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);

    user.favourites.push(req.params.id);
    user.save();
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user'
    });
  }
};


exports.getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.favourites && user.favourites.length > 0) {
      console.log('Number of favorites:', user.favourites.length);
      console.log('Favorite IDs:', user.favourites);

      const favTrips = [];
      const fetchPromises = user.favourites.map(async (id) => {
        try {
          const trip = await Place.findById(id);
          if (trip) {
            favTrips.push(trip);
          } else {
            console.log(`Trip with ID ${id} not found`);
          }
        } catch (err) {
          console.error(`Error fetching trip with ID ${id}:`, err);
        }
      });

      await Promise.all(fetchPromises);

      return res.status(200).json({
        success: true,
        data: favTrips,
        count: favTrips.length
      });

    } else {
      return res.status(200).json({
        success: true,
        data: [],
        count: 0,
        message: 'No favourite trips found'
      });
    }
  } catch (error) {
    console.error('Get favourites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving favourite trips: ' + error.message
    });
  }
};

exports.updateFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.favourites.remove(req.body.id);
    user.save();
    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user'
    });
  }
};