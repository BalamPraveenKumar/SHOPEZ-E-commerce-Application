const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { products, paymentMethod, shippingAddress, pincode, totalAmount } = req.body;

    if (!products || products.length === 0 || !shippingAddress || !pincode || !totalAmount) {
      return res.status(400).json({ error: 'Products, shipping address, pincode, and total amount are required' });
    }

    const order = await Order.create({
      userId: req.user._id,
      products,
      paymentMethod,
      shippingAddress,
      pincode,
      totalAmount,
      status: 'Pending'
    });

    // Clear user's cart after successfully placing order
    await Cart.deleteMany({ userId: req.user._id });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('products.productId')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: View all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'username email')
      .populate('products.productId')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Dashboard Statistics
exports.getStatistics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});
    const totalUsers = await User.countDocuments({ userType: 'customer' });
    const totalProducts = await Product.countDocuments({});
    const totalCategories = await Category.countDocuments({});

    // Calculate total revenue from Delivered or non-cancelled orders
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Group sales/revenue by status
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    // Format sales data by month (last 6 months) for chart
    const monthlySales = await Order.aggregate([
      {
        $match: { status: { $ne: 'Cancelled' } }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 }
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalCategories,
      totalRevenue,
      statusCounts,
      monthlySales
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
