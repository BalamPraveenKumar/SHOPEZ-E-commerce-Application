import React from 'react';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px'
    }}>
      <div className="spinner" style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(139, 92, 246, 0.2)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }}></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Loading content...</p>
    </div>
  );
}
