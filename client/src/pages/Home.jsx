import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, categoriesRes, productsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/banners'),
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/products?limit=8')
        ]);
        setBanners(bannersRes.data.banners || []);
        setCategories(categoriesRes.data.categories || []);
        setLatestProducts(productsRes.data.products || []);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  if (loading) return <Loading />;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#0f172a' }}>
      
      {/* ── HERO BANNER SECTION ── */}
      {banners.length > 0 ? (
        <div style={{
          position: 'relative',
          height: '480px',
          width: '100%',
          borderRadius: '30px',
          overflow: 'hidden',
          marginBottom: '50px',
          boxShadow: '0 20px 50px rgba(15,23,42,0.15)'
        }}>
          <img
            src={banners[currentBanner].image}
            alt={banners[currentBanner].title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.8s ease-in-out' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '50px 60px',
            color: 'white'
          }}>
            <span style={{
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '16px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              Limited Edition
            </span>
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: '900',
              lineHeight: '1.15',
              marginBottom: '20px',
              maxWidth: '650px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              {banners[currentBanner].title}
            </h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Link to="/products" className="btn btn-primary" style={{
                borderRadius: '30px',
                padding: '14px 32px',
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
                backgroundColor: '#3b82f6',
                border: 'none'
              }}>
                Shop Collection →
              </Link>
            </div>
          </div>

          {/* Carousel dots indicator */}
          {banners.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              display: 'flex',
              gap: '10px',
              zIndex: '10'
            }}>
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  style={{
                    width: currentBanner === index ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: currentBanner === index ? '#3b82f6' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Fallback premium hero banner if no database banners exist yet */
        <div style={{
          position: 'relative',
          height: '460px',
          width: '100%',
          borderRadius: '30px',
          overflow: 'hidden',
          marginBottom: '50px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 60px',
          boxShadow: '0 20px 40px rgba(15,23,42,0.1)'
        }}>
          {/* Decorative shapes */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(59,130,246,0.15)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '15%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(147,197,253,0.1)', filter: 'blur(40px)' }} />

          <div style={{ zIndex: 2, color: 'white', maxWidth: '580px' }}>
            <span style={{
              backgroundColor: '#3b82f6',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '20px',
              display: 'inline-block'
            }}>
              New Arrivals 2026
            </span>
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 54px)',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '20px'
            }}>
              Upgrade Your<br />
              <span style={{ color: '#60a5fa' }}>Everyday Wardrobe</span>
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '32px', lineHeight: '1.6' }}>
              Explore premium apparel, active footwear, and trendy accessories curated to redefine your personal aesthetic.
            </p>
            <Link to="/products" style={{
              display: 'inline-block',
              backgroundColor: '#fff',
              color: '#0f172a',
              padding: '14px 32px',
              borderRadius: '30px',
              fontWeight: '700',
              fontSize: '15px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >
              Start Shopping Now →
            </Link>
          </div>
        </div>
      )}

      {/* ── CATEGORIES ROW ── */}
      {categories.length > 0 && (
        <section style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>Curated Categories</span>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Discover Categories</h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {categories.map(cat => (
              <Link
                key={cat._id}
                to={`/products?category=${encodeURIComponent(cat.categoryName)}`}
                style={{
                  position: 'relative',
                  height: '220px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.categoryName}
                  style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: '1' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: '0',
                  background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.75) 100%)',
                  zIndex: '2'
                }} />
                <div style={{ position: 'relative', zIndex: '3', margin: '24px', color: 'white' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
                    {cat.categoryName}
                  </h3>
                  <span style={{ fontSize: '13px', opacity: 0.8, fontWeight: '500' }}>Explore Catalog →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURES ADVANTAGE STRIP ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        backgroundColor: '#f8fafc',
        borderRadius: '24px',
        padding: '36px',
        marginBottom: '60px',
        border: '1px solid #e2e8f0'
      }}>
        {[
          { icon: '🚚', title: 'Fast Home Delivery', desc: 'Free shipping on all shopping orders above ₹1500.' },
          { icon: '💵', title: 'Cash On Delivery', desc: 'Secure cash payment options right at your doorstep.' },
          { icon: '🔄', title: 'Easy Returns Policy', desc: 'Hassle-free replacement/returns within 7 days.' },
          { icon: '🛡️', title: 'Verified Quality', desc: 'Strictest parameters applied to our product listings.' }
        ].map((feat, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <span style={{
              fontSize: '28px',
              backgroundColor: '#fff',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
            }}>{feat.icon}</span>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{feat.title}</h4>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4', margin: 0 }}>{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>Trendy & Fresh</span>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Featured Products</h2>
          </div>
          <Link to="/products" style={{
            color: '#1d4ed8',
            fontWeight: '700',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
            onMouseEnter={e => e.target.style.color = '#3b82f6'}
            onMouseLeave={e => e.target.style.color = '#1d4ed8'}
          >
            Explore All Items
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        {latestProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '30px'
          }}>
            {latestProducts.map(product => {
              const discountPrice = product.price - (product.price * (product.discount || 0) / 100);
              return (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)';
                  }}
                >
                  <Link to={`/products/${product._id}`} style={{ position: 'relative', height: '320px', display: 'block', overflow: 'hidden' }}>
                    <img
                      src={product.mainImg}
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {product.discount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        letterSpacing: '0.5px'
                      }}>
                        {product.discount}% OFF
                      </span>
                    )}
                  </Link>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.category}</span>
                      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#0f172a',
                          marginTop: '4px',
                          marginBottom: '0',
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{product.title}</h3>
                      </Link>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {product.discount > 0 ? (
                          <>
                            <span style={{ textDecoration: 'line-through', fontSize: '12px', color: '#94a3b8' }}>
                              ₹{product.price}
                            </span>
                            <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                              ₹{Math.round(discountPrice)}
                            </span>
                          </>
                        ) : (
                          <span style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                      <Link to={`/products/${product._id}`} style={{
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '18px'
                      }}
                        onMouseEnter={e => { e.target.style.backgroundColor = '#1d4ed8'; e.target.style.color = '#fff'; }}
                        onMouseLeave={e => { e.target.style.backgroundColor = '#eff6ff'; e.target.style.color = '#1d4ed8'; }}
                      >
                        +
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: '#f8fafc',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            color: '#64748b'
          }}>No products found in catalog.</div>
        )}
      </section>
    </div>
  );
}
