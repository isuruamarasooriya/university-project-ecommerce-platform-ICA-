import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Chip, CircularProgress, Divider } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Star, LocalShipping, Verified, ArrowBack } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

function StarRow({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} style={{ fontSize: 22, color: i <= Math.round(rating) ? '#F59E0B' : '#E2E8F0' }} />
      ))}
      <span style={{ fontSize: 20, fontWeight: 800, color: '#1E293B', marginLeft: 4 }}>{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        const all = await api.get(`/products?category=${res.data.category}`);
        setRelated(all.data.filter(p => p.id !== id).slice(0, 4));
        if (token) {
          const wl = await api.get('/user/wishlist');
          setWishlisted(wl.data.some(p => p.id === id));
        }
      } catch { toast.error('Product not found'); navigate('/products'); }
      finally { setLoading(false); }
    };
    load();
    window.scrollTo(0, 0);
  }, [id, token]);

  const handleCart = async () => {
    if (!token) { navigate('/auth'); return; }
    try {
      await api.post('/user/cart', { productId: product.id, quantity: qty });
      toast.success(`Added ${qty} item${qty > 1 ? 's' : ''} to cart 🛒`);
    } catch { toast.error('Failed to add to cart'); }
  };

  const handleWishlist = async () => {
    if (!token) { navigate('/auth'); return; }
    try {
      if (wishlisted) {
        await api.delete(`/user/wishlist/${product.id}`);
        setWishlisted(false); toast.success('Removed from wishlist');
      } else {
        await api.post(`/user/wishlist/${product.id}`);
        setWishlisted(true); toast.success('Added to wishlist ❤️');
      }
    } catch { toast.error('Error updating wishlist'); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
        <CircularProgress sx={{ color: '#5B2EFF' }} />
      </div>
    </div>
  );

  if (!product) return null;
  const discPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  const images = product.images?.length > 0 ? product.images : [product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, color: '#94A3B8', fontSize: 14 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontWeight: 600, padding: 0 }}>
            <ArrowBack fontSize="small" /> Back
          </button>
          <span>/</span>
          <span style={{ color: '#5B2EFF', cursor: 'pointer' }} onClick={() => navigate(`/products?category=${product.category}`)}>{product.category}</span>
          <span>/</span>
          <span className="line-clamp-1" style={{ color: '#1E293B', maxWidth: 200 }}>{product.title}</span>
        </div>

        {/* Main area */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9', marginBottom: 40 }}>
          {/* Image gallery */}
          <div>
            <motion.div layoutId={`product-img-${product.id}`}
              style={{ borderRadius: 20, overflow: 'hidden', height: 420, background: '#F8FAFC', marginBottom: 16 }}>
              <img src={images[imgIdx]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', border: `2px solid ${i === imgIdx ? '#5B2EFF' : 'transparent'}`, cursor: 'pointer', padding: 0, background: 'none' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.brand && <p style={{ fontSize: 12, fontWeight: 700, color: '#5B2EFF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{product.brand}</p>}
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem,2.5vw,2rem)', color: '#1E293B', lineHeight: 1.3, marginBottom: 16 }}>{product.title}</h1>

            {product.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <StarRow rating={product.rating} />
                <span style={{ color: '#64748B', fontSize: 14 }}>({product.reviewCount?.toLocaleString()} reviews)</span>
                <Chip icon={<Verified style={{ fontSize: 14 }} />} label="Verified" size="small" sx={{ background: '#ECFDF5', color: '#10B981', fontWeight: 700, fontSize: 11 }} />
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ${discPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span style={{ fontSize: 18, color: '#94A3B8', textDecoration: 'line-through', marginLeft: 12 }}>${product.price.toFixed(2)}</span>
                  <Chip label={`${product.discount}% OFF`} size="small" sx={{ ml: 1, background: '#FEF2F2', color: '#EF4444', fontWeight: 800, fontSize: 11 }} />
                </>
              )}
            </div>

            <p style={{ color: '#64748B', lineHeight: 1.8, fontSize: 15, marginBottom: 24 }}>{product.description}</p>

            {product.stock !== undefined && (
              <div style={{ marginBottom: 20 }}>
                <Chip
                  label={product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  sx={{ background: product.stock > 0 ? '#ECFDF5' : '#FEF2F2', color: product.stock > 0 ? '#10B981' : '#EF4444', fontWeight: 700 }}
                />
              </div>
            )}

            {role !== 'SELLER' && product.stock > 0 && (
              <>
                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <span style={{ fontWeight: 600, color: '#64748B' }}>Quantity:</span>
                  <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', borderRadius: 9999, border: '1px solid #E2E8F0' }}>
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 18, color: '#5B2EFF' }}>-</button>
                    <span style={{ width: 40, textAlign: 'center', fontWeight: 700 }}>{qty}</span>
                    <button onClick={() => setQty(q => Math.min(product.stock || 10, q + 1))} style={{ width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 18, color: '#5B2EFF' }}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCart}
                    style={{ flex: 1, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', color: '#fff', border: 'none', borderRadius: 9999, padding: '14px 24px', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(91,46,255,0.35)' }}>
                    <ShoppingCart fontSize="small" /> Add to Cart
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.97 }} onClick={handleWishlist}
                    style={{ width: 52, height: 52, background: wishlisted ? '#FEF2F2' : '#F8FAFC', border: `1px solid ${wishlisted ? '#FECACA' : '#E2E8F0'}`, borderRadius: 9999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishlisted ? <Favorite style={{ color: '#EF4444' }} /> : <FavoriteBorder style={{ color: '#94A3B8' }} />}
                  </motion.button>
                </div>
              </>
            )}

            <Divider sx={{ my: 2 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10B981' }}>
              <LocalShipping fontSize="small" />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Free shipping on orders over $50</span>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 style={{ fontWeight: 800, fontSize: 24, color: '#1E293B', marginBottom: 20 }}>You Might Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
