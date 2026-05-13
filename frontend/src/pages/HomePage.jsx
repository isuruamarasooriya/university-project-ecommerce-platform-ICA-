import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, CircularProgress } from '@mui/material';
import {
  ChevronRight, ChevronLeft, Bolt, TrendingUp, Star,
  LocalShipping, Security, SupportAgent, Replay
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

// ── Hero Slides ─────────────────────────────────────────────────────────────
const SLIDES = [
  { title: 'New Arrivals 2025', subtitle: 'Discover the latest in tech, fashion & more', cta: 'Shop Now', ctaLink: '/products', bg: 'linear-gradient(135deg,#0F172A 0%,#1E1B4B 50%,#312E81 100%)', accent: '#00C6FF', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&q=80' },
  { title: 'Summer Fashion Sale', subtitle: 'Up to 50% off on top brands — limited time', cta: 'View Deals', ctaLink: '/products?category=Fashion', bg: 'linear-gradient(135deg,#1A0533 0%,#2D1B69 50%,#1E3A5F 100%)', accent: '#F59E0B', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80' },
  { title: 'Home & Living', subtitle: 'Make your space extraordinary with premium picks', cta: 'Explore', ctaLink: '/products?category=Home', bg: 'linear-gradient(135deg,#0C4A6E 0%,#0F2F4A 50%,#1A1A2E 100%)', accent: '#10B981', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80' },
];

// ── Categories ───────────────────────────────────────────────────────────────
const CATS = [
  { name: 'Electronics', emoji: '📱', color: '#5B2EFF', bg: '#EEE9FF', path: '/products?category=Electronics' },
  { name: 'Fashion', emoji: '👗', color: '#EC4899', bg: '#FDF2F8', path: '/products?category=Fashion' },
  { name: 'Home & Living', emoji: '🏡', color: '#10B981', bg: '#ECFDF5', path: '/products?category=Home' },
  { name: 'Books', emoji: '📚', color: '#F59E0B', bg: '#FFFBEB', path: '/products?category=Books' },
  { name: 'Toys', emoji: '🎮', color: '#EF4444', bg: '#FEF2F2', path: '/products?category=Toys' },
  { name: 'All Products', emoji: '🛍️', color: '#00C6FF', bg: '#F0FBFF', path: '/products' },
];

// ── Feature Badges ───────────────────────────────────────────────────────────
const FEATURES = [
  { icon: LocalShipping, title: 'Free Shipping', sub: 'On orders over $50', color: '#5B2EFF' },
  { icon: Security, title: 'Secure Payment', sub: '100% secure checkout', color: '#10B981' },
  { icon: Replay, title: 'Easy Returns', sub: '30-day return policy', color: '#F59E0B' },
  { icon: SupportAgent, title: '24/7 Support', sub: 'Round-the-clock help', color: '#EC4899' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Auto-rotate hero
  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.slice(0, 8));
        setTrending(res.data.slice(8, 16));
        if (token) {
          const wl = await api.get('/user/wishlist');
          setWishlistIds(new Set(wl.data.map(p => p.id)));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [token]);

  const toggleWishlist = async (productId, isWishlisted) => {
    if (!token) { navigate('/auth'); return; }
    try {
      if (isWishlisted) {
        await api.delete(`/user/wishlist/${productId}`);
        setWishlistIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
        toast.success('Removed from wishlist');
      } else {
        await api.post(`/user/wishlist/${productId}`);
        setWishlistIds(prev => new Set([...prev, productId]));
        toast.success('Added to wishlist ❤️');
      }
    } catch { toast.error('Error updating wishlist'); }
  };

  const s = SLIDES[slide];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar />

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }}
            style={{ position: 'absolute', inset: 0, background: s.bg, display: 'flex', alignItems: 'center', padding: '0 60px' }}>
            {/* Text */}
            <div style={{ flex: 1, zIndex: 1 }}>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <span style={{ background: `${s.accent}22`, color: s.accent, borderRadius: 9999, padding: '6px 16px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  🔥 Limited Time Offer
                </span>
              </motion.div>
              <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 900, color: '#fff', marginTop: 20, lineHeight: 1.15, maxWidth: 560 }}>
                {s.title}
              </motion.h1>
              <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginTop: 12, marginBottom: 32, maxWidth: 440 }}>
                {s.subtitle}
              </motion.p>
              <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: 'flex', gap: 12 }}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(s.ctaLink)}
                  style={{ background: `linear-gradient(135deg,${s.accent},#5B2EFF)`, color: '#fff', border: 'none', borderRadius: 9999, padding: '14px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: `0 8px 24px ${s.accent}44` }}>
                  {s.cta} →
                </motion.button>
              </motion.div>
            </div>
            {/* Image */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
              style={{ width: 380, height: 380, borderRadius: 32, overflow: 'hidden', flexShrink: 0, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
              <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 28 : 8, height: 8, borderRadius: 9999, background: i === slide ? '#fff' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
        <button onClick={() => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 9999, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', backdropFilter: 'blur(8px)', zIndex: 10 }}>
          <ChevronLeft />
        </button>
        <button onClick={() => setSlide(s => (s + 1) % SLIDES.length)}
          style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 9999, width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', backdropFilter: 'blur(8px)', zIndex: 10 }}>
          <ChevronRight />
        </button>
      </section>

      {/* ── Feature Badges ───────────────────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {FEATURES.map(({ icon: Icon, title, sub, color }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, background: `${color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ color, fontSize: 22 }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{title}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Categories ───────────────────────────────────────────────── */}
        <section style={{ padding: '56px 0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 28, color: '#1E293B', marginBottom: 4 }}>Shop by Category</h2>
              <p style={{ color: '#64748B', fontSize: 15 }}>Find what you're looking for</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16 }}>
            {CATS.map(cat => (
              <motion.div key={cat.name} whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }} onClick={() => navigate(cat.path)}
                style={{ background: cat.bg, borderRadius: 16, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', border: `1px solid ${cat.color}20`, transition: 'box-shadow 0.25s' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{cat.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: cat.color }}>{cat.name}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Featured Products ─────────────────────────────────────────── */}
        <section style={{ padding: '32px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Star style={{ color: '#F59E0B', fontSize: 20 }} />
                <span style={{ fontWeight: 600, fontSize: 13, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Featured</span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: 28, color: '#1E293B' }}>Best Sellers</h2>
            </div>
            <Button variant="outlined" onClick={() => navigate('/products')} endIcon={<ChevronRight />}
              sx={{ borderRadius: '9999px', borderColor: '#5B2EFF', color: '#5B2EFF', fontWeight: 600, '&:hover': { background: '#5B2EFF', color: '#fff' } }}>
              View All
            </Button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <CircularProgress sx={{ color: '#5B2EFF' }} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 20 }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} wishlisted={wishlistIds.has(p.id)} onWishlistToggle={toggleWishlist} />
              ))}
            </div>
          )}
        </section>

        {/* ── Promo Banner ─────────────────────────────────────────────── */}
        <section style={{ margin: '24px 0' }}>
          <motion.div whileHover={{ scale: 1.01 }} onClick={() => navigate('/products')}
            style={{ background: 'linear-gradient(135deg,#5B2EFF 0%,#00C6FF 100%)', borderRadius: 24, padding: '48px 40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, boxShadow: '0 16px 48px rgba(91,46,255,0.3)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Bolt style={{ color: '#FFD700', fontSize: 20 }} />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Flash Sale</span>
              </div>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 'clamp(1.5rem,3vw,2.5rem)', marginBottom: 8 }}>Up to 60% Off 🎉</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>Exclusive deals on top products — today only!</p>
            </div>
            <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
              style={{ background: '#fff', color: '#5B2EFF', border: 'none', borderRadius: 9999, padding: '14px 36px', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
              Grab the Deal →
            </motion.button>
          </motion.div>
        </section>

        {/* ── Trending ─────────────────────────────────────────────────── */}
        <section style={{ padding: '32px 0 64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <TrendingUp style={{ color: '#EF4444', fontSize: 20 }} />
                <span style={{ fontWeight: 600, fontSize: 13, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trending Now</span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: 28, color: '#1E293B' }}>What's Hot</h2>
            </div>
            <Button variant="outlined" onClick={() => navigate('/products')} endIcon={<ChevronRight />}
              sx={{ borderRadius: '9999px', borderColor: '#EF4444', color: '#EF4444', fontWeight: 600, '&:hover': { background: '#EF4444', color: '#fff' } }}>
              See More
            </Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 20 }}>
            {trending.map(p => (
              <ProductCard key={p.id} product={p} wishlisted={wishlistIds.has(p.id)} onWishlistToggle={toggleWishlist} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
