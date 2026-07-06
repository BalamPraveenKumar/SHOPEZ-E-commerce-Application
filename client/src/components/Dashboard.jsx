import React from 'react';

export default function Dashboard({ user, onLogout }) {
  // Extract initial for user icon
  const userInitial = user && user.username ? user.username.charAt(0).toUpperCase() : 'U';
  const username = user && user.username ? user.username : 'User';

  return (
    <div className="dashboard-card">
      <div className="dashboard-user-icon">
        {userInitial}
      </div>
      
      <div className="dashboard-badge">Verified Session</div>
      
      <h1 className="dashboard-title">Hello, {username}!</h1>
      <p className="dashboard-welcome">
        Welcome to your ShopEZ e-commerce admin dashboard. You are successfully authenticated via JWT and MongoDB.
      </p>

      <button className="btn-logout" onClick={onLogout}>
        Sign Out
      </button>
    </div>
  );
}
