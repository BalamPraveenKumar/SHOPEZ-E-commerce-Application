import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 40px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '24px',
      boxShadow: 'var(--shadow-sm)',
      maxWidth: '600px',
      margin: '40px auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <h1 style={{ fontSize: '72px', fontWeight: '800', color: 'var(--primary)', lineHeight: '1' }}>404</h1>
      <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary" style={{ borderRadius: '24px', padding: '10px 24px' }}>
        Back to Home
      </Link>
    </div>
  );
}
