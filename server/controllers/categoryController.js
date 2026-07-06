const Category = require('../models/Category');
const Product = require('../models/Product');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { categoryName, image } = req.body;

    if (!categoryName || !image) {
      return res.status(400).json({ error: 'Category name and image URL are required' });
    }

    const categoryExists = await Category.findOne({ categoryName: categoryName.trim() });
    if (categoryExists) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create({
      categoryName: categoryName.trim(),
      image
    });

    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { categoryName, image } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // If changing category name, also update all associated products' category field!
    const oldName = category.categoryName;
    if (categoryName && categoryName.trim() !== oldName) {
      category.categoryName = categoryName.trim();
      await Product.updateMany({ category: oldName }, { category: categoryName.trim() });
    }

    if (image) {
      category.image = image;
    }

    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
