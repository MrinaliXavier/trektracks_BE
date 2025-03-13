// routes/expenseRoutes.js

const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// GET /api/expenses - Get all expenses
router.get('/', expenseController.getAllExpenses);

// GET /api/expenses/stats - Get expense statistics
router.get('/stats', expenseController.getExpenseStats);

// GET /api/expenses/trip/:tripId - Get expenses for a specific trip
router.get('/trip/:tripId', expenseController.getTripExpenses);

// GET /api/expenses/:id - Get a specific expense
router.get('/:id', expenseController.getExpense);

// POST /api/expenses - Create a new expense
router.post('/', expenseController.createExpense);

// PATCH /api/expenses/:id - Update an expense
router.patch('/:id', expenseController.updateExpense);

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;