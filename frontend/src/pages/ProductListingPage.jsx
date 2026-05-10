import React, { useState, useEffect } from 'react';
import { Typography, Slider, Checkbox, FormControlLabel, CircularProgress, Card, CardMedia, CardContent, Button, Chip, IconButton } from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import Navbar from '../components/Navbar';

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Toys'];

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { token, role } = useAuthStore();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (maxPrice < 1000) params.append('maxPrice', maxPrice);
      
      const response = await api.get(`${url}?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const response = await api.get('/user/wishlist');
      const ids = new Set(response.data.map(p => p.id));
      setWishlistIds(ids);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [maxPrice, selectedCategory]);

  const toggleWishlist = async (productId) => {
    if (!token) return alert('Please login first');
    try {
      if (wishlistIds.has(productId)) {
        await api.delete(`/user/wishlist/${productId}`);
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      } else {
        await api.post(`/user/wishlist/${productId}`);
        setWishlistIds(prev => new Set([...prev, productId]));
      }
    } catch (error) {
      console.error("Error toggling wishlist", error);
    }
  };

  const addToCart = async (productId) => {
    if (!token) return alert('Please login first');
    try {
      await api.post('/user/cart', { productId, quantity: 1 });
      alert('Added to cart!');
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <Typography variant="h6" className="font-bold mb-6 text-gray-800">Filters</Typography>
            
            <div className="mb-8">
              <Typography variant="subtitle2" className="mb-2 font-semibold text-gray-600">Max Price: ${maxPrice}</Typography>
              <Slider
                value={maxPrice}
                onChange={(e, val) => setMaxPrice(val)}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                color="primary"
                sx={{ '& .MuiSlider-thumb': { boxShadow: '0 0 10px rgba(79, 70, 229, 0.4)' } }}
              />
            </div>

            <div>
              <Typography variant="subtitle2" className="mb-3 font-semibold text-gray-600">Categories</Typography>
              <div className="flex flex-col space-y-2">
                {CATEGORIES.map(cat => (
                  <FormControlLabel
                    key={cat}
                    control={
                      <Checkbox 
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(prev => prev === cat ? '' : cat)}
                        color="primary"
                        size="small"
                        sx={{ padding: '4px 8px' }}
                      />
                    }
                    label={<Typography variant="body2" className={selectedCategory === cat ? 'font-bold text-indigo-600' : 'text-gray-600'}>{cat}</Typography>}
                    className="m-0 hover:bg-gray-50 rounded-lg transition-colors"
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="mb-8 flex justify-between items-center">
            <Typography variant="h4" className="font-black text-gray-900 tracking-tight">
              {selectedCategory ? `${selectedCategory}` : 'Discover'}
            </Typography>
            <Typography variant="body2" className="bg-white px-4 py-1 rounded-full shadow-sm text-gray-500 font-medium border border-gray-100">
              {products.length} results
            </Typography>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <CircularProgress size={40} thickness={4} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white overflow-hidden group flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <CardMedia
                      component="img"
                      image={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                      alt={product.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    
                    {role !== 'SELLER' && (
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <IconButton 
                          onClick={() => toggleWishlist(product.id)}
                          className={`bg-white/90 backdrop-blur-md shadow-md hover:bg-white transition-colors ${wishlistIds.has(product.id) ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
                          size="small"
                        >
                          {wishlistIds.has(product.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                        </IconButton>
                      </div>
                    )}

                    {product.category && (
                      <Chip 
                        label={product.category} 
                        size="small" 
                        className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md font-bold text-[10px] uppercase tracking-wider text-gray-700 shadow-sm"
                      />
                    )}
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <Typography variant="h6" className="font-bold text-gray-900 leading-snug line-clamp-2" title={product.title}>
                        {product.title}
                      </Typography>
                    </div>
                    
                    <Typography variant="body2" className="text-gray-500 line-clamp-2 mb-4 text-sm flex-1">
                      {product.description}
                    </Typography>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <Typography variant="h6" className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        ${product.price}
                      </Typography>
                      {role !== 'SELLER' && (
                        <Button 
                          variant="contained" 
                          onClick={() => addToCart(product.id)}
                          className="bg-gray-900 hover:bg-indigo-600 rounded-full min-w-0 w-10 h-10 p-0 shadow-lg transition-colors duration-300"
                          disableElevation
                        >
                          <ShoppingCart fontSize="small" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {products.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="text-gray-400" />
                  </div>
                  <Typography variant="h6" className="font-bold text-gray-800">No products found</Typography>
                  <Typography variant="body2" className="text-gray-500 mt-1">Try adjusting your filters to find what you're looking for.</Typography>
                  <Button variant="outlined" color="primary" className="mt-6 rounded-full px-6" onClick={() => {setMaxPrice(1000); setSelectedCategory('');}}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListingPage;
