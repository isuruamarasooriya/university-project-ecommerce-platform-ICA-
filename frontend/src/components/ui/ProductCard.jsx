import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Chip, Tooltip } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Star, StarHalf } from '@mui/icons-material';
import useAuthStore from '../../store/useAuthStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push(<Star key={i} style={{ fontSize: 13, color: '#F59E0B' }} />);
    else if (i - 0.5 <= rating) stars.push(<StarHalf key={i} style={{ fontSize: 13, color: '#F59E0B' }} />);
    else stars.push(<Star key={i} style={{ fontSize: 13, color: '#E2E8F0' }} />);
  }
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>{stars}</span>;
}

export default function ProductCard({ product, wishlisted = false, onWishlistToggle }) {
  const { token, role } = useAuthStore();
  const navigate = useNavigate();

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) { navigate('/auth'); return; }
    try {
      await api.post('/user/cart', { productId: product.id, quantity: 1 });
      toast.success('Added to cart! 🛒');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) { navigate('/auth'); return; }
    if (onWishlistToggle) onWishlistToggle(product.id, wishlisted);
  };

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(91,46,255,0.18)' }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/products/${product.id}`)}
      style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 220, background: '#F8FAFC', overflow: 'hidden' }}>
        <img
          src={product.imageUrl || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80`}
          alt={product.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          loading="lazy"
        />
        {product.discount > 0 && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: '#EF4444', color: '#fff', borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
            -{product.discount}%
          </div>
        )}
        {product.stock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Out of Stock</span>
          </div>
        )}
        {role !== 'SELLER' && (
          <Tooltip title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
            <IconButton
              onClick={handleWishlist}
              size="small"
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
            >
              {wishlisted
                ? <Favorite style={{ fontSize: 18, color: '#EF4444' }} />
                : <FavoriteBorder style={{ fontSize: 18, color: '#94A3B8' }} />}
            </IconButton>
          </Tooltip>
        )}
        {product.category && (
          <Chip label={product.category} size="small" style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: 700, backdropFilter: 'blur(8px)' }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {product.brand && <p style={{ fontSize: 11, fontWeight: 600, color: '#5B2EFF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{product.brand}</p>}
        <h3 style={{ fontWeight: 700, fontSize: 15, color: '#1E293B', lineHeight: 1.4, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.title}</h3>

        {product.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <StarRating rating={product.rating} />
            <span style={{ fontSize: 12, color: '#94A3B8' }}>({product.reviewCount?.toLocaleString() || 0})</span>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span style={{ fontSize: 12, color: '#94A3B8', textDecoration: 'line-through', marginLeft: 6 }}>${product.price.toFixed(2)}</span>
            )}
          </div>
          {role !== 'SELLER' && product.stock !== 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', border: 'none', borderRadius: 9999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(91,46,255,0.3)' }}
            >
              <ShoppingCart style={{ fontSize: 18, color: '#fff' }} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
