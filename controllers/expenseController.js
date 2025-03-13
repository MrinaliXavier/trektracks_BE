// controllers/expenseController.js

const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    // Filtering options
    const filter = {};
    
    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Category filtering
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Trip filtering
    if (req.query.trip) {
      filter.trip = req.query.trip;
    }
    
    // Sort options (default: newest first)
    const sort = {};
    if (req.query.sortBy) {
      if (req.query.sortBy === 'amount') {
        sort.amount = req.query.sortOrder === 'asc' ? 1 : -1;
      } else if (req.query.sortBy === 'date') {
        sort.date = req.query.sortOrder === 'asc' ? 1 : -1;
      }
    } else {
      sort.date = -1; // Default: newest first
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    
    // Execute query
    const expenses = await Expense.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('trip', 'name startDate endDate')
      .populate('place', 'name location');
    
    // Get total count for pagination
    const total = await Expense.countDocuments(filter);
    
    res.status(200).json({
      status: 'success',
      results: expenses.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: expenses
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single expense
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('trip', 'name startDate endDate')
      .populate('place', 'name location');
    
    if (!expense) {
      return res.status(404).json({
        status: 'error',
        message: 'Expense not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    // If trip ID is provided, verify it exists
    if (req.body.trip) {
      const trip = await Trip.findById(req.body.trip);
      if (!trip) {
        return res.status(404).json({
          status: 'error',
          message: 'Trip not found'
        });
      }
    }
    
    const newExpense = await Expense.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: newExpense
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    // If trip ID is provided, verify it exists
    if (req.body.trip) {
      const trip = await Trip.findById(req.body.trip);
      if (!trip) {
        return res.status(404).json({
          status: 'error',
          message: 'Trip not found'
        });
      }
    }
    
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true // Run schema validators on update
      }
    );
    
    if (!expense) {
      return res.status(404).json({
        status: 'error',
        message: 'Expense not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: expense
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        status: 'error',
        message: 'Expense not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get expense statistics 
exports.getExpenseStats = async (req, res) => {
  try {
    // Filter options
    const filter = {};
    
    // Date range filtering
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Trip filtering
    if (req.query.trip) {
      filter.trip = req.query.trip;
    }
    
    // Get total expenses
    const totalExpenses = await Expense.countDocuments(filter);
    
    // Get sum by category
    const categoryExpenses = await Expense.aggregate([
      { $match: filter },
      { $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);
    
    // Get daily expenses
    const dailyExpenses = await Expense.aggregate([
      { $match: filter },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get total amount
    const totalAmount = await Expense.aggregate([
      { $match: filter },
      { $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        totalExpenses,
        totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
        categoryExpenses,
        dailyExpenses
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get expenses by trip
exports.getTripExpenses = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    
    // Verify trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }
    
    // Get expenses for this trip
    const expenses = await Expense.find({ trip: tripId })
      .sort({ date: -1 })
      .populate('place', 'name location');
    
    // Calculate total spent
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate remaining budget if trip has budget
    let budgetRemaining = null;
    if (trip.budget && trip.budget.amount) {
      budgetRemaining = trip.budget.amount - totalSpent;
    }
    
    res.status(200).json({
      status: 'success',
      results: expenses.length,
      data: {
        expenses,
        total: totalSpent,
        budgetRemaining,
        budget: trip.budget
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};