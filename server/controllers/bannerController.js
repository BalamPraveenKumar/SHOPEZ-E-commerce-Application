const Banner = require('../models/Banner');

// Get all banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json({ banners });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a banner (Admin only)
exports.createBanner = async (req, res) => {
  try {
    const { title, image } = req.body;

    if (!title || !image) {
      return res.status(400).json({ error: 'Banner title and image URL are required' });
    }

    const banner = await Banner.create({ title, image });
    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a banner (Admin only)
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
