const Cart = require('../models/Cart');

// Get cart items for user
exports.getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id })
      .populate('productId');
    res.json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ error: 'Product ID and size are required' });
    }

    // Check if same product and size already exists in user's cart
    let cartItem = await Cart.findOne({
      userId: req.user._id,
      productId,
      size
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity || 1);
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: req.user._id,
        productId,
        quantity: Number(quantity || 1),
        size
      });
    }

    // Return full populated cart
    const fullItem = await Cart.findById(cartItem._id).populate('productId');
    res.status(201).json({ message: 'Added to cart successfully', item: fullItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined || Number(quantity) < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    cartItem.quantity = Number(quantity);
    await cartItem.save();

    const populatedItem = await Cart.findById(cartItem._id).populate('productId');
    res.json({ message: 'Cart updated successfully', item: populatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
