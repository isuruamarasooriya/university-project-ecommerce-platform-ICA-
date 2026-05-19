import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  CircularProgress, 
  Chip, 
  Button, 
  Collapse, 
  TextField, 
  Switch, 
  FormControlLabel, 
  Divider,
  Box
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  Logout, 
  ShoppingBag, 
  Mail, 
  Security, 
  Lock, 
  ExpandMore, 
  ExpandLess, 
  CreditCard, 
  Dashboard, 
  LocalShipping, 
  History, 
  CheckCircle,
  Delete
} from '@mui/icons-material';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { logout, role, email } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [bankDetails, setBankDetails] = useState({ accountHolderName: '', accountNumber: '', bankName: '', ifscCode: '', upiId: '' });
  const [loading, setLoading] = useState(true);
  const [savingBank, setSavingBank] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard');
  const [twoFactor, setTwoFactor] = useState(localStorage.getItem('2fa') === 'true');
  const [activities, setActivities] = useState([
    { text: "Logged into account", time: "Just now", icon: "🔑" },
    { text: "Viewed user profile dashboard", time: "1 minute ago", icon: "👤" }
  ]);

  const displayEmail = email || 'customer@multivendor.com';
  const userInitial = displayEmail.charAt(0).toUpperCase();

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const addActivity = (text, icon = "⚡") => {
    setActivities(prev => [{ text, time: "Just now", icon }, ...prev]);
  };

  useEffect(() => {
    if (role === 'SELLER') {
      navigate('/seller-dashboard', { replace: true });
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch orders
        const ordersRes = await api.get('/orders/myorders');
        setOrders(ordersRes.data);

        // Fetch wishlist
        const wishlistRes = await api.get('/user/wishlist');
        setWishlist(wishlistRes.data);

        // Fetch bank details
        const bankRes = await api.get('/user/bank-details');
        if (bankRes.data) {
          setBankDetails(bankRes.data);
        }

        // Fetch 2FA status
        try {
          const tfaRes = await api.get('/user/2fa');
          setTwoFactor(tfaRes.data);
        } catch (e) {
          console.error("Error fetching 2FA status", e);
        }
      } catch (error) {
        console.error('Error fetching profile data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [role, navigate]);

  // Dynamically populate activity timeline
  useEffect(() => {
    const list = [
      { text: "Logged into account", time: "Just now", icon: "🔑" },
      { text: "Viewed user profile dashboard", time: "1 minute ago", icon: "👤" }
    ];
    if (orders.length > 0) {
      orders.slice(0, 3).forEach((o, i) => {
        list.push({
          text: `Placed order #${o.id?.slice(-8).toUpperCase()} for $${o.totalAmount?.toFixed(2)}`,
          time: `${i + 1} day${i === 0 ? '' : 's'} ago`,
          icon: "🛒"
        });
      });
    }
    if (wishlist.length > 0) {
      wishlist.slice(0, 2).forEach((w, i) => {
        list.push({
          text: `Added "${w.title}" to wishlist`,
          time: `${i + 2} days ago`,
          icon: "❤️"
        });
      });
    }
    setActivities(list);
  }, [orders, wishlist]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/auth');
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
      toast.success("Order cancelled successfully! 🚫");
      addActivity(`Cancelled order #${orderId.slice(-8).toUpperCase()}`, "🚫");
    } catch (error) {
      console.error("Error cancelling order", error);
      toast.error(error.response?.data || "Failed to cancel order");
    }
  };

  const handleUpdateBankDetails = async (e) => {
    e.preventDefault();
    try {
      setSavingBank(true);
      const res = await api.put('/user/bank-details', bankDetails);
      setBankDetails(res.data);
      toast.success("Payment details updated successfully! 💳");
      addActivity("Updated bank/payment details", "💳");
    } catch (error) {
      console.error("Error updating bank details", error);
      toast.error("Failed to update payment details");
    } finally {
      setSavingBank(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/user/cart', { productId, quantity: 1 });
      toast.success("Added to cart! 🛒");
      addActivity("Added wishlist item to shopping cart", "🛒");
    } catch (error) {
      console.error("Error adding to cart", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.delete(`/user/wishlist/${productId}`);
      setWishlist(wishlist.filter(p => p.id !== productId));
      toast.success("Removed from wishlist");
      addActivity("Removed item from wishlist", "💔");
    } catch (error) {
      console.error("Error removing from wishlist", error);
      toast.error("Failed to remove item");
    }
  };

  const statusMap = {
    PENDING: { label: 'Pending Approval', color: '#F59E0B', progress: 25 },
    PROCESSING: { label: 'In Production', color: '#3B82F6', progress: 50 },
    SHIPPED: { label: 'Out for Delivery', color: '#6366F1', progress: 75 },
    DELIVERED: { label: 'Delivered', color: '#10B981', progress: 100 },
    CANCELLED: { label: 'Cancelled', color: '#EF4444', progress: 0 },
  };

  const VisualCard = () => {
    const rawNum = bankDetails.accountNumber || "•••• •••• •••• ••••";
    let formattedNum = rawNum;
    if (rawNum && rawNum !== "•••• •••• •••• ••••") {
      const cleaned = rawNum.replace(/\s?/g, '');
      const parts = [];
      for (let i = 0; i < cleaned.length; i += 4) {
        parts.push(cleaned.substring(i, i + 4));
      }
      formattedNum = parts.join(' ');
    }
    
    return (
      <Box 
        component={motion.div}
        whileHover={{ scale: 1.02, rotateY: 2, rotateX: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        sx={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
          borderRadius: '20px',
          p: 3,
          color: '#fff',
          boxShadow: '0 20px 40px rgba(99, 102, 241, 0.15), inset 0 1px 1px rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
          height: '180px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          mb: 3
        }}
      >
        <Box sx={{ position: 'absolute', width: '150px', height: '150px', top: '-50px', right: '-50px', background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0) 70%)', filter: 'blur(10px)', pointerEvents: 'none' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>BANK NAME</Typography>
            <Typography sx={{ fontSize: '15px', fontWeight: 900, letterSpacing: '-0.5px' }}>{bankDetails.bankName || "Digital E-Commerce Bank"}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Box sx={{ width: '32px', height: '20px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '4px' }} />
            <Box sx={{ width: '32px', height: '20px', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: '4px' }} />
          </Box>
        </Box>

        <Box sx={{ zIndex: 2 }}>
          <Typography sx={{ fontSize: '16px', fontWeight: 700, letterSpacing: '3px', fontFamily: 'monospace' }}>
            {formattedNum}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>CARD HOLDER</Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 800 }}>{bankDetails.accountHolderName || "SHANKER CLIENT"}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '8px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>IFSC CODE</Typography>
            <Typography sx={{ fontSize: '12px', fontWeight: 800 }}>{bankDetails.ifscCode || "DECB000123"}</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const DashboardSection = () => {
    const activeDeliveries = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
    const completedOrders = orders.filter(o => o.status === 'DELIVERED');
    const rewardPoints = Math.floor(completedOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0) * 10) + 120;

    const stats = [
      { label: 'Total Orders', value: orders.length, color: '#6366f1', icon: <ShoppingBag /> },
      { label: 'Wishlist Items', value: wishlist.length, color: '#ec4899', icon: <Favorite /> },
      { label: 'Active Deliveries', value: activeDeliveries.length, color: '#06b6d4', icon: <LocalShipping /> },
      { label: 'Reward Points', value: rewardPoints, color: '#eab308', icon: <CheckCircle /> }
    ];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Stats Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {stats.map((stat, i) => (
            <Box
              component={motion.div}
              whileHover={{ y: -4 }}
              key={i}
              sx={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <Box 
                sx={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: `${stat.color}15`, 
                  color: stat.color 
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '9px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', m: 0 }}>
                  {stat.label}
                </Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', m: 0, mt: 0.5 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Two Column Layout */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1fr 1fr' }, gap: 4 }}>
          {/* Recent Orders & Delivery Tracking */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" style={{ color: '#0f172a', fontWeight: 900 }}>
              Recent Orders & Tracking
            </Typography>
            {orders.length === 0 ? (
              <Box sx={{ p: 4, background: '#ffffff', borderRadius: '24px', border: '1px dashed #e2e8f0', textAlign: 'center' }}>
                <Typography sx={{ color: '#64748b', fontSize: '12px' }}>No orders placed yet.</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {orders.slice(0, 2).map((order) => {
                  const statusInfo = statusMap[order.status] || statusMap.PENDING;
                  return (
                    <Box 
                      key={order.id}
                      sx={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        p: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box>
                          <Typography sx={{ color: '#64748b', fontSize: '10px', fontWeight: 750 }}>ID: #{order.id?.slice(-8).toUpperCase()}</Typography>
                          <Typography sx={{ color: '#0f172a', fontSize: '14px', fontWeight: 900, mt: 0.5 }}>${order.totalAmount?.toFixed(2)}</Typography>
                        </Box>
                        <Chip 
                          label={statusInfo.label} 
                          size="small" 
                          sx={{ background: `${statusInfo.color}15`, color: statusInfo.color, fontWeight: 900, fontSize: '9px', border: 'none' }} 
                        />
                      </Box>
                      
                      {order.status !== 'CANCELLED' && (
                        <Box>
                          <Box sx={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                            <Box sx={{ width: `${statusInfo.progress}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', height: '100%' }} />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#64748b', mt: 1, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            <span>Placed</span>
                            <span>Processed</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  );
                })}
                <Button 
                  onClick={() => setActiveTab('orders')}
                  style={{ color: '#6366f1', textTransform: 'none', fontWeight: 800, fontSize: '13px', alignSelf: 'flex-start' }}
                >
                  View All Orders &rarr;
                </Button>
              </Box>
            )}
          </Box>

          {/* Payment Card & Activity Short Timeline */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" style={{ color: '#0f172a', fontWeight: 900, marginBottom: '12px' }}>
                Primary Payment Card
              </Typography>
              <VisualCard />
            </Box>

            <Box>
              <Typography variant="subtitle1" style={{ color: '#0f172a', fontWeight: 900, marginBottom: '12px' }}>
                Recent Log Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {activities.slice(0, 3).map((act, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '15px', m: 0 }}>{act.icon}</Typography>
                    <Box>
                      <Typography sx={{ color: '#0f172a', fontSize: '12px', fontWeight: 700, m: 0 }}>{act.text}</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '10px', m: 0 }}>{act.time}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const OrdersSection = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" style={{ fontWeight: 900, color: '#0f172a' }}>
          All Placed Orders ({orders.length})
        </Typography>

        {orders.length === 0 ? (
          <Box sx={{ textCenter: 'center', py: 6, background: '#ffffff', border: '1px dashed #e2e8f0', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ShoppingBag style={{ color: '#94a3b8', fontSize: '48px', opacity: 0.3 }} />
            <Typography sx={{ color: '#64748b', fontWeight: 800 }}>No orders placed yet</Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '12px', mb: 1 }}>
              Shop some of our premium products to get started!
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/products')}
              sx={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)', textTransform: 'none', fontWeight: 800, borderRadius: '12px' }}
            >
              Start Shopping
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {orders.map((order, idx) => {
              const statusInfo = statusMap[order.status] || statusMap.PENDING;
              return (
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  key={order.id}
                  sx={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Order Top Bar */}
                  <Box sx={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', px: 3, py: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px' }}>ORDER ID</Typography>
                      <Typography sx={{ color: '#0f172a', fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>#{order.id?.slice(-8).toUpperCase()}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px' }}>SHIPPING ADDRESS</Typography>
                      <Typography sx={{ color: '#0f172a', fontSize: '12px', fontWeight: 700 }}>{order.shippingAddress}</Typography>
                    </Box>
                  </Box>

                  {/* Order Mid */}
                  <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Box>
                      <Typography sx={{ color: '#6366f1', fontWeight: 900, fontSize: '22px', m: 0 }}>${order.totalAmount?.toFixed(2)}</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '11px', fontWeight: 700, mt: 0.5 }}>
                        Payment Method: {order.paymentMethod || 'Credit Card'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {order.status === 'PENDING' && (
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleCancelOrder(order.id)}
                          sx={{ textTransform: 'none', fontWeight: 800, background: 'rgba(239, 68, 68, 0.05)', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}
                        >
                          Cancel Order
                        </Button>
                      )}
                      <Chip 
                        label={statusInfo.label} 
                        size="small" 
                        sx={{ background: `${statusInfo.color}15`, color: statusInfo.color, fontWeight: 900, fontSize: '9px', border: 'none' }} 
                      />
                    </Box>
                  </Box>

                  {/* Tracking Progress */}
                  {order.status !== 'CANCELLED' && (
                    <Box sx={{ px: 3, pb: 3 }}>
                      <Box sx={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                        <Box sx={{ width: `${statusInfo.progress}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', height: '100%' }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#64748b', mt: 1, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <span>Placed</span>
                        <span>Processed</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </Box>
                    </Box>
                  )}

                  {/* Purchased Items Collapse */}
                  <Box sx={{ borderTop: '1px solid #e2e8f0' }}>
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '12px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: '#64748b',
                        fontSize: '12px',
                        fontWeight: 800
                      }}
                    >
                      <span>{expandedOrders[order.id] ? 'Hide Purchased Items' : 'View Purchased Items'}</span>
                      {expandedOrders[order.id] ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                    </button>
                    
                    <Collapse in={expandedOrders[order.id]}>
                      <Box sx={{ p: 3, background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {order.items?.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', p: 1.5, borderRadius: '12px' }}>
                              <img 
                                src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80'} 
                                alt={item.productTitle} 
                                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
                              />
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ m: 0, fontSize: '13px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {item.productTitle}
                                </Typography>
                                <Typography sx={{ m: 0, fontSize: '11px', color: '#64748b', mt: 0.5 }}>
                                  Qty: {item.quantity} × ${item.priceAtPurchase?.toFixed(2)}
                                </Typography>
                              </Box>
                              <Typography sx={{ fontSize: '13px', fontWeight: 900, color: '#6366f1' }}>
                                ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Collapse>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  const WishlistSection = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" style={{ fontWeight: 900, color: '#0f172a' }}>
            Saved Wishlist ({wishlist.length})
          </Typography>
          <Button onClick={() => navigate('/products')} style={{ color: '#6366f1', fontWeight: 800, textTransform: 'none', fontSize: '13px' }}>
            Explore More Products
          </Button>
        </Box>
        
        {wishlist.length === 0 ? (
          <Box sx={{ textCenter: 'center', py: 6, background: '#ffffff', border: '1px dashed #e2e8f0', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Favorite style={{ color: '#ec4899', fontSize: '48px', opacity: 0.3 }} />
            <Typography sx={{ color: '#64748b', fontWeight: 800 }}>Your wishlist is empty</Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '12px' }}>
              Add items from the store to see them here!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3.5 }}>
            {wishlist.map(product => (
              <Box
                component={motion.div}
                whileHover={{ y: -5 }}
                key={product.id}
                sx={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                }}
              >
                <Box sx={{ height: '140px', overflow: 'hidden', background: '#f1f5f9' }}>
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"} 
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Typography sx={{ color: '#0f172a', fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.title}
                  </Typography>
                  <Typography sx={{ color: '#6366f1', fontWeight: 900, fontSize: '16px', mt: 1, mb: 2 }}>
                    ${product.price}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button 
                      fullWidth
                      variant="contained" 
                      onClick={() => handleAddToCart(product.id)}
                      sx={{ 
                        background: 'linear-gradient(135deg, #6366f1, #3b82f6)', 
                        textTransform: 'none', 
                        fontWeight: 800, 
                        fontSize: '11px',
                        borderRadius: '8px'
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      sx={{ 
                        minWidth: '36px', 
                        width: '36px', 
                        background: 'rgba(239, 68, 68, 0.15)', 
                        color: '#ef4444',
                        '&:hover': { background: 'rgba(239, 68, 68, 0.25)' },
                        borderRadius: '8px'
                      }}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const PaymentSection = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" style={{ fontWeight: 900, color: '#0f172a' }}>
          Payment & Bank Settings
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography variant="subtitle2" style={{ fontWeight: 800, color: '#64748b', marginBottom: '12px' }}>
              Your Active Payout / Debit Card
            </Typography>
            <VisualCard />
          </Box>

          <Box sx={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            <Typography variant="subtitle1" style={{ fontWeight: 900, color: '#0f172a', marginBottom: '20px' }}>
              Update Bank Details
            </Typography>
            <Box component="form" onSubmit={handleUpdateBankDetails} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Account Holder Name" 
                variant="outlined" 
                size="small"
                fullWidth
                value={bankDetails.accountHolderName || ''}
                onChange={e => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
              />
              <TextField 
                label="Account/Card Number" 
                variant="outlined" 
                size="small"
                fullWidth
                value={bankDetails.accountNumber || ''}
                onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})}
              />
              <TextField 
                label="Bank Name" 
                variant="outlined" 
                size="small"
                fullWidth
                value={bankDetails.bankName || ''}
                onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})}
              />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField 
                  label="IFSC Code" 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  value={bankDetails.ifscCode || ''}
                  onChange={e => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                />
                <TextField 
                  label="UPI ID" 
                  variant="outlined" 
                  size="small"
                  fullWidth
                  value={bankDetails.upiId || ''}
                  onChange={e => setBankDetails({...bankDetails, upiId: e.target.value})}
                />
              </Box>
              <Button 
                type="submit"
                variant="contained" 
                disabled={savingBank}
                sx={{ 
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)', 
                  textTransform: 'none', 
                  fontWeight: 800, 
                  borderRadius: '12px',
                  padding: '10px',
                  mt: 1
                }}
              >
                {savingBank ? <CircularProgress size={20} color="inherit" /> : "Save Payment Details"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const SecuritySection = () => {
    const [changePassword, setChangePassword] = useState({ current: '', new: '', confirm: '' });
    const [updatingPassword, setUpdatingPassword] = useState(false);
    
    const handlePasswordSubmit = async (e) => {
      e.preventDefault();
      if (changePassword.new !== changePassword.confirm) {
        toast.error("New passwords do not match!");
        return;
      }
      try {
        setUpdatingPassword(true);
        await api.put('/user/change-password', {
          currentPassword: changePassword.current,
          newPassword: changePassword.new
        });
        toast.success("Password updated successfully! 🔒");
        setChangePassword({ current: '', new: '', confirm: '' });
        addActivity("Updated account password", "🔒");
      } catch (error) {
        console.error("Error changing password", error);
        toast.error(error.response?.data || "Failed to update password");
      } finally {
        setUpdatingPassword(false);
      }
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" style={{ fontWeight: 900, color: '#0f172a' }}>
          Security Settings
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box sx={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
            <Typography variant="subtitle1" style={{ fontWeight: 900, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock style={{ color: '#6366f1' }} /> Update Password
            </Typography>
            <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                type="password" 
                label="Current Password" 
                variant="outlined" 
                size="small"
                fullWidth
                value={changePassword.current}
                onChange={e => setChangePassword({...changePassword, current: e.target.value})}
              />
              <TextField 
                type="password" 
                label="New Password" 
                variant="outlined" 
                size="small"
                fullWidth
                value={changePassword.new}
                onChange={e => setChangePassword({...changePassword, new: e.target.value})}
              />
              <TextField 
                type="password" 
                label="Confirm New Password" 
                variant="outlined" 
                size="small"
                fullWidth
                value={changePassword.confirm}
                onChange={e => setChangePassword({...changePassword, confirm: e.target.value})}
              />
              <Button 
                type="submit"
                variant="contained" 
                disabled={updatingPassword}
                sx={{ background: 'linear-gradient(135deg, #6366f1, #3b82f6)', textTransform: 'none', fontWeight: 800, borderRadius: '12px' }}
              >
                {updatingPassword ? <CircularProgress size={20} color="inherit" /> : "Change Password"}
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              <Typography variant="subtitle1" style={{ fontWeight: 900, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Security style={{ color: '#10b981' }} /> Two-Factor Authentication (2FA)
              </Typography>
              <Typography style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px', lineHeight: 1.5 }}>
                Add an extra layer of protection to your account by configuring two-factor authentication.
              </Typography>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={twoFactor} 
                    onChange={async (e) => {
                      const newChecked = e.target.checked;
                      try {
                        await api.put(`/user/2fa?enabled=${newChecked}`);
                        setTwoFactor(newChecked);
                        localStorage.setItem('2fa', newChecked);
                        toast.success(newChecked ? "2FA Enabled!" : "2FA Disabled");
                        addActivity(newChecked ? "Enabled Two-Factor Authentication" : "Disabled Two-Factor Authentication", "🛡️");
                      } catch (err) {
                        console.error("Error updating 2FA", err);
                        toast.error("Failed to update 2FA status");
                      }
                    }} 
                    color="primary"
                  />
                } 
                label={<span style={{ color: '#0f172a', fontWeight: 700, fontSize: '13px' }}>Enable 2FA Protection</span>}
              />
            </Box>

            <Box sx={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', p: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
              <Typography variant="subtitle1" style={{ fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>
                Active Devices
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ color: '#0f172a', fontSize: '12px', fontWeight: 800, m: 0 }}>Chrome (Windows 11)</Typography>
                    <Typography sx={{ color: '#10b981', fontSize: '10px', fontWeight: 700, m: 0, mt: 0.5 }}>Active session • Current Device</Typography>
                  </Box>
                  <Chip label="Current" size="small" color="success" sx={{ fontSize: '9px', height: '18px', fontWeight: 800 }} />
                </Box>
                <Divider sx={{ backgroundColor: '#e2e8f0' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ color: '#0f172a', fontSize: '12px', fontWeight: 800, m: 0 }}>Safari (iPhone 15 Pro)</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '10px', m: 0, mt: 0.5 }}>Last active: 2 hours ago</Typography>
                  </Box>
                  <Button size="small" style={{ color: '#ef4444', textTransform: 'none', fontSize: '11px', fontWeight: 850 }}>Revoke</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const ActivitySection = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h5" style={{ fontWeight: 900, color: '#0f172a' }}>
          Activity Timeline
        </Typography>
        <Box sx={{ position: 'relative', pl: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ position: 'absolute', left: '5px', top: '8px', bottom: '8px', width: '2px', backgroundColor: '#e2e8f0' }} />
          
          {activities.map((act, index) => (
            <Box 
              component={motion.div}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index} 
              sx={{ display: 'flex', gap: 2, alignItems: 'start', position: 'relative' }}
            >
              <Box sx={{ position: 'absolute', left: '-23px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffffff', border: '3px solid #6366f1', boxShadow: '0 0 8px rgba(99,102,241,0.2)', zIndex: 10 }} />
              <Box>
                <Typography sx={{ color: '#0f172a', fontSize: '12px', fontWeight: 700, m: 0 }}>{act.text}</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '10px', m: 0, mt: 0.5 }}>{act.time}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#0f172a' }}>
      <Navbar />
      
      <Box sx={{ maxWidth: '1152px', margin: '0 auto', width: '100%', px: 2, py: 4, flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        {/* Hero Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            background: 'linear-gradient(135deg, #090a1f 0%, #11132e 50%, #1e1b4b 100%)', 
            borderRadius: '24px', 
            p: { xs: 3, md: 4 }, 
            position: 'relative', 
            overflow: 'hidden', 
            boxShadow: '0 20px 40px rgba(15,23,42,0.15)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: '#fff'
          }}
        >
          <Box sx={{ position: 'absolute', width: '250px', height: '250px', top: '-100px', right: '-50px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', width: '200px', height: '200px', bottom: '-100px', left: '-50px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)', filter: 'blur(25px)', pointerEvents: 'none' }} />
          
          <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 3, textAlign: { xs: 'center', sm: 'left' } }}>
              {/* Avatar Ring */}
              <Box 
                sx={{ 
                  width: '80px', 
                  height: '80px', 
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  border: '4px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 0 20px rgba(99,102,241,0.4)' 
                }}
              >
                <Typography sx={{ fontSize: '28px', fontWeight: 950, color: '#fff', letterSpacing: '-1px', m: 0 }}>{userInitial}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1.5 }}>
                  <Typography variant="h4" style={{ fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: '#fff' }}>
                    Welcome Back, {bankDetails.accountHolderName?.split(' ')[0] || 'Shopper'} 👋
                  </Typography>
                  <Chip 
                    label="GOLD MEMBER ⭐" 
                    size="small" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                      color: '#fff', 
                      fontWeight: 900, 
                      fontSize: '9px',
                      height: '18px',
                      border: 'none',
                      boxShadow: '0 4px 10px rgba(245,158,11,0.3)'
                    }} 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, color: '#cbd5e1', mt: 0.5 }}>
                  <Mail style={{ fontSize: '14px' }} />
                  <Typography sx={{ fontSize: '12px', fontWeight: 700, m: 0, color: '#cbd5e1' }}>{displayEmail}</Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button 
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('payment')}
                variant="outlined"
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.2)', 
                  color: '#fff', 
                  px: 2.5, 
                  py: 1, 
                  borderRadius: '12px', 
                  fontWeight: 800, 
                  fontSize: '12px', 
                  textTransform: 'none',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)' }
                }}
              >
                Update Details
              </Button>
              
              <Button 
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                variant="contained"
                color="error"
                startIcon={<Logout />}
                sx={{ 
                  background: 'rgba(239, 68, 68, 0.15)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  color: '#ef4444', 
                  px: 2.5, 
                  py: 1, 
                  borderRadius: '12px', 
                  fontWeight: 800, 
                  fontSize: '12px', 
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { background: '#ef4444', color: '#fff', borderColor: '#ef4444' }
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Sidebar + Content */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '260px 1fr' }, gap: 4, alignItems: 'start' }}>
          
          {/* Sidebar Menu */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '24px', 
              p: 2.5, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)' 
            }}
          >
            <Typography sx={{ fontSize: '10px', color: '#64748b', fontWeight: 900, px: 2, textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>
              Account Menu
            </Typography>
            
            {[
              { id: 'dashboard', label: 'My Profile', icon: <Dashboard /> },
              { id: 'orders', label: 'My Orders', icon: <ShoppingBag /> },
              { id: 'wishlist', label: 'Wishlist Preview', icon: <Favorite /> },
              { id: 'payment', label: 'Payment Settings', icon: <CreditCard /> },
              { id: 'security', label: 'Security & 2FA', icon: <Security /> },
              { id: 'activity', label: 'Activity Timeline', icon: <History /> }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  startIcon={tab.icon}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 800,
                    py: 1.5,
                    px: 2,
                    borderRadius: '12px',
                    color: isActive ? '#fff' : '#64748b',
                    background: isActive ? 'linear-gradient(135deg, #6366f1, #3b82f6)' : 'transparent',
                    boxShadow: isActive ? '0 8px 16px rgba(99, 102, 241, 0.15)' : 'none',
                    '&:hover': {
                      background: isActive ? 'linear-gradient(135deg, #6366f1, #3b82f6)' : '#f1f5f9',
                      color: isActive ? '#fff' : '#0f172a'
                    }
                  }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Box>

          {/* Content Area */}
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '24px', 
              p: { xs: 3, md: 4 }, 
              minHeight: '400px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', h: '300px', height: '300px' }}>
                <CircularProgress sx={{ color: '#6366f1' }} />
              </Box>
            ) : (
              <AnimatePresence mode="wait">
                <Box
                  component={motion.div}
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'dashboard' && <DashboardSection />}
                  {activeTab === 'orders' && <OrdersSection />}
                  {activeTab === 'wishlist' && <WishlistSection />}
                  {activeTab === 'payment' && <PaymentSection />}
                  {activeTab === 'security' && <SecuritySection />}
                  {activeTab === 'activity' && <ActivitySection />}
                </Box>
              </AnimatePresence>
            )}
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
