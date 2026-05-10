import React, { useState, useEffect } from 'react';
import { Typography, Button, IconButton, CircularProgress, Divider } from '@mui/material';
import { Delete, Add, Remove, ShoppingCartCheckout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCartAndProducts = async () => {
    try {
      const cartRes = await api.get('/user/cart');
      const items = cartRes.data;
      setCartItems(items);

      if (items.length > 0) {
        const details = {};
        await Promise.all(items.map(async (item) => {
          const prodRes = await api.get(`/products/${item.productId}`);
          details[item.productId] = prodRes.data;
        }));
        setProductDetails(details);
      }
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartAndProducts();
  }, []);

  const updateQuantity = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    setCartItems(cartItems.map(item => item.productId === productId ? { ...item, quantity: newQty } : item));
    
    try {
      await api.delete(`/user/cart/${productId}`);
      await api.post('/user/cart', { productId, quantity: newQty });
    } catch (error) {
      console.error("Error updating cart", error);
      fetchCartAndProducts();
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCartItems(cartItems.filter(item => item.productId !== productId));
      await api.delete(`/user/cart/${productId}`);
    } catch (error) {
      console.error("Error removing from cart", error);
      fetchCartAndProducts();
    }
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = productDetails[item.productId]?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1 flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          <Typography variant="h4" className="font-black text-gray-900 mb-6">Shopping Cart</Typography>

          {loading ? (
            <div className="flex justify-center p-12"><CircularProgress /></div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
              <Typography variant="h6" className="text-gray-500">Your cart is empty.</Typography>
              <Button variant="contained" className="mt-4 rounded-full" onClick={() => navigate('/products')}>Continue Shopping</Button>
            </div>
          ) : (
            cartItems.map(item => {
              const product = productDetails[item.productId];
              if (!product) return null;

              return (
                <div key={item.productId} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                  <img src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.title} className="w-24 h-24 object-cover rounded-2xl" />
                  
                  <div className="flex-1">
                    <Typography variant="h6" className="font-bold text-gray-900 leading-tight">{product.title}</Typography>
                    <Typography variant="body2" className="text-gray-500 mb-2">{product.category}</Typography>
                    <Typography variant="h6" className="font-black text-indigo-600">${product.price}</Typography>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-full border border-gray-200">
                    <IconButton size="small" onClick={() => updateQuantity(item.productId, item.quantity, -1)}>
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography className="font-bold w-4 text-center">{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.productId, item.quantity, 1)}>
                      <Add fontSize="small" />
                    </IconButton>
                  </div>

                  <IconButton color="error" className="bg-red-50 hover:bg-red-100 rounded-xl" onClick={() => removeFromCart(item.productId)}>
                    <Delete />
                  </IconButton>
                </div>
              );
            })
          )}
        </div>

        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 sticky top-24">
            <Typography variant="h5" className="font-black text-gray-900 mb-6">Order Summary</Typography>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography className="font-bold">${subtotal.toFixed(2)}</Typography>
              </div>
              <div className="flex justify-between">
                <Typography color="text.secondary">Tax (10%)</Typography>
                <Typography className="font-bold">${tax.toFixed(2)}</Typography>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between items-center">
                <Typography variant="h6" className="font-bold">Total</Typography>
                <Typography variant="h5" className="font-black text-indigo-600">${total.toFixed(2)}</Typography>
              </div>
            </div>

            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              startIcon={<ShoppingCartCheckout />}
              className="bg-gray-900 hover:bg-indigo-600 rounded-full py-4 text-lg font-bold transition-colors shadow-xl"
              disabled={cartItems.length === 0}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
