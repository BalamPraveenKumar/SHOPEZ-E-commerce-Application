import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const paymentMethod = 'Cash on Delivery';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>No items to checkout</h2>
        <button onClick={() => navigate('/products')} className="btn btn-primary" style={{ marginTop: '16px' }}>
          Browse Products
        </button>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const delivery = subtotal > 1500 ? 0 : 99;
  const grandTotal = subtotal + delivery;

  const validateForm = () => {
    if (!shippingAddress.trim()) {
      setError('Shipping address is required');
      return false;
    }
    if (!pincode.trim()) {
      setError('Pincode is required');
      return false;
    }
    if (pincode.trim().length !== 6 || isNaN(Number(pincode.trim()))) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    // Structure products payload
    const orderProducts = cart.map(item => {
      const originalPrice = item.productId.price;
      const discount = item.productId.discount || 0;
      const finalPrice = originalPrice - (originalPrice * discount / 100);
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        size: item.size,
        price: Math.round(finalPrice)
      };
    });

    setLoading(true);
    try {
      const payload = {
        products: orderProducts,
        paymentMethod,
        shippingAddress,
        pincode,
        totalAmount: Math.round(grandTotal)
      };

      await axios.post('http://localhost:5000/api/orders', payload);
      setSuccess('Order placed successfully! Redirecting...');
      clearCart();
      setTimeout(() => {
        navigate('/orders');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>
      {/* Checkout Form */}
      <div style={{ flex: '2 1 500px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '30px',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>Checkout Details</h2>
          
          {error && <div className="alert-box alert-box-error">{error}</div>}
          {success && <div className="alert-box alert-box-success">{success}</div>}

          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }} htmlFor="address">
                Shipping Address
              </label>
              <textarea
                id="address"
                placeholder="Enter full delivery address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                disabled={loading}
                rows="3"
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }} htmlFor="pincode">
                Pincode
              </label>
              <input
                id="pincode"
                type="text"
                maxLength="6"
                placeholder="6-digit pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                disabled={loading}
                style={{
                  padding: '12px 16px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                Payment Method
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px 20px',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                marginTop: '4px'
              }}>
                <span style={{ fontSize: '28px' }}>💵</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#1d4ed8' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Pay when your order arrives at your doorstep</div>
                </div>
                <span style={{
                  marginLeft: 'auto',
                  backgroundColor: '#22c55e', color: '#fff',
                  fontSize: '11px', fontWeight: '700',
                  padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px'
                }}>SELECTED</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '14px', width: '100%', marginTop: '10px' }}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>

      {/* Summary column */}
      <div style={{ flex: '1 1 300px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '30px',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Items in Order</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            {cart.map(item => {
              if (!item.productId) return null;
              const originalPrice = item.productId.price;
              const discount = item.productId.discount || 0;
              const finalPrice = originalPrice - (originalPrice * discount / 100);

              return (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                    {item.productId.title} (x{item.quantity})
                  </span>
                  <span style={{ fontWeight: '500' }}>₹{Math.round(finalPrice * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <span style={{ fontWeight: '500' }}>₹{Math.round(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Charges</span>
              <span style={{ fontWeight: '500' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
            <span>Order Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{Math.round(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
