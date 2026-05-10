import React from 'react';
import { Typography, Button } from '@mui/material';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <Typography variant="h4" className="font-bold text-gray-800">Admin Dashboard</Typography>
          <Button variant="outlined" color="error" onClick={handleLogout}>Logout</Button>
        </div>
        <Typography variant="body1" className="text-gray-600">
          Welcome to the admin control panel. From here you can manage users, sellers, and system settings.
        </Typography>
      </div>
    </div>
  );
};

export default AdminDashboard;
