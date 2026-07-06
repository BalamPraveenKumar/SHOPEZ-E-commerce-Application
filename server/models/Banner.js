const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Banner image URL is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', BannerSchema);
