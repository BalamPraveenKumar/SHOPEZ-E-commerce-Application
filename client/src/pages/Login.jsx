import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // customer or admin
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.userType === 'admin' ? '/admin' : '/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username.trim() || username.length < 3) {
      setError('Please enter a valid username (min 3 characters).');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const userData = await login(username, password, role);
      setSuccess('Login successful! Redirecting…');
      setTimeout(() => navigate(userData.userType === 'admin' ? '/admin' : '/'), 900);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      marginTop: '-80px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="auth-fullbleed" style={{ display: 'none' }} />
      {/* ── Left: Hero Panel ── */}
      <div style={{
        flex: '1 1 50%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
          alt="Fashion"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover'
          }}
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,10,30,0.75) 0%, rgba(30,64,175,0.55) 100%)'
        }} />
        {/* Branding text */}
        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', color: '#fff', padding: '40px'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            backgroundColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            padding: '10px 22px', borderRadius: '40px',
            border: '1px solid rgba(255,255,255,0.25)',
            marginBottom: '32px'
          }}>
            <span style={{ fontSize: '22px' }}>🛍️</span>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '2px' }}>SHOPEZ</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: '800',
            lineHeight: '1.1', marginBottom: '18px',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)'
          }}>
            Fashion Meets<br />
            <span style={{ color: '#93c5fd' }}>Excellence</span>
          </h1>
          <p style={{
            fontSize: '16px', opacity: 0.85,
            maxWidth: '340px', lineHeight: '1.65',
            margin: '0 auto'
          }}>
            Discover curated styles, premium brands and exclusive deals — all in one place.
          </p>

          {/* Stats row */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '40px',
            marginTop: '48px'
          }}>
            {[['200+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: '800' }}>{val}</div>
                <div style={{ fontSize: '12px', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div style={{
        flex: '1 1 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8faff',
        padding: '48px 32px',
        minHeight: '100vh'
      }}>
        <div style={{
          width: '100%', maxWidth: '440px',
          backgroundColor: '#fff',
          borderRadius: '24px',
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(30,64,175,0.10)',
          border: '1px solid #e8eef8'
        }}>
          {/* Form header */}
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontSize: '28px', fontWeight: '800',
              color: '#0f172a', margin: 0, marginBottom: '8px'
            }}>Welcome back 👋</h2>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
              Sign in to continue shopping
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px',
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontSize: '14px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px',
              backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#16a34a', fontSize: '14px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>✅</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Role selection tab buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Login As</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid ${role === 'customer' ? '#3b82f6' : '#e2e8f0'}`,
                    backgroundColor: role === 'customer' ? '#eff6ff' : '#fff',
                    color: role === 'customer' ? '#1d4ed8' : '#64748b',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>👤</span> Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: `2px solid ${role === 'admin' ? '#3b82f6' : '#e2e8f0'}`,
                    backgroundColor: role === 'admin' ? '#eff6ff' : '#fff',
                    color: role === 'admin' ? '#1d4ed8' : '#64748b',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>🔑</span> Admin
                </button>
              </div>
            </div>

            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label htmlFor="login-username" style={{
                fontSize: '13px', fontWeight: '600',
                color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '17px', lineHeight: 1
                }}>👤</span>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px 16px 13px 44px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px', fontSize: '14px',
                    fontFamily: 'inherit', outline: 'none',
                    backgroundColor: '#f8faff',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label htmlFor="login-password" style={{
                fontSize: '13px', fontWeight: '600',
                color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '17px', lineHeight: 1
                }}>🔒</span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px 48px 13px 44px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px', fontSize: '14px',
                    fontFamily: 'inherit', outline: 'none',
                    backgroundColor: '#f8faff',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '16px', lineHeight: 1
                  }}
                >{showPassword ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(59,130,246,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
            >
              {loading ? '⏳ Signing in…' : '🔑 Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '28px 0 0'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>New to SHOPEZ?</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          <Link to="/register" style={{
            display: 'block', textAlign: 'center',
            marginTop: '16px', padding: '13px',
            border: '1.5px solid #3b82f6', borderRadius: '12px',
            color: '#1d4ed8', fontWeight: '600', fontSize: '14px',
            textDecoration: 'none',
            transition: 'background 0.2s'
          }}
            onMouseEnter={e => e.target.style.backgroundColor = '#eff6ff'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            Create a free account →
          </Link>
        </div>
      </div>
    </div>
  );
}
