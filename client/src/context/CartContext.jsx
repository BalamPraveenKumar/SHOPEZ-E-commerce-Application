import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token, user } = useContext(AuthContext);

  // Fetch cart items from server when user/token is available
  const fetchCart = async () => {
    if (!token || !user || user.userType === 'admin') {
      setCart([]);
      return;
    }
    try {
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data.cart || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, user]);

  // Add item to cart
  const addToCart = async (productId, quantity, size) => {
    if (!token) throw new Error('Please login to add items to cart');
    try {
      const res = await axios.post('http://localhost:5000/api/cart', 
        { productId, quantity, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart(); // Refresh cart from server
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to add item to cart');
    }
  };

  // Update item quantity
  const updateCartQuantity = async (itemId, quantity) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/cart/${itemId}`, 
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(prev => prev.map(item => item._id === itemId ? res.data.item : item));
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update quantity');
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to remove item');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  // Compute total amount (with discount if applicable)
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (!item.productId) return total;
      const originalPrice = item.productId.price;
      const discount = item.productId.discount || 0;
      const finalPrice = originalPrice - (originalPrice * discount / 100);
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  // Compute total items count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartCount,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
