const Product = require('../models/Product');

// Get all products with Search, Filters, and Sorting
exports.getProducts = async (req, res) => {
  try {
    const { search, category, gender, minPrice, maxPrice, sort } = req.query;
    // Only return products with valid main image URLs
    let query = {
      mainImg: { $regex: /^https?:\/\// }
    };

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Gender
    if (gender) {
      query.gender = gender;
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Prepare sorting
    let sortOption = {};
    if (sort === 'priceAsc') {
      sortOption.price = 1;
    } else if (sort === 'priceDesc') {
      sortOption.price = -1;
    } else {
      sortOption.createdAt = -1; // default newest first
    }

    const products = await Product.find(query).sort(sortOption);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product details
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.mainImg || !/^https?:\/\//.test(product.mainImg)) {
      return res.status(404).json({ error: 'Product not found or has an invalid image URL' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, category, gender, sizes, price, discount } = req.body;

    if (!title || !description || !mainImg || !category || !price) {
      return res.status(400).json({ error: 'Title, description, main image, category and price are required' });
    }

    if (!/^https?:\/\//.test(mainImg)) {
      return res.status(400).json({ error: 'Main image must be a valid HTTP or HTTPS URL' });
    }

    const product = await Product.create({
      title,
      description,
      mainImg,
      carousel: carousel || [],
      category,
      gender: gender || 'unisex',
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      price,
      discount: discount || 0
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (req.body.mainImg && !/^https?:\/\//.test(req.body.mainImg)) {
      return res.status(400).json({ error: 'Main image must be a valid HTTP or HTTPS URL' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
