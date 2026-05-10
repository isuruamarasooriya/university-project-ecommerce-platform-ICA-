import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, CardContent, Chip, CircularProgress, Divider } from '@mui/material';
import { ShoppingCart, Favorite, Logout, ShoppingBag, Person, ChevronRight } from '@mui/icons-material';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const Profile = () => {
  const { logout, role } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === 'SELLER') {
      navigate('/seller-dashboard', { replace: true });
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/myorders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [role, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const quickLinks = [
    { label: 'Browse Products', icon: <ShoppingBag />, path: '/products', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'My Cart', icon: <ShoppingCart />, path: '/cart', color: 'bg-purple-50 text-purple-600' },
    { label: 'My Wishlist', icon: <Favorite />, path: '/wishlist', color: 'bg-pink-50 text-pink-600' },
    { label: 'Checkout', icon: <ChevronRight />, path: '/checkout', color: 'bg-green-50 text-green-600' },
  ];

  const statusColors = {
    PENDING: 'warning',
    PROCESSING: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'error',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full px-4 py-10 space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shadow-inner backdrop-blur">
              <Person fontSize="large" className="text-white" />
            </div>
            <div>
              <Typography variant="h5" className="font-black">My Account</Typography>
              <Typography variant="body2" className="opacity-75 mt-1">
                Role: <span className="font-semibold capitalize">{role?.toLowerCase() || 'Customer'}</span>
              </Typography>
            </div>
          </div>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' } }}
            className="rounded-full"
          >
            Logout
          </Button>
        </div>

        <div>
          <Typography variant="h6" className="font-bold text-gray-800 mb-4">Quick Actions</Typography>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`${link.color} rounded-2xl p-5 flex flex-col items-center gap-3 font-semibold text-sm hover:scale-105 transition-transform duration-200 shadow-sm border border-white`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <Divider />

        <div>
          <Typography variant="h6" className="font-bold text-gray-800 mb-4">My Orders</Typography>
          {loading ? (
            <div className="flex justify-center py-12"><CircularProgress /></div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-300 py-16 flex flex-col items-center text-center shadow-sm">
              <ShoppingBag className="text-gray-300 mb-3" style={{ fontSize: 48 }} />
              <Typography variant="h6" className="font-bold text-gray-500">No orders yet</Typography>
              <Typography variant="body2" className="text-gray-400 mt-1 mb-6">Start shopping and your orders will appear here.</Typography>
              <Button variant="contained" onClick={() => navigate('/products')} className="rounded-full px-8"
                sx={{ background: 'linear-gradient(45deg, #4f46e5, #9333ea)', textTransform: 'none' }}>
                Shop Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <Typography variant="subtitle1" className="font-bold text-gray-800">
                          Order #{order.id?.slice(-6).toUpperCase()}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500 mt-1">
                          {order.items?.length || 0} item(s) · Shipped to: {order.shippingAddress}
                        </Typography>
                      </div>
                      <div className="text-right">
                        <Chip
                          label={order.status || 'PENDING'}
                          color={statusColors[order.status] || 'default'}
                          size="small"
                          className="font-bold mb-2"
                        />
                        <Typography variant="h6" className="font-black text-indigo-600">
                          ${order.totalAmount?.toFixed(2)}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
