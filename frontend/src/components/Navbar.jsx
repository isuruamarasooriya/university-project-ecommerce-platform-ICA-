import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Badge, IconButton, Avatar, Menu, MenuItem, Divider, Tooltip, InputBase
} from '@mui/material';
import {
  ShoppingCart, Favorite, Search, Person, Store, AdminPanelSettings,
  Logout, AccountCircle, Dashboard, Menu as MenuIcon, Close, LocalMall
} from '@mui/icons-material';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axios';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Electronics', path: '/products?category=Electronics' },
  { label: 'Fashion', path: '/products?category=Fashion' },
  { label: 'Home & Living', path: '/products?category=Home' },
];

export default function Navbar() {
  const { token, role, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (token) {
      api.get('/user/cart').then(r => setCartCount(r.data?.length || 0)).catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [token, location]);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/auth');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ boxShadow: scrolled ? '0 4px 30px rgba(91,46,255,0.1)' : '0 1px 0 rgba(0,0,0,0.06)' }}
        style={{
          position: 'sticky', top: 0, zIndex: 1100,
          background: scrolled ? 'rgba(255,255,255,0.95)' : '#fff',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        {/* Top bar */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 70, display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalMall style={{ color: '#fff', fontSize: 20 }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 20, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MultiVendor
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480, display: 'flex', alignItems: 'center', background: '#F1F5F9', borderRadius: 9999, padding: '6px 16px', gap: 8 }}>
            <Search style={{ color: '#94A3B8', fontSize: 20 }} />
            <InputBase
              placeholder="Search products, brands, categories…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, fontSize: 14, color: '#1E293B' }}
            />
          </form>

          {/* Nav actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
            {token ? (
              <>
                <Tooltip title="Wishlist">
                  <IconButton component={Link} to="/wishlist" size="small" sx={{ color: '#64748B' }}>
                    <Favorite />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cart">
                  <IconButton component={Link} to="/cart" size="small" sx={{ color: '#64748B' }}>
                    <Badge badgeContent={cartCount} color="primary" max={9}>
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Account">
                  <IconButton size="small" onClick={e => setAnchorEl(e.currentTarget)}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', fontSize: 14 }}>
                      {role?.[0]}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                  PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.06)' } }}>
                  <div style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>My Account</div>
                    <div style={{ fontSize: 12, color: '#64748B', textTransform: 'capitalize' }}>{role?.toLowerCase()}</div>
                  </div>
                  <Divider />
                  <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }} sx={{ gap: 1.5, fontSize: 14 }}>
                    <AccountCircle fontSize="small" /> Profile
                  </MenuItem>
                  {(role === 'SELLER' || role === 'ADMIN') && (
                    <MenuItem onClick={() => { navigate('/seller-dashboard'); setAnchorEl(null); }} sx={{ gap: 1.5, fontSize: 14 }}>
                      <Store fontSize="small" /> Seller Dashboard
                    </MenuItem>
                  )}
                  {role === 'ADMIN' && (
                    <MenuItem onClick={() => { navigate('/admin'); setAnchorEl(null); }} sx={{ gap: 1.5, fontSize: 14 }}>
                      <AdminPanelSettings fontSize="small" /> Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ gap: 1.5, fontSize: 14, color: '#EF4444' }}>
                    <Logout fontSize="small" /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/auth')}
                style={{ background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', color: '#fff', border: 'none', borderRadius: 9999, padding: '8px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(91,46,255,0.3)' }}
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>

        {/* Category bar */}
        <div style={{ borderTop: '1px solid #F1F5F9', maxWidth: 1400, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {NAV_LINKS.map(link => (
            <Link key={link.path} to={link.path}
              style={{
                textDecoration: 'none', padding: '10px 14px', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
                color: location.pathname === link.path ? '#5B2EFF' : '#64748B',
                borderBottom: location.pathname === link.path ? '2px solid #5B2EFF' : '2px solid transparent',
                transition: 'all 0.2s',
              }}>
              {link.label}
            </Link>
          ))}
        </div>
      </motion.nav>
    </>
  );
}
