const express = require('express');
const router = express.Router();
const { getBanners, createBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBanners);

// Admin-only routes
router.post('/', protect, isAdmin, createBanner);
router.delete('/:id', protect, isAdmin, deleteBanner);

module.exports = router;
