import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQtyChange = async (itemId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    try {
      await updateCartQuantity(itemId, newQty);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 40px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-sm)',
        maxWidth: '600px',
        margin: '40px auto'
      }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '20px' }}>
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Your shopping cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Add products to your cart and they will show up here.</p>
        <Link to="/products" className="btn btn-primary" style={{ borderRadius: '24px', padding: '10px 28px' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const delivery = subtotal > 1500 ? 0 : 99; // Free shipping over ₹1500
  const grandTotal = subtotal + delivery;

  return (
    <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>
      {/* Cart Items List */}
      <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Shopping Cart</h2>
        
        {cart.map(item => {
          if (!item.productId) return null;
          const originalPrice = item.productId.price;
          const discount = item.productId.discount || 0;
          const finalPrice = originalPrice - (originalPrice * discount / 100);
          const itemTotal = finalPrice * item.quantity;

          return (
            <div
              key={item._id}
              style={{
                display: 'flex',
                gap: '20px',
                backgroundColor: 'var(--bg-card)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <img
                src={item.productId.mainImg}
                alt={item.productId.title}
                style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />

              <div style={{ flexGrow: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {item.productId.category}
                </span>
                <Link to={`/products/${item.productId._id}`} style={{ fontWeight: '600', fontSize: '16px', color: 'var(--text-main)' }}>
                  {item.productId.title}
                </Link>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Size: <strong style={{ color: 'var(--text-main)' }}>{item.size}</strong></span>
                  <span>Unit Price: <strong style={{ color: 'var(--text-main)' }}>₹{Math.round(finalPrice)}</strong></span>
                </div>
              </div>

              {/* Quantity selectors */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <button
                  onClick={() => handleQtyChange(item._id, item.quantity, -1)}
                  style={{ padding: '6px 12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600' }}
                >
                  -
                </button>
                <span style={{ width: '30px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>{item.quantity}</span>
                <button
                  onClick={() => handleQtyChange(item._id, item.quantity, 1)}
                  style={{ padding: '6px 12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600' }}
                >
                  +
                </button>
              </div>

              {/* Price calculations */}
              <div style={{ minWidth: '100px', textAlign: 'right' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
                  ₹{Math.round(itemTotal)}
                </span>
              </div>

              {/* Remove trigger */}
              <button
                onClick={() => handleRemove(item._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--error)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Summary Card */}
      <div style={{ flex: '1 1 300px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            padding: '30px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            position: 'sticky',
            top: '100px'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: '500' }}>₹{Math.round(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Charges</span>
              <span style={{ fontWeight: '500' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
            </div>
            {delivery > 0 && (
              <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
                Add items worth ₹{Math.round(1500 - subtotal)} more for free delivery!
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{Math.round(grandTotal)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px' }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
