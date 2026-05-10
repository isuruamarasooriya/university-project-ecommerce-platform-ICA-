import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import SellerDashboard from './pages/SellerDashboard';
import Profile from './pages/Profile';
import ProductListingPage from './pages/ProductListingPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        
        {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/products" element={<ProductListingPage />} />

        <Route 
          path="/cart" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
              <CartPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
              <WishlistPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
              <Profile />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/seller-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
              <SellerDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </Router>
  );
}

export default App;
