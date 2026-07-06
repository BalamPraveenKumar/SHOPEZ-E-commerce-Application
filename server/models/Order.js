const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['Cash on Delivery', 'Credit/Debit Card', 'UPI', 'Net Banking'],
    default: 'Cash on Delivery'
  },
  shippingAddress: {
    type: String,
    required: [true, 'Shipping address is required']
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'On the Way', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
