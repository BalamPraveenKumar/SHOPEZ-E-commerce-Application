import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const searchVal = searchParams.get('search') || '';
  const selectedCat = searchParams.get('category') || '';
  const selectedGender = searchParams.get('gender') || '';
  const selectedSort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchVal) params.append('search', searchVal);
        if (selectedCat) params.append('category', selectedCat);
        if (selectedGender) params.append('gender', selectedGender);
        if (selectedSort) params.append('sort', selectedSort);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);

        const res = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  // Handle updates to search query parameters
  const updateQueryParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    const min = e.target.minInput.value;
    const max = e.target.maxInput.value;
    
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set('minPrice', min);
    else newParams.delete('minPrice');

    if (max) newParams.set('maxPrice', max);
    else newParams.delete('maxPrice');

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>
      {/* Sidebar Filters */}
      <div style={{
        flex: '1 1 240px',
        backgroundColor: 'var(--bg-card)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Filters</h3>
          <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Category</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="category"
                checked={selectedCat === ''}
                onChange={() => updateQueryParam('category', '')}
              />
              All Categories
            </label>
            {categories.map(cat => (
              <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCat === cat.categoryName}
                  onChange={() => updateQueryParam('category', cat.categoryName)}
                />
                {cat.categoryName}
              </label>
            ))}
          </div>
        </div>

        {/* Gender Filter */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Gender</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['', 'men', 'women', 'unisex', 'kids'].map(genderVal => (
              <label key={genderVal} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer', textTransform: 'capitalize' }}>
                <input
                  type="radio"
                  name="gender"
                  checked={selectedGender === genderVal}
                  onChange={() => updateQueryParam('gender', genderVal)}
                />
                {genderVal === '' ? 'All Genders' : genderVal}
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Price Range</h4>
          <form onSubmit={handlePriceFilter} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                name="minInput"
                placeholder="Min"
                defaultValue={minPrice}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px' }}
              />
              <input
                type="number"
                name="maxInput"
                placeholder="Max"
                defaultValue={maxPrice}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '13px' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: '8px', width: '100%', borderRadius: '6px', fontSize: '13px' }}>
              Apply Price
            </button>
          </form>
        </div>

        {/* Sorting */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Sort By</h4>
          <select
            value={selectedSort}
            onChange={(e) => updateQueryParam('sort', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none'
            }}
          >
            <option value="">Newest First</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product List */}
      <div style={{ flex: '3 1 600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Showing {products.length} {products.length === 1 ? 'product' : 'products'}
            {searchVal && ` for "${searchVal}"`}
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : products.length > 0 ? (
          <div className="products-grid" style={{ marginTop: '0' }}>
            {products.map(product => {
              const discountPrice = product.price - (product.price * (product.discount || 0) / 100);
              return (
                <div key={product._id} className="product-card">
                  <Link to={`/products/${product._id}`}>
                    <img src={product.mainImg} alt={product.title} className="product-card-img" />
                  </Link>
                  <div className="product-card-body">
                    <span className="product-card-category">{product.category}</span>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="product-card-title">{product.title}</h3>
                    </Link>
                    <div className="product-card-footer">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {product.discount > 0 ? (
                          <>
                            <span style={{ textDecoration: 'line-through', fontSize: '13px', color: 'var(--text-muted)' }}>
                              ₹{product.price}
                            </span>
                            <span className="product-price">₹{Math.round(discountPrice)}</span>
                          </>
                        ) : (
                          <span className="product-price">₹{product.price}</span>
                        )}
                      </div>
                      {product.discount > 0 && (
                        <span className="discount-badge">{product.discount}% OFF</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 40px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No products match your query</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Try widening your search terms or clearing current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
