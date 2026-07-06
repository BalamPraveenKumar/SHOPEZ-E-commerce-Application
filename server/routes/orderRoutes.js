const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getAllOrders, updateOrderStatus, getStatistics } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Protected Customer routes
router.post('/', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin-only routes
router.get('/all', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);
router.get('/statistics', protect, isAdmin, getStatistics);

module.exports = router;
