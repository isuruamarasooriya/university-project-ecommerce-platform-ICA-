import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, IconButton, Badge, Tooltip } from '@mui/material';
import { ShoppingCart, Favorite, Person, Dashboard } from '@mui/icons-material';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { token, role, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Typography 
          variant="h5" 
          className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer tracking-tight hover:scale-105 transition-transform"
          onClick={() => navigate('/products')}
        >
          MultiVendor
        </Typography>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {token ? (
            <>
             
              {role !== 'SELLER' && (
                <>
                  <Tooltip title="My Wishlist">
                    <IconButton color="primary" onClick={() => navigate('/wishlist')}>
                      <Favorite />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="My Cart">
                    <IconButton color="primary" onClick={() => navigate('/cart')}>
                      <Badge color="error" variant="dot">
                        <ShoppingCart />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {role === 'SELLER' && (
                <Tooltip title="Seller Dashboard">
                  <IconButton color="primary" onClick={() => navigate('/seller-dashboard')}>
                    <Dashboard />
                  </IconButton>
                </Tooltip>
              )}

              {role !== 'SELLER' && (
                <Tooltip title="My Profile">
                  <IconButton color="primary" onClick={() => navigate('/profile')}>
                    <Person />
                  </IconButton>
                </Tooltip>
              )}

              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleLogout}
                className="hidden sm:inline-flex rounded-full px-4"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" size="small" onClick={() => navigate('/auth')} className="rounded-full px-6 shadow-md hover:shadow-lg">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
