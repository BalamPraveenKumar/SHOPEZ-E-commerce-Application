const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Category image URL is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);
