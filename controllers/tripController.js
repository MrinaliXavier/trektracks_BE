// controllers/tripController.js

const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const { getUserfromToken } = require('../src/utils/categoryUtils');
const mongoose = require("mongoose");
const { ObjectId } = require('mongodb');

// Get all trips
exports.getAllTrips = async (req, res) => {
  try{
    const trips = await Trip.find({});
    res.status(200).json({
      status: 'success',
      data: trips
    });
  }
  catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
  
};

// Get a single trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
    
    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: trip
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  try {

    // const date = new Date();
    // const Fromdate = new Date(req.body.startDate);
    // const Todate = new Date(req.body.endDate);
    // const from = Fromdate.toISOString().split('T')[0];
    // const to = Todate.toISOString().split('T')[0];
    // req.body.startDate = from;
    // req.body.endDate = to;
    const newTrip = await Trip.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newTrip
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getTripforUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const tripsForUser = await Trip.find({
      userId: userId,
    });
    return res.status(200).json({
      status: 'success',
      data: tripsForUser
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: trip
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    console.log(req.params.id)
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }
    
    // // Check if trip has any expenses
    // const expensesCount = await Expense.countDocuments({ trip: trip._id });
    
    // if (expensesCount > 0) {
    //   return res.status(400).json({
    //     status: 'error',
    //     message: `Cannot delete trip with ${expensesCount} expenses. Delete expenses first or update them to remove the trip reference.`
    //   });
    // }
    
    // Delete the trip
    await Trip.findByIdAndDelete(req.params.id);
    
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

// Add place to trip
exports.addPlaceToTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }
    
    const placeId = req.body.placeId;
    
    // Check if place is already in trip
    if (trip.places.includes(placeId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Place already added to this trip'
      });
    }
    
    // Add place to trip
    trip.places.push(placeId);
    await trip.save();
    
    res.status(200).json({
      status: 'success',
      data: trip
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Remove place from trip
exports.removePlaceFromTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }
    
    const placeId = req.params.placeId;
    
    // Check if place is in trip
    if (!trip.places.includes(placeId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Place not found in this trip'
      });
    }
    
    // Remove place from trip
    trip.places = trip.places.filter(place => place.toString() !== placeId);
    await trip.save();
    
    res.status(200).json({
      status: 'success',
      data: trip
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get active trips
exports.getActiveTrips = async (req, res) => {
  try {
    const today = new Date();
    
    const activeTrips = await Trip.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
      isActive: true
    }).populate('places', 'name location category');
    
    res.status(200).json({
      status: 'success',
      results: activeTrips.length,
      data: activeTrips
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get trip statistics
exports.getTripStats = async (req, res) => {
  try {
    // Total trips
    const totalTrips = await Trip.countDocuments();
    
    // Active trips
    const today = new Date();
    const activeTrips = await Trip.countDocuments({
      startDate: { $lte: today },
      endDate: { $gte: today },
      isActive: true
    });
    
    // Upcoming trips
    const upcomingTrips = await Trip.countDocuments({
      startDate: { $gt: today },
      isActive: true
    });
    
    // Past trips
    const pastTrips = await Trip.countDocuments({
      endDate: { $lt: today }
    });
    
    // Destinations stats
    const destinationStats = await Trip.aggregate([
      { $group: {
          _id: '$destination',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Expenses stats by trip
    const tripExpenses = await Expense.aggregate([
      { $group: {
          _id: '$trip',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);
    
    // Populate trip information
    const tripExpensesWithDetails = await Promise.all(
      tripExpenses.map(async (item) => {
        if (!item._id) return { ...item, trip: null };
        
        const trip = await Trip.findById(item._id, 'name destination startDate endDate');
        return {
          ...item,
          trip: trip || null
        };
      })
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        totalTrips,
        activeTrips,
        upcomingTrips,
        pastTrips,
        destinationStats,
        tripExpenses: tripExpensesWithDetails
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update a trip
exports.updateTripExpense = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }
    
    const transaction = req.body;
    const expense = (trip.totalExpense ? trip.totalExpense : 0) + transaction.amount;

    trip.transactions.push(transaction);
    trip.totalExpense = expense
    
    await trip.save();
    
    res.status(200).json({
      status: 'success',
      data: trip
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};


// Get transactions grouped by category for a specific trip
exports.getTransactionsByCategory = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        status: 'error',
        message: 'Trip not found'
      });
    }

    const categoryTotals = {};

    trip.transactions.forEach(transaction => {
      const { category, amount } = transaction;
  
      if (!categoryTotals[category]) {
        categoryTotals[category] = { category, totalAmount: 0, count: 0 };
      }
  
      categoryTotals[category].totalAmount += amount;
      categoryTotals[category].count += 1;
    });
    
    categoryTotals.budget = trip.budget;
    categoryTotals.totalSpent = trip.totalExpense;
    console.log(categoryTotals);
    res.status(200).json({
      status: 'success',
      results: categoryTotals.length,
      data: categoryTotals
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};