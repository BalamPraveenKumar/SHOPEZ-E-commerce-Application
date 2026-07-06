import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/orders/my-orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' };
      case 'Processing': return { bg: '#eff6ff', text: '#2563eb', border: '#dbeafe' };
      case 'On the Way':
      case 'Shipped': return { bg: '#faf5ff', text: '#9333ea', border: '#f3e8ff' };
      case 'Delivered': return { bg: '#f0fdf4', text: '#16a34a', border: '#dcfce7' };
      case 'Cancelled': return { bg: '#fef2f2', text: '#dc2626', border: '#fee2e2' };
      default: return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  if (loading) return <Loading />;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Order History</h2>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px'
        }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => {
            const statusStyle = getStatusColor(order.status);
            return (
              <div
                key={order._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Header details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Order ID</span>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>#{order._id}</h4>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Placed on {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                      border: `1px solid ${statusStyle.border}`,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}>
                      {order.status}
                    </span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Products list inside this order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.products.map((item, idx) => {
                    const productObj = item.productId;
                    return (
                      <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        {productObj ? (
                          <>
                            <img
                              src={productObj.mainImg}
                              alt={productObj.title}
                              style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <h5 style={{ fontSize: '14px', fontWeight: '600' }}>{productObj.title}</h5>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                Size: {item.size} &middot; Qty: {item.quantity} &middot; Price: ₹{item.price}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Product details unavailable &middot; Size: {item.size} &middot; Qty: {item.quantity}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Delivery footer */}
                <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <strong>Shipping Address:</strong> {order.shippingAddress}, {order.pincode}
                  <span style={{ display: 'block', marginTop: '4px' }}>
                    <strong>Payment Mode:</strong> {order.paymentMethod}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
