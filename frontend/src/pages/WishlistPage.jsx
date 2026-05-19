import React, { useState, useEffect } from 'react';
import { Typography, Button, CircularProgress } from '@mui/material';
import { Delete, ShoppingCart, Favorite, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/user/wishlist');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/user/wishlist/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist", error);
      toast.error("Failed to remove item");
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post('/user/cart', { productId, quantity: 1 });
      toast.success("Added to cart! 🛒");
    } catch (error) {
      console.error("Error adding to cart", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />
      
      {/* Premium Gradient Header Section */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)', color: '#fff', padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, top: -100, right: -100, background: 'linear-gradient(135deg, #5B2EFF, #00C6FF)', borderRadius: '50%', opacity: 0.15, filter: 'blur(50px)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <button onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
            <ArrowBack fontSize="small" /> Back to Products
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Favorite style={{ color: '#FF4B72', fontSize: 26 }} />
            </div>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>My Wishlist</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 4, margin: 0 }}>
                {products.length} saved {products.length === 1 ? 'item' : 'items'} that you love
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress sx={{ color: '#5B2EFF' }} />
          </div>
        ) : products.length === 0 ? (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: '#fff', padding: '60px 40px', borderRadius: 24, textAlign: 'center', border: '1px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
              className="max-w-md mx-auto">
              <div style={{ width: 80, height: 80, background: '#FFF0F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Favorite style={{ color: '#FF4B72', fontSize: 36 }} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 22, color: '#1E293B', marginBottom: 8 }}>Your wishlist is empty</h3>
              <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                Explore our catalog and click the heart icon on your favorite items to save them here!
              </p>
              <Button onClick={() => navigate('/products')} variant="contained" 
                sx={{ borderRadius: '9999px', background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', color: '#fff', fontWeight: 700, px: 4, py: 1.5, boxShadow: '0 6px 20px rgba(91,46,255,0.25)', textTransform: 'none', fontSize: 15 }}>
                Start Exploring
              </Button>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((product) => (
                <motion.div 
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  transition={{ duration: 0.25 }}
                  style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
                >
                  {/* Category Pill Tag */}
                  {product.category && (
                    <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', color: '#1E293B', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, zIndex: 10, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      {product.category}
                    </span>
                  )}
                  
                  {/* Image Container */}
                  <div style={{ height: 210, overflow: 'hidden', position: 'relative', background: '#F8FAFC' }}>
                    <img
                      src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      className="hover:scale-105"
                    />
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
                      {product.brand || 'Generic'}
                    </p>
                    <h3 style={{ fontWeight: 800, fontSize: 16, color: '#1E293B', margin: '0 0 12px', lineHeight: 1.4, height: 44, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {product.title}
                    </h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#5B2EFF' }}>
                        ${product.price}
                      </span>
                      {product.discount > 0 && (
                        <span style={{ fontSize: 12, color: '#EC4899', fontWeight: 700, background: '#FCE7F3', borderRadius: 6, padding: '2px 6px' }}>
                          -{product.discount}% OFF
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons Row */}
                    <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', background: 'linear-gradient(135deg,#0F172A,#1E293B)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,23,42,0.15)', transition: 'all 0.2s' }}
                        className="hover:opacity-90"
                        onClick={() => addToCart(product.id)}
                      >
                        <ShoppingCart fontSize="small" /> Add to Cart
                      </motion.button>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF0F2', border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                        className="hover:bg-[#FFE0E4]"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Delete style={{ color: '#FF4B72', fontSize: 18 }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
