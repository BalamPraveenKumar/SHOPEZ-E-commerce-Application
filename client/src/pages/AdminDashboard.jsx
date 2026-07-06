import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for Products
  const [productForm, setProductForm] = useState({
    id: '', title: '', description: '', mainImg: '', category: '', gender: 'unisex', price: '', discount: 0, sizes: 'S,M,L,XL'
  });
  const [prodModalOpen, setProdModalOpen] = useState(false);

  // Form states for Categories
  const [categoryForm, setCategoryForm] = useState({ id: '', categoryName: '', image: '' });
  const [catModalOpen, setCatModalOpen] = useState(false);

  // Form states for Banners
  const [bannerForm, setBannerForm] = useState({ title: '', image: '' });
  const [banModalOpen, setBanModalOpen] = useState(false);

  const [notification, setNotification] = useState({ type: '', message: '' });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 3000);
  };

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, ordRes, banRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders/statistics', getHeaders()),
        axios.get('http://localhost:5000/api/products', getHeaders()),
        axios.get('http://localhost:5000/api/categories', getHeaders()),
        axios.get('http://localhost:5000/api/orders/all', getHeaders()),
        axios.get('http://localhost:5000/api/banners', getHeaders())
      ]);

      setStats(statsRes.data);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
      setOrders(ordRes.data.orders || []);
      setBanners(banRes.data.banners || []);
    } catch (err) {
      console.error('Failed to load admin panel data:', err);
      showNotification('error', 'Failed to retrieve database contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Update order status trigger
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, getHeaders());
      showNotification('success', 'Order status updated successfully');
      loadAllData();
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Failed to update order status');
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      discount: Number(productForm.discount || 0),
      sizes: productForm.sizes.split(',').map(s => s.trim())
    };

    try {
      if (productForm.id) {
        await axios.put(`http://localhost:5000/api/products/${productForm.id}`, payload, getHeaders());
        showNotification('success', 'Product updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/products', payload, getHeaders());
        showNotification('success', 'Product created successfully');
      }
      setProdModalOpen(false);
      setProductForm({ id: '', title: '', description: '', mainImg: '', category: '', gender: 'unisex', price: '', discount: 0, sizes: 'S,M,L,XL' });
      loadAllData();
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Product operation failed');
    }
  };

  const handleProductDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, getHeaders());
      showNotification('success', 'Product deleted successfully');
      loadAllData();
    } catch (err) {
      showNotification('error', 'Failed to delete product');
    }
  };

  // Category CRUD
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoryForm.id) {
        await axios.put(`http://localhost:5000/api/categories/${categoryForm.id}`, categoryForm, getHeaders());
        showNotification('success', 'Category updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/categories', categoryForm, getHeaders());
        showNotification('success', 'Category created successfully');
      }
      setCatModalOpen(false);
      setCategoryForm({ id: '', categoryName: '', image: '' });
      loadAllData();
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Category operation failed');
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, getHeaders());
      showNotification('success', 'Category deleted successfully');
      loadAllData();
    } catch (err) {
      showNotification('error', 'Failed to delete category');
    }
  };

  // Banner CRUD
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/banners', bannerForm, getHeaders());
      showNotification('success', 'Banner uploaded successfully');
      setBanModalOpen(false);
      setBannerForm({ title: '', image: '' });
      loadAllData();
    } catch (err) {
      showNotification('error', err.response?.data?.error || 'Banner operation failed');
    }
  };

  const handleBannerDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this banner?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/banners/${id}`, getHeaders());
      showNotification('success', 'Banner removed');
      loadAllData();
    } catch (err) {
      showNotification('error', 'Failed to remove banner');
    }
  };

  if (loading && !stats) return <Loading />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#f8fafc', margin: 0, padding: 0 }}>
      {/* Toast Notification */}
      {notification.message && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: '9999',
          padding: '16px 20px', borderRadius: '12px',
          backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff', fontWeight: '600', fontSize: '14px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'slideIn 0.3s ease'
        }}>
          <span>{notification.type === 'success' ? '✅' : '❌'}</span>
          {notification.message}
        </div>
      )}

      {/* Sidebar Layout */}
      <div style={{
        width: '280px',
        backgroundColor: '#0f172a', // Dark slate
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxShadow: '4px 0 15px rgba(15,23,42,0.08)',
        zIndex: 100
      }}>
        {/* Sidebar Brand Header */}
        <div style={{
          padding: '24px 30px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', fontSize: '20px', color: '#fff'
          }}>S</div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, letterSpacing: '0.5px' }}>SHOPEZ</h1>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Control Center</span>
          </div>
        </div>

        {/* Navigation Tabs list */}
        <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { key: 'stats', label: 'Dashboard Stats', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            ) },
            { key: 'products', label: 'Manage Products', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            ) },
            { key: 'categories', label: 'Manage Categories', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            ) },
            { key: 'orders', label: 'Manage Orders', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            ) },
            { key: 'banners', label: 'Manage Banners', icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            ) }
          ].map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`admin-nav-btn ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Actions */}
        <div style={{ padding: '20px 16px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            to="/"
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#1e293b',
              color: '#3b82f6',
              fontSize: '13px',
              fontWeight: '700',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#243249'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1e293b'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Go to Storefront
          </Link>
          <button
            onClick={logout}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#ef444415',
              color: '#f87171',
              border: 'none',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ef444425'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ef444415'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Workspace Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100vh' }}>
        {/* Top Header Panel */}
        <header style={{
          height: '75px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          flexShrink: 0
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {activeTab === 'stats' && 'Analytics Overview'}
              {activeTab === 'products' && 'Product Inventory Management'}
              {activeTab === 'categories' && 'Category Management'}
              {activeTab === 'orders' && 'Customer Order Management'}
              {activeTab === 'banners' && 'Banner Asset Management'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{user?.username || 'Administrator'}</span>
              <span style={{
                fontSize: '11px', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.5px',
                backgroundColor: '#d1fae5', padding: '2px 8px', borderRadius: '20px'
              }}>Active Session</span>
            </div>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#3b82f6',
              border: '2px solid #e2e8f0', fontSize: '18px'
            }}>
              {(user?.username || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Workspace body */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {activeTab === 'stats' && stats && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Top Counters Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                {[
                  { title: 'Total Revenue', value: `₹${Math.round(stats.totalRevenue)}`, icon: '💵', bg: '#eff6ff', color: '#6366f1' },
                  { title: 'Total Orders', value: stats.totalOrders, icon: '🛒', bg: '#faf5ff', color: '#a855f7' },
                  { title: 'Total Products', value: stats.totalProducts, icon: '📦', bg: '#f0fdf4', color: '#10b981' },
                  { title: 'Total Users', value: stats.totalUsers, icon: '👥', bg: '#fff7ed', color: '#f59e0b' }
                ].map((c, i) => (
                  <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="stat-icon" style={{ backgroundColor: c.bg, color: c.color }}>
                      {c.icon}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.title}</span>
                      <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{c.value}</h2>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sales breakdown tables */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {/* Revenue by status */}
                <div style={{ flex: '1 1 340px', backgroundColor: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#0f172a' }}>Orders by Status</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Count</th>
                        <th style={{ textAlign: 'right' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.statusCounts?.map((s, idx) => {
                        let badgeClass = 'badge-warning';
                        if (s._id === 'Delivered') badgeClass = 'badge-success';
                        if (s._id === 'Cancelled') badgeClass = 'badge-error';
                        if (s._id === 'On the Way') badgeClass = 'badge-info';
                        if (s._id === 'Processing') badgeClass = 'badge-purple';
                        return (
                          <tr key={idx}>
                            <td>
                              <span className={`badge ${badgeClass}`}>{s._id}</span>
                            </td>
                            <td>{s.count}</td>
                            <td style={{ textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>₹{Math.round(s.revenue)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Monthly breakdown */}
                <div style={{ flex: '1 1 340px', backgroundColor: '#fff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#0f172a' }}>Monthly Sales Report</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Period</th>
                        <th>Order Count</th>
                        <th style={{ textAlign: 'right' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.monthlySales?.map((m, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '600' }}>{m._id.month}/{m._id.year}</td>
                          <td>{m.count}</td>
                          <td style={{ textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>₹{Math.round(m.sales)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Manage Products Tab */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Products List ({products.length})</h3>
                <button onClick={() => {
                  setProductForm({ id: '', title: '', description: '', mainImg: '', category: '', gender: 'unisex', price: '', discount: 0, sizes: 'S,M,L,XL' });
                  setProdModalOpen(true);
                }} style={{
                  padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px',
                  fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                }}>
                  ➕ Add Product
                </button>
              </div>

              {/* Product Forms Overlay Modal */}
              {prodModalOpen && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 9999
                }}>
                  <div style={{
                    backgroundColor: '#fff', padding: '36px', borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                    width: '90%', maxWidth: '650px',
                    maxHeight: '90vh', overflowY: 'auto',
                    border: '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column', gap: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        {productForm.id ? '✏️ Edit Product Details' : '➕ Add New Product'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setProdModalOpen(false)}
                        style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
                      >✕</button>
                    </div>

                    <form onSubmit={handleProductSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Product Title</label>
                        <input placeholder="Enter title" required value={productForm.title} onChange={e => setProductForm({ ...productForm, title: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Main Image URL</label>
                        <input placeholder="https://images.unsplash.com/..." required value={productForm.mainImg} onChange={e => setProductForm({ ...productForm, mainImg: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Category</label>
                        <input placeholder="e.g. Apparel, Footwear" required value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Target Segment</label>
                        <select value={productForm.gender} onChange={e => setProductForm({ ...productForm, gender: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff' }}>
                          <option value="unisex">Unisex</option>
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="kids">Kids</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Price (₹)</label>
                        <input placeholder="INR" type="number" required value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Discount (%)</label>
                        <input placeholder="0" type="number" value={productForm.discount} onChange={e => setProductForm({ ...productForm, discount: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Available Sizes (comma-separated)</label>
                        <input placeholder="S,M,L,XL" value={productForm.sizes} onChange={e => setProductForm({ ...productForm, sizes: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Description</label>
                        <textarea placeholder="Enter detailed product description" required value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} rows="3" style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', gridColumn: 'span 2', marginTop: '10px' }}>
                        <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Save Product</button>
                        <button type="button" onClick={() => setProdModalOpen(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Products Table Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => (
                      <tr key={prod._id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img src={prod.mainImg} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>{prod.title}</span>
                        </td>
                        <td>{prod.category}</td>
                        <td style={{ fontWeight: '700', color: '#0f172a' }}>₹{prod.price}</td>
                        <td>
                          {prod.discount > 0 ? (
                            <span className="badge badge-error">-{prod.discount}%</span>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>None</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                              setProductForm({ id: prod._id, title: prod.title, description: prod.description, mainImg: prod.mainImg, category: prod.category, gender: prod.gender || 'unisex', price: prod.price, discount: prod.discount, sizes: prod.sizes?.join(',') || 'S,M,L,XL' });
                              setProdModalOpen(true);
                            }} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>Edit</button>
                            <button onClick={() => handleProductDelete(prod._id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '13px' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Categories Tab */}
          {activeTab === 'categories' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Categories ({categories.length})</h3>
                <button onClick={() => {
                  setCategoryForm({ id: '', categoryName: '', image: '' });
                  setCatModalOpen(true);
                }} style={{
                  padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px',
                  fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                }}>
                  ➕ Add Category
                </button>
              </div>

              {/* Category overlay modal */}
              {catModalOpen && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 9999
                }}>
                  <div style={{
                    backgroundColor: '#fff', padding: '36px', borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                    width: '90%', maxWidth: '450px',
                    border: '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column', gap: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        {categoryForm.id ? '✏️ Edit Category' : '➕ Add Category'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCatModalOpen(false)}
                        style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
                      >✕</button>
                    </div>

                    <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Category Name</label>
                        <input placeholder="Enter name" required value={categoryForm.categoryName} onChange={e => setCategoryForm({ ...categoryForm, categoryName: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Category Image URL</label>
                        <input placeholder="https://..." required value={categoryForm.image} onChange={e => setCategoryForm({ ...categoryForm, image: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Save Category</button>
                        <button type="button" onClick={() => setCatModalOpen(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Categories table card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Banner / Preview</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat._id}>
                        <td style={{ fontWeight: '700', color: '#0f172a' }}>{cat.categoryName}</td>
                        <td>
                          <img src={cat.image} alt="" style={{ width: '80px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button onClick={() => {
                              setCategoryForm({ id: cat._id, categoryName: cat.categoryName, image: cat.image });
                              setCatModalOpen(true);
                            }} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '13px' }}>Edit</button>
                            <button onClick={() => handleCategoryDelete(cat._id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '13px' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Orders Tab */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Customer Orders ({orders.length})</h3>

              <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Details</th>
                      <th>Total Amount</th>
                      <th>Current Status</th>
                      <th style={{ textAlign: 'right' }}>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      let badgeClass = 'badge-warning';
                      if (order.status === 'Delivered') badgeClass = 'badge-success';
                      if (order.status === 'Cancelled') badgeClass = 'badge-error';
                      if (order.status === 'On the Way') badgeClass = 'badge-info';
                      if (order.status === 'Processing') badgeClass = 'badge-purple';
                      return (
                        <tr key={order._id}>
                          <td style={{ fontWeight: '600', color: '#64748b' }}>#{order._id.substring(16).toUpperCase()}</td>
                          <td>
                            <strong style={{ display: 'block', color: '#0f172a' }}>{order.userId?.username || 'Guest'}</strong>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{order.userId?.email}</span>
                          </td>
                          <td style={{ fontWeight: '700', color: '#0f172a' }}>₹{order.totalAmount}</td>
                          <td>
                            <span className={`badge ${badgeClass}`}>{order.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                              style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '13px', backgroundColor: '#fff', color: '#334155' }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="On the Way">On the Way</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Banners Tab */}
          {activeTab === 'banners' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Advertising Banners ({banners.length})</h3>
                <button onClick={() => setBanModalOpen(true)} style={{
                  padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px',
                  fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
                }}>
                  ➕ Add Banner
                </button>
              </div>

              {/* Banner modal overlay */}
              {banModalOpen && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 9999
                }}>
                  <div style={{
                    backgroundColor: '#fff', padding: '36px', borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                    width: '90%', maxWidth: '450px',
                    border: '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column', gap: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Add Advertising Banner</h3>
                      <button
                        type="button"
                        onClick={() => setBanModalOpen(false)}
                        style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
                      >✕</button>
                    </div>

                    <form onSubmit={handleBannerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Banner Title</label>
                        <input placeholder="Enter title" required value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Banner Image URL</label>
                        <input placeholder="https://..." required value={bannerForm.image} onChange={e => setBannerForm({ ...bannerForm, image: e.target.value })} style={{ padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Save Banner</button>
                        <button type="button" onClick={() => setBanModalOpen(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Banners grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {banners.map(ban => (
                  <div key={ban._id} style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <img src={ban.image} alt={ban.title} style={{ height: '180px', width: '100%', objectFit: 'cover' }} />
                    <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{ban.title}</strong>
                      <button onClick={() => handleBannerDelete(ban._id)} style={{ padding: '6px 12px', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
