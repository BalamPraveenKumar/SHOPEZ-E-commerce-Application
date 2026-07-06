import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">SHOPEZ</div>
      <p>Your one-stop destination for premium apparel, footwear, and accessories.</p>
      
      <ul className="footer-links">
        <li><Link to="/" className="footer-link">Home</Link></li>
        <li><Link to="/products" className="footer-link">Products</Link></li>
        <li><Link to="/cart" className="footer-link">Cart</Link></li>
        <li><Link to="/profile" className="footer-link">Profile</Link></li>
      </ul>
      
      <p style={{ fontSize: '12px', marginTop: '20px', color: '#64748b' }}>
        &copy; {new Date().getFullYear()} SHOPEZ E-Commerce. All rights reserved. Skill Wallet Evaluator Project.
      </p>
    </footer>
  );
}
