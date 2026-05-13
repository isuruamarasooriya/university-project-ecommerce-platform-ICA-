import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Slider, Checkbox, FormControlLabel, Typography, Button, Chip,
  MenuItem, Select, FormControl, InputLabel, Skeleton, Drawer, IconButton
} from '@mui/material';
import { TuneRounded, GridView, ViewList, Close } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Books', 'Toys'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
      <Skeleton variant="rectangular" height={220} />
      <div style={{ padding: 16 }}>
        <Skeleton width="40%" height={14} sx={{ mb: 1 }} />
        <Skeleton height={20} sx={{ mb: 0.5 }} />
        <Skeleton width="70%" height={20} sx={{ mb: 1.5 }} />
        <Skeleton width="50%" height={16} />
      </div>
    </div>
  );
}

export default function ProductListingPage() {
  const [searchParams] = useSearchParams();
  const { token } = useAuthStore();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [maxPrice, setMaxPrice] = useState(2000);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('newest');
  const [gridView, setGridView] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (priceRange[1] < 2000) params.append('maxPrice', priceRange[1]);
      const res = await api.get(`/products?${params}`);
      let data = res.data;
      if (sort === 'price_asc') data = [...data].sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') data = [...data].sort((a, b) => b.price - a.price);
      else if (sort === 'rating') data = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      // search filter
      const q = searchParams.get('search');
      if (q) data = data.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.description?.toLowerCase().includes(q.toLowerCase()));
      setProducts(data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [selectedCategory, priceRange, sort, searchParams]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    if (token) {
      api.get('/user/wishlist').then(r => setWishlistIds(new Set(r.data.map(p => p.id)))).catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

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

  const FilterPanel = () => (
    <div>
      <Typography variant="h6" fontWeight={700} mb={3} color="#1E293B">Filters</Typography>

      {/* Category */}
      <div style={{ marginBottom: 28 }}>
        <Typography variant="subtitle2" fontWeight={700} color="#64748B" mb={1.5} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>
          Category
        </Typography>
        {CATEGORIES.map(cat => (
          <FormControlLabel key={cat}
            control={<Checkbox checked={selectedCategory === cat} onChange={() => setSelectedCategory(prev => prev === cat ? '' : cat)} size="small" sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#5B2EFF' } }} />}
            label={<span style={{ fontSize: 14, fontWeight: selectedCategory === cat ? 700 : 400, color: selectedCategory === cat ? '#5B2EFF' : '#475569' }}>{cat}</span>}
            sx={{ display: 'flex', m: 0, mb: 0.5, p: '2px 6px', borderRadius: 2, '&:hover': { background: '#F8FAFC' } }}
          />
        ))}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 28 }}>
        <Typography variant="subtitle2" fontWeight={700} color="#64748B" mb={1.5} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 11 }}>
          Price Range
        </Typography>
        <Slider value={priceRange} onChange={(_, v) => setPriceRange(v)} min={0} max={2000} step={10} valueLabelDisplay="auto" valueLabelFormat={v => `$${v}`}
          sx={{ color: '#5B2EFF', '& .MuiSlider-thumb': { width: 16, height: 16 } }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>${priceRange[0]}</span>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>${priceRange[1]}</span>
        </div>
      </div>

      <Button fullWidth variant="outlined" onClick={() => { setSelectedCategory(''); setPriceRange([0, 2000]); }}
        sx={{ borderRadius: '9999px', borderColor: '#E2E8F0', color: '#64748B', fontWeight: 600, '&:hover': { borderColor: '#5B2EFF', color: '#5B2EFF' } }}>
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 28 }}>

        {/* Sidebar - desktop */}
        <aside style={{ width: 260, flexShrink: 0, display: 'none' }} className="lg-sidebar">
          <div style={{ position: 'sticky', top: 88, background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #F1F5F9' }}>
            <FilterPanel />
          </div>
        </aside>

        <style>{`.lg-sidebar { display: none; } @media(min-width:900px){.lg-sidebar{display:block}}`}</style>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, border: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Button startIcon={<TuneRounded />} onClick={() => setDrawerOpen(true)} sx={{ display: { xs: 'flex', md: 'none' }, borderRadius: '9999px', color: '#5B2EFF', borderColor: '#5B2EFF' }} variant="outlined" size="small">
                Filters
              </Button>
              <Typography fontWeight={600} color="#1E293B">
                <span style={{ color: '#5B2EFF' }}>{products.length}</span> Products
              </Typography>
              {selectedCategory && <Chip label={selectedCategory} onDelete={() => setSelectedCategory('')} size="small" sx={{ background: '#EEE9FF', color: '#5B2EFF', fontWeight: 700 }} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select value={sort} onChange={e => setSort(e.target.value)} displayEmpty sx={{ borderRadius: '9999px', fontSize: 13, fontWeight: 600 }}>
                  {SORT_OPTIONS.map(o => <MenuItem key={o.value} value={o.value} sx={{ fontSize: 13 }}>{o.label}</MenuItem>)}
                </Select>
              </FormControl>
              <div style={{ display: 'flex', background: '#F8FAFC', borderRadius: 8, padding: 2 }}>
                <IconButton size="small" onClick={() => setGridView(true)} sx={{ color: gridView ? '#5B2EFF' : '#94A3B8', background: gridView ? '#EEE9FF' : 'transparent' }}><GridView fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => setGridView(false)} sx={{ color: !gridView ? '#5B2EFF' : '#94A3B8', background: !gridView ? '#EEE9FF' : 'transparent' }}><ViewList fontSize="small" /></IconButton>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: gridView ? 'repeat(auto-fill,minmax(220px,1fr))' : '1fr', gap: 20 }}>
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 20, padding: '80px 24px', textAlign: 'center', border: '1px dashed #CBD5E1' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>No products found</h3>
              <p style={{ color: '#64748B', marginBottom: 24 }}>Try adjusting your filters or search terms</p>
              <Button variant="contained" onClick={() => { setSelectedCategory(''); setPriceRange([0, 2000]); }} sx={{ borderRadius: '9999px' }}>Clear Filters</Button>
            </div>
          ) : (
            <motion.div layout style={{ display: 'grid', gridTemplateColumns: gridView ? 'repeat(auto-fill,minmax(220px,1fr))' : '1fr', gap: 20 }}>
              {products.map(p => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
                  <ProductCard product={p} wishlisted={wishlistIds.has(p.id)} onWishlistToggle={toggleWishlist} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 280, p: 3 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Typography fontWeight={800} fontSize={18}>Filters</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
        </div>
        <FilterPanel />
      </Drawer>

      <Footer />
    </div>
  );
}
