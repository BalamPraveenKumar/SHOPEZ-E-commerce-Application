import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { register, user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(user.userType === 'admin' ? '/admin' : '/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username.trim() || username.length < 3) {
      setError('Username must be at least 3 characters.'); return;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.'); return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    setLoading(true);
    try {
      await register(username, email, password);
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/'), 900);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Weak', color: '#ef4444', width: '33%' };
    if (password.length < 10) return { label: 'Good', color: '#f59e0b', width: '66%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };
  const strength = passwordStrength();

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      marginTop: '-80px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="auth-fullbleed" style={{ display: 'none' }} />
      {/* ── Right panel first on register (reversed layout for variety) ── */}
      <div style={{
        flex: '1 1 50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8faff',
        padding: '48px 32px',
        minHeight: '100vh',
        order: 1
      }}>
        <div style={{
          width: '100%', maxWidth: '460px',
          backgroundColor: '#fff',
          borderRadius: '24px',
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(30,64,175,0.10)',
          border: '1px solid #e8eef8'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '28px', fontWeight: '800',
              color: '#0f172a', margin: 0, marginBottom: '8px'
            }}>Create Account ✨</h2>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
              Join thousands of happy shoppers today
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px',
              backgroundColor: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontSize: '14px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>⚠️ {error}</div>
          )}
          {success && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px',
              backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#16a34a', fontSize: '14px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>✅ {success}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label htmlFor="reg-username" style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '17px' }}>👤</span>
                <input
                  id="reg-username" type="text" placeholder="Choose a username"
                  value={username} onChange={e => setUsername(e.target.value)} disabled={loading}
                  style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#f8faff', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label htmlFor="reg-email" style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '17px' }}>📧</span>
                <input
                  id="reg-email" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} disabled={loading}
                  style={{ width: '100%', padding: '13px 16px 13px 44px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#f8faff', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label htmlFor="reg-password" style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '17px' }}>🔒</span>
                <input
                  id="reg-password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password"
                  value={password} onChange={e => setPassword(e.target.value)} disabled={loading}
                  style={{ width: '100%', padding: '13px 48px 13px 44px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#f8faff', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#3b82f6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {/* Strength meter */}
              {strength && (
                <div>
                  <div style={{ height: '4px', borderRadius: '4px', backgroundColor: '#e2e8f0', overflow: 'hidden', marginTop: '6px' }}>
                    <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, borderRadius: '4px', transition: 'width 0.3s, background-color 0.3s' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: strength.color, fontWeight: '600', marginTop: '3px', display: 'block' }}>{strength.label} password</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label htmlFor="reg-confirm" style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '17px' }}>
                  {confirmPassword && (confirmPassword === password ? '✅' : '❌')}
                  {!confirmPassword && '🔁'}
                </span>
                <input
                  id="reg-confirm" type="password" placeholder="Re-enter your password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading}
                  style={{ width: '100%', padding: '13px 16px 13px 44px', border: `1.5px solid ${confirmPassword ? (confirmPassword === password ? '#22c55e' : '#ef4444') : '#e2e8f0'}`, borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#f8faff', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                padding: '14px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                color: '#fff', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(59,130,246,0.35)',
                letterSpacing: '0.3px'
              }}
            >
              {loading ? '⏳ Creating account…' : '🚀 Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>Already have an account?</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          <Link to="/login" style={{
            display: 'block', textAlign: 'center', marginTop: '16px', padding: '13px',
            border: '1.5px solid #3b82f6', borderRadius: '12px',
            color: '#1d4ed8', fontWeight: '600', fontSize: '14px', textDecoration: 'none'
          }}>
            ← Sign in instead
          </Link>
        </div>
      </div>

      {/* ── Left: Hero Panel ── */}
      <div style={{
        flex: '1 1 50%',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', order: 2
      }}>
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
          alt="Shopping"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(30,64,175,0.55) 0%, rgba(10,10,30,0.80) 100%)'
        }} />
        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center', color: '#fff', padding: '40px'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
            padding: '10px 22px', borderRadius: '40px',
            border: '1px solid rgba(255,255,255,0.25)',
            marginBottom: '32px'
          }}>
            <span style={{ fontSize: '22px' }}>🛍️</span>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '2px' }}>SHOPEZ</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: '800',
            lineHeight: '1.1', marginBottom: '18px',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)'
          }}>
            Start Your<br />
            <span style={{ color: '#93c5fd' }}>Shopping Journey</span>
          </h1>
          <p style={{
            fontSize: '16px', opacity: 0.85,
            maxWidth: '340px', lineHeight: '1.65', margin: '0 auto'
          }}>
            Sign up and get access to exclusive deals, trending styles, and fast delivery.
          </p>

          {/* Feature bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '40px', textAlign: 'left', display: 'inline-flex' }}>
            {[
              ['✅', 'Free delivery over ₹1500'],
              ['✅', 'Easy returns & refunds'],
              ['✅', 'Exclusive member discounts'],
            ].map(([icon, text]) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                borderRadius: '12px', padding: '12px 18px',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <span style={{ fontSize: '18px' }}>{icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
