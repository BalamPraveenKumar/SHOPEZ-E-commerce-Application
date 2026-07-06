import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email || '');
    }
  }, [user]);

  const validateForm = () => {
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    if (password && password.length < 6) {
      setError('New password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = { username, email };
      if (password) {
        payload.password = password;
      }

      await updateProfile(payload);
      setSuccess('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading profile...</div>;

  return (
    <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
      {/* Profile Card Summary */}
      <div style={{
        flex: '1 1 250px',
        backgroundColor: 'var(--bg-card)',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        height: 'fit-content',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-glow)',
          color: 'var(--primary)',
          fontSize: '32px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--primary)'
        }}>
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{user.username}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{user.email || 'No email specified'}</p>
        </div>
        <span style={{
          backgroundColor: user.userType === 'admin' ? '#eff6ff' : '#f1f5f9',
          color: user.userType === 'admin' ? 'var(--primary)' : 'var(--text-muted)',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase'
        }}>
          {user.userType}
        </span>
        <div style={{ width: '100%', marginTop: '10px' }}>
          <Link to="/orders" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            View Orders History
          </Link>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div style={{ flex: '2 1 400px' }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '30px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Update Profile Details</h3>
          
          {error && <div className="alert-box alert-box-error">{error}</div>}
          {success && <div className="alert-box alert-box-success">{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }} htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                style={{
                  padding: '10px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                style={{
                  padding: '10px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }} htmlFor="password">
                Change Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{
                  padding: '10px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
              {loading ? 'Saving updates...' : 'Save Updates'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
