import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField, Button, CircularProgress, IconButton, InputAdornment, Alert } from '@mui/material';
import { Visibility, VisibilityOff, LocalMall, ArrowBack } from '@mui/icons-material';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const FEATURES = ['🛍️ Shop from 1000+ products', '🚀 Fast & free delivery', '🔒 Secure payments', '⭐ Trusted by 50K+ buyers'];

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '', role: 'CUSTOMER' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(url, form);
      if (isLogin) {
        login(res.data.token, res.data.role, res.data.email);
        const role = res.data.role;
        if (role === 'ADMIN') navigate('/admin');
        else if (role === 'SELLER') navigate('/seller-dashboard');
        else navigate('/');
      } else {
        setIsLogin(true);
        setError(''); // Switch to login after register
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#0F172A 0%,#1E1B4B 50%,#312E81 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        {[{ w: 400, h: 400, t: -100, r: -100, o: 0.08 }, { w: 300, h: 300, b: -80, l: -60, o: 0.06 }].map((c, i) => (
          <div key={i} style={{ position: 'absolute', width: c.w, height: c.h, top: c.t, right: c.r, bottom: c.b, left: c.l, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', borderRadius: '50%', opacity: c.o }} />
        ))}

        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 48, fontSize: 14, fontWeight: 600 }}>
          <ArrowBack fontSize="small" /> Back to Home
        </button>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalMall style={{ color: '#fff', fontSize: 24 }} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>MultiVendor</span>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
            Your Premier<br />
            <span style={{ background: 'linear-gradient(135deg,#00C6FF,#7C4DFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Marketplace
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            Join millions of shoppers and sellers on the most trusted multi-vendor platform.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
                <div style={{ width: 32, height: 32, background: 'rgba(91,46,255,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{f[0]}</div>
                {f.slice(2)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: '45%', minWidth: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: '#fff' }}>
        <AnimatePresence mode="wait">
          <motion.div key={isLogin ? 'login' : 'register'} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
            style={{ width: '100%', maxWidth: 400 }}>
            <h2 style={{ fontWeight: 800, fontSize: 28, color: '#1E293B', marginBottom: 8 }}>
              {isLogin ? 'Welcome back!' : 'Create account'}
            </h2>
            <p style={{ color: '#64748B', marginBottom: 32 }}>
              {isLogin ? "Sign in to access your account" : "Get started with MultiVendor today"}
            </p>

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <TextField fullWidth label="Email address" type="email" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" />
              <TextField fullWidth label="Password" type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required
                InputProps={{ endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPass(s => !s)}>{showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment> }} />

              {!isLogin && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 8 }}>I want to join as</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['CUSTOMER', 'SELLER'].map(r => (
                      <button key={r} type="button" onClick={() => set('role', r)}
                        style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: `2px solid ${form.role === r ? '#5B2EFF' : '#E2E8F0'}`, background: form.role === r ? '#EEE9FF' : '#fff', color: form.role === r ? '#5B2EFF' : '#64748B', fontWeight: 700, cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}>
                        {r === 'CUSTOMER' ? '🛍️ Customer' : '🏪 Seller'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                style={{ width: '100%', padding: '14px', background: loading ? '#E2E8F0' : 'linear-gradient(135deg,#5B2EFF,#00C6FF)', color: '#fff', border: 'none', borderRadius: 9999, fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(91,46,255,0.35)', marginTop: 8 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : (isLogin ? 'Sign In' : 'Create Account')}
              </motion.button>
            </form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <span style={{ color: '#64748B', fontSize: 14 }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button onClick={() => { setIsLogin(s => !s); setError(''); }} style={{ background: 'none', border: 'none', color: '#5B2EFF', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>

            {isLogin && (
              <div style={{ marginTop: 24, padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #F1F5F9' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Credentials</p>
                <p style={{ fontSize: 13, color: '#475569' }}>Admin: <code style={{ background: '#EEE9FF', padding: '1px 6px', borderRadius: 4 }}>admin@multivendor.com</code> / <code style={{ background: '#EEE9FF', padding: '1px 6px', borderRadius: 4 }}>Admin@123</code></p>
                <p style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>Seller: <code style={{ background: '#EEE9FF', padding: '1px 6px', borderRadius: 4 }}>seller@multivendor.com</code> / <code style={{ background: '#EEE9FF', padding: '1px 6px', borderRadius: 4 }}>Seller@123</code></p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
