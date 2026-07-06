const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  mainImg: {
    type: String,
    required: [true, 'Main product image URL is required']
  },
  carousel: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Product category is required']
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex', 'kids'],
    default: 'unisex'
  },
  sizes: {
    type: [String],
    default: ['S', 'M', 'L', 'XL']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
