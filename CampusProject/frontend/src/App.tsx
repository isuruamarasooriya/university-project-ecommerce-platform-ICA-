import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import Shop from './pages/Shop'
import Explore from './pages/Explore'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserDashboard from './pages/dashboard/UserDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRole="USER">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/men" element={<CategoryPage title="Men" />} />
      <Route path="/women" element={<CategoryPage title="Women" />} />
      <Route path="/trending" element={<CategoryPage title="Trending" />} />
      <Route path="/seasonal" element={<CategoryPage title="Seasonal" />} />
      <Route path="/accessories" element={<CategoryPage title="Accessories" />} />
    </Routes>
  )
}

