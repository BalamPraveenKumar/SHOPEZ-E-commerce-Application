const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe, updateProfile, getUsers } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin-only routes
router.get('/users', protect, isAdmin, getUsers);

module.exports = router;
