import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cartBtnLoading, setCartBtnLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data.product);
        setActiveImg(res.data.product.mainImg);
        if (res.data.product.sizes?.length > 0) {
          // If free size, select it immediately
          if (res.data.product.sizes[0] === 'Free Size') {
            setSelectedSize('Free Size');
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    setError('');
    setSuccess('');

    if (!token) {
      setError('Please login to add products to your cart.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (!selectedSize) {
      setError('Please select a size first.');
      return;
    }

    setCartBtnLoading(true);
    try {
      await addToCart(product._id, quantity, selectedSize);
      setSuccess('Product added to cart successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setCartBtnLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!product) return <div style={{ textAlign: 'center', padding: '40px' }}>Product not found.</div>;

  const finalPrice = product.price - (product.price * (product.discount || 0) / 100);

  return (
    <div style={{
      display: 'flex',
      gap: '40px',
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: 'var(--bg-card)',
      padding: '40px',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Product Images column */}
      <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          height: '450px',
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border-color)'
        }}>
          <img src={activeImg} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        
        {/* Carousel thumbnails */}
        {product.carousel && product.carousel.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
            <button
              onClick={() => setActiveImg(product.mainImg)}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: activeImg === product.mainImg ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                padding: '0'
              }}
            >
              <img src={product.mainImg} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
            {product.carousel.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImg(imgUrl)}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: activeImg === imgUrl ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  padding: '0'
                }}
              >
                <img src={imgUrl} alt={`Thumbnail ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details column */}
      <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <span style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>
            {product.category} &middot; <span style={{ textTransform: 'capitalize' }}>{product.gender}</span>
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginTop: '4px', marginBottom: '12px' }}>{product.title}</h1>
          
          {/* Price details */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            {product.discount > 0 ? (
              <>
                <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)' }}>₹{Math.round(finalPrice)}</span>
                <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '18px' }}>₹{product.price}</span>
                <span style={{ backgroundColor: '#fef2f2', color: 'var(--error)', fontSize: '12px', fontWeight: '700', padding: '4px 8px', borderRadius: '4px', border: '1px solid #fee2e2' }}>
                  {product.discount}% OFF
                </span>
              </>
            ) : (
              <span style={{ fontSize: '28px', fontWeight: '700' }}>₹{product.price}</span>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Product Description</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>{product.description}</p>
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Select Size</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: selectedSize === size ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: selectedSize === size ? 'var(--primary-glow)' : 'white',
                    color: selectedSize === size ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity selector */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Quantity</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                style={{ padding: '10px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
              >
                -
              </button>
              <span style={{ width: '40px', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                style={{ padding: '10px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Action feedback alerts */}
        {error && <div className="alert-box alert-box-error" style={{ margin: '0' }}>{error}</div>}
        {success && <div className="alert-box alert-box-success" style={{ margin: '0' }}>{success}</div>}

        {/* Cart Trigger button */}
        <button
          onClick={handleAddToCart}
          className="btn btn-primary"
          disabled={cartBtnLoading}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '600', display: 'flex', justifyContent: 'center', gap: '10px' }}
        >
          {cartBtnLoading ? (
            <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
