// src/utils/categoryUtils.js
const jwt = require('jsonwebtoken');

/**
 * Normalizes category names for consistent searching
 * Handles plural forms, capitalization, and common variations
 * 
 * @param {string} category - The category input from user
 * @returns {string} - The normalized category name
 */
exports.normalizeCategory = (category) => {
    if (!category) return null;
    
    // Convert to lowercase
    let normalized = category.toLowerCase();
    
    // Handle singular/plural variations
    if (normalized.endsWith('es')) {
      normalized = normalized.slice(0, -2);
    } else if (normalized.endsWith('s')) {
      normalized = normalized.slice(0, -1);
    }
    
    // Map common variations to standard categories
    const categoryMap = {
      'beach': 'beach',
      'mountain': 'mountain',
      'ancient': 'ancient cities',
      'ancient city': 'ancient cities',
      'religious': 'religious sites',
      'religious site': 'religious sites',
      'temple': 'religious sites',
      'engineering': 'engineering marvels',
      'royal': 'royal residences',
      'rock': 'rock art',
      'prehistoric': 'prehistoric sites',
      'sacred': 'sacred mountains',
      'cultural': 'cultural',
      'adventure': 'adventure',
      'nature': 'nature',
      'forest': 'nature',
      'waterfall': 'nature',
      'lake': 'nature',
      'island': 'nature',
      'sunset': 'nature',
      'city': 'cultural'
    };
    
    // Return mapped category or original normalized value
    return categoryMap[normalized] || normalized;
  };
  
  /**
   * Gets a list of all standard categories
   * 
   * @returns {Array} - Array of standard category names
   */
  exports.getStandardCategories = () => {
    return [
      'beach',
      'mountain',
      'ancient cities',
      'religious sites',
      'engineering marvels',
      'royal residences',
      'rock art',
      'prehistoric sites',
      'sacred mountains',
      'cultural',
      'adventure',
      'nature'
    ];
  };
  
  /**
   * Checks if a given category is valid
   * 
   * @param {string} category - The category to validate
   * @returns {boolean} - Whether the category is valid
   */
  exports.isValidCategory = (category) => {
    if (!category) return false;
    
    const normalized = exports.normalizeCategory(category);
    return exports.getStandardCategories().includes(normalized) || normalized === 'all';
  };


  exports.getUserfromToken = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          status: 'error', 
          message: 'No token provided or invalid format' 
        });
      }
      
      const token = authHeader.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.userId = decoded.id;
      
      if (next) {
        return next();
      }
      return req.userId;
    }
    catch (error) {
      console.error("Authentication error:", error);
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Invalid token' 
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          status: 'error', 
          message: 'Token expired' 
        });
      } else {
        return res.status(500).json({
          status: 'error',
          message: 'Authentication failed'
        });
      }
    }
  };

  /**
   * Decodes a JWT token without verifying signature
   * Note: This should only be used for non-sensitive operations
   * 
   * @param {string} token - JWT token
   * @returns {Object|null} - Decoded token or null
   */
  exports.decodeToken = (token) => {
    try {
      // This is a simple decoder that doesn't verify signature
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const decoded = Buffer.from(payload, 'base64').toString();
      return JSON.parse(decoded);
    } catch (error) {
      console.error("Token decoding error:", error);
      return null;
    }
  };