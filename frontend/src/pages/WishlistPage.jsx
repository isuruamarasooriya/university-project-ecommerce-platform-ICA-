import React, { useState, useEffect } from 'react';
import { Typography, Card, CardMedia, CardContent, Button, IconButton, CircularProgress } from '@mui/material';
import { Delete, ShoppingCart } from '@mui/icons-material';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const WishlistPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/user/wishlist');
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
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
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post('/user/cart', { productId, quantity: 1 });
      alert('Added to cart!');
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Typography variant="h4" className="font-black text-gray-900 mb-8">My Wishlist</Typography>

        {loading ? (
          <div className="flex justify-center p-12"><CircularProgress /></div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
            <FavoriteBorder className="text-gray-300 w-16 h-16 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-600">Your wishlist is empty.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Card key={product.id} className="rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-white">
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"}
                  alt={product.title}
                  className="h-48 object-cover"
                />
                <CardContent className="p-5 flex-1 flex flex-col">
                  <Typography variant="h6" className="font-bold text-gray-900 line-clamp-1 mb-1">{product.title}</Typography>
                  <Typography variant="h6" className="font-bold text-indigo-600 mb-4">${product.price}</Typography>
                  
                  <div className="mt-auto flex gap-2">
                    <Button 
                      variant="contained" 
                      fullWidth 
                      startIcon={<ShoppingCart />}
                      className="bg-gray-900 hover:bg-indigo-600 rounded-xl flex-1 shadow-none py-2"
                      onClick={() => addToCart(product.id)}
                    >
                      Cart
                    </Button>
                    <IconButton 
                      color="error" 
                      className="bg-red-50 hover:bg-red-100 rounded-xl px-3"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import { FavoriteBorder } from '@mui/icons-material';

export default WishlistPage;
