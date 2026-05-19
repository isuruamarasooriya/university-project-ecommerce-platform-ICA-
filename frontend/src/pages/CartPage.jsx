import React, { useState, useEffect } from 'react';
import { Typography, Button, IconButton, CircularProgress, Divider, TextField, MenuItem } from '@mui/material';
import { Delete, ShoppingCartCheckout, CreditCard, CheckCircle, Favorite, LocalShipping, Shield, AssignmentReturn, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const navigate = useNavigate();

  // Bank/Card payment details form state
  const [bankLoading, setBankLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    bankName: '',
    accountNumber: ''
  });

  const fetchCartAndProducts = async () => {
    try {
      const cartRes = await api.get('/user/cart');
      const items = cartRes.data;
      setCartItems(items);

      const details = {};
      if (items.length > 0) {
        await Promise.all(items.map(async (item) => {
          const prodRes = await api.get(`/products/${item.productId}`);
          details[item.productId] = prodRes.data;
        }));
        setProductDetails(details);
      }

      // Load Saved For Later list from LocalStorage
      const saved = JSON.parse(localStorage.getItem('saved_for_later') || '[]');
      setSavedItems(saved);

      // Load Bank details directly in the shopping cart!
      const bankRes = await api.get('/user/bank-details');
      if (bankRes.data) {
        setBankDetails(bankRes.data);
      }

      // Fetch Frequently Bought Together (Products other than current cart)
      const allProds = await api.get('/products');
      const filteredProds = allProds.data.filter(
        p => !items.some(cItem => cItem.productId === p.id)
      ).slice(0, 3);
      setFrequentlyBought(filteredProds);

    } catch (error) {
      console.error("Error fetching cart data", error);
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
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing from cart", error);
      fetchCartAndProducts();
    }
  };

  // Move Cart Item to Saved For Later list
  const handleSaveForLater = async (productId) => {
    try {
      const prod = productDetails[productId];
      if (!prod) return;

      const currentSaved = JSON.parse(localStorage.getItem('saved_for_later') || '[]');
      if (!currentSaved.some(item => item.id === productId)) {
        currentSaved.push(prod);
        localStorage.setItem('saved_for_later', JSON.stringify(currentSaved));
        setSavedItems(currentSaved);
      }

      // Delete from backend cart
      await api.delete(`/user/cart/${productId}`);
      setCartItems(cartItems.filter(item => item.productId !== productId));
      toast.success(`"${prod.title}" saved for later! 💾`);
    } catch (error) {
      console.error("Error saving for later", error);
      toast.error("Failed to save item for later");
    }
  };

  // Move Saved Item back to active Cart
  const handleMoveToCart = async (product) => {
    try {
      // Add back to backend cart
      await api.post('/user/cart', { productId: product.id, quantity: 1 });

      const currentSaved = JSON.parse(localStorage.getItem('saved_for_later') || '[]');
      const updatedSaved = currentSaved.filter(item => item.id !== product.id);
      localStorage.setItem('saved_for_later', JSON.stringify(updatedSaved));
      setSavedItems(updatedSaved);

      await fetchCartAndProducts();
      toast.success(`"${product.title}" moved to active cart! 🛒`);
    } catch (error) {
      console.error("Error moving back to cart", error);
      toast.error("Failed to move back to active cart");
    }
  };

  // Remove Item from Saved List
  const handleRemoveFromSaved = (productId) => {
    const currentSaved = JSON.parse(localStorage.getItem('saved_for_later') || '[]');
    const updatedSaved = currentSaved.filter(item => item.id !== productId);
    localStorage.setItem('saved_for_later', JSON.stringify(updatedSaved));
    setSavedItems(updatedSaved);
    toast.success("Removed from saved items");
  };

  // Quick purchase for recommended products
  const handleQuickAdd = async (productId) => {
    try {
      await api.post('/user/cart', { productId, quantity: 1 });
      toast.success("Added to cart 🛒");
      fetchCartAndProducts();
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleUpdateBankDetails = async (e) => {
    e.preventDefault();
    setBankLoading(true);
    try {
      await api.put('/user/bank-details', bankDetails);
      toast.success("Payment details saved securely! 🔒");
    } catch (error) {
      console.error("Error saving payment details", error);
      toast.error("Failed to save payment details");
    } finally {
      setBankLoading(false);
    }
  };

  // Determine if payment credentials are fully filled and saved
  const isPaymentConfigured = !!(
    bankDetails.cardHolderName?.trim() &&
    bankDetails.cardNumber?.trim() &&
    bankDetails.bankName?.trim() &&
    bankDetails.accountNumber?.trim()
  );

  const handleProceedToCheckout = () => {
    if (!isPaymentConfigured) {
      toast.error("Please fill and save your Secure Payment settings below before proceeding to checkout! 🔒", {
        duration: 4000
      });
      return;
    }
    navigate('/checkout');
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const price = productDetails[item.productId]?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  // Static weekday delivery arrival estimation
  const getDeliveryDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 4);
    return `Arrives by ${days[nextWeek.getDay()]} | Eligible for FREE delivery`;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #0f172a 0%, #020617 100%)', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px', width: '100%', flex: 1 }}>
        
        {/* Banner header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <Typography variant="h4" style={{ fontWeight: 900, background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
              Shopping Cart
            </Typography>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>You have {cartItems.length} active item{cartItems.length !== 1 && 's'} in your cart.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
            <span>🔒 SSL Encrypted</span>
            <span>•</span>
            <span>🛡️ Buyer Protection Active</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr lg(380px)', gap: 32 }} className="grid grid-cols-1 lg:grid-cols-3">
          
          {/* Active Cart Items & Saved list (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active Items container */}
            <div style={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 24 }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><CircularProgress sx={{ color: '#6366f1' }} /></div>
              ) : cartItems.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                  <Typography variant="h6" style={{ color: '#94a3b8', marginBottom: 16 }}>Your cart is empty.</Typography>
                  <Button variant="contained" 
                    onClick={() => navigate('/products')}
                    style={{ background: 'linear-gradient(135deg,#6366f1,#3b82f6)', color: '#fff', borderRadius: 9999, fontWeight: 700, padding: '10px 24px', textTransform: 'none' }}
                  >
                    Browse Premium Catalog
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {cartItems.map(item => {
                    const product = productDetails[item.productId];
                    if (!product) return null;

                    return (
                      <div key={item.productId} style={{ display: 'flex', flexWrap: 'wrap', gap: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 18, padding: 16, alignItems: 'center' }}>
                        {/* Compact card layout */}
                        <img src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} alt={product.title} style={{ width: 'clamp(48px, 10vw, 80px)', height: 'clamp(48px, 10vw, 80px)', objectFit: 'cover', borderRadius: 'clamp(6px, 1vw, 12px)' }} />
                        
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category}</span>
                          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginTop: 2, marginBottom: 4 }} className="line-clamp-1">{product.title}</h3>
                          
                          {/* Shipping estimate badge */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: 'clamp(10px, 2vw, 12px)', fontWeight: 700, marginBottom: 8 }}>
                            <LocalShipping style={{ fontSize: 'clamp(12px, 2.5vw, 16px)' }} />
                            <span>{getDeliveryDate()}</span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14 }}>
                            {/* Quantity Selector Dropdown */}
                            <select
                              value={item.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                updateQuantity(item.productId, item.quantity, val - item.quantity);
                              }}
                              style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: '#fff',
                                borderRadius: '8px',
                                padding: 'clamp(4px, 1vw, 6px) clamp(8px, 1.5vw, 12px)',
                                fontSize: 'clamp(11px, 2vw, 13px)',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                outline: 'none'
                              }}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n} style={{ background: '#0f172a', color: '#fff' }}>
                                  Qty: {n}
                                </option>
                              ))}
                            </select>

                            <button onClick={() => handleSaveForLater(item.productId)} style={{ border: 'none', background: 'none', color: '#38bdf8', fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 'clamp(4px, 1vw, 8px)' }}>
                              <span style={{ fontSize: 'clamp(14px, 2.5vw, 18px)' }}>💾</span> Save for Later
                            </button>

                            <button onClick={() => removeFromCart(item.productId)} style={{ border: 'none', background: 'none', color: '#f87171', fontSize: 'clamp(11px, 2vw, 13px)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: 'clamp(4px, 1vw, 8px)' }}>
                              <span style={{ fontSize: 'clamp(14px, 2.5vw, 18px)' }}>🗑️</span> Remove
                            </button>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div style={{ textAlign: 'right', minWidth: 90 }}>
                          <span style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc' }}>
                            ${(product.price * item.quantity).toFixed(2)}
                          </span>
                          {item.quantity > 1 && (
                            <span style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                              (${product.price.toFixed(2)} each)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Saved For Later items container */}
            {savedItems.length > 0 && (
              <div style={{ background: 'rgba(30, 41, 59, 0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 24 }}>
                <Typography variant="h6" style={{ fontWeight: 800, color: '#cbd5e1', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  💾 Saved for Later ({savedItems.length} item{savedItems.length !== 1 && 's'})
                </Typography>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {savedItems.map(prod => (
                    <div key={prod.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src={prod.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} alt={prod.title} style={{ width: 'clamp(48px, 10vw, 80px)', height: 'clamp(48px, 10vw, 80px)', objectFit: 'cover', borderRadius: 'clamp(6px, 1vw, 12px)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', margin: 0 }} className="line-clamp-1">{prod.title}</h4>
                        <span style={{ fontSize: 13, fontWeight: 900, color: '#60a5fa', display: 'block', marginTop: 2 }}>${prod.price.toFixed(2)}</span>
                        
                        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                          <button onClick={() => handleMoveToCart(prod)} style={{ border: 'none', background: 'none', color: '#10b981', fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 800, cursor: 'pointer', padding: 'clamp(4px, 1vw, 8px)' }}>
                            <span style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}>🛒</span> Move to Cart
                          </button>
                          <span style={{ color: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center' }}>|</span>
                          <button onClick={() => handleRemoveFromSaved(prod.id)} style={{ border: 'none', background: 'none', color: '#f87171', fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 800, cursor: 'pointer', padding: 'clamp(4px, 1vw, 8px)' }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frequently Bought Together / Recommendations container */}
            {frequentlyBought.length > 0 && (
              <div style={{ background: 'rgba(30, 41, 59, 0.15)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 24, padding: 24 }}>
                <Typography variant="subtitle2" style={{ fontWeight: 800, color: '#94a3b8', marginBottom: 14 }}>
                  🛒 Frequently Bought Together
                </Typography>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {frequentlyBought.map(p => (
                    <div key={p.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: 16, padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src={p.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"} alt={p.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: 12, fontWeight: 800, color: '#e2e8f0', margin: 0 }} className="line-clamp-1">{p.title}</h4>
                        <span style={{ fontSize: 12, fontWeight: 900, color: '#f59e0b', display: 'block', marginTop: 2 }}>${p.price.toFixed(2)}</span>
                      </div>
                      <button onClick={() => handleQuickAdd(p.id)} style={{ border: 'none', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderRadius: 8, padding: 'clamp(6px, 1vw, 8px) clamp(12px, 2vw, 16px)', fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Checkout & Credentials sidebar (Right) */}
          <div className="space-y-6">
            
            {/* Sticky Checkout Summary Card */}
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 28 }}>
              <Typography variant="h6" style={{ fontWeight: 900, color: '#f8fafc', marginBottom: 18 }}>Order Summary</Typography>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8' }}>
                  <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 && 's'})</span>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8' }}>
                  <span>Delivery</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8' }}>
                  <span>Estimated Tax (10%)</span>
                  <span style={{ fontWeight: 700, color: '#e2e8f0' }}>${tax.toFixed(2)}</span>
                </div>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc' }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 950, background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Secure Payment verified status pill */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: isPaymentConfigured ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                border: isPaymentConfigured ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)',
                padding: 'clamp(10px, 2vw, 14px) clamp(12px, 2.5vw, 16px)',
                borderRadius: '16px',
                marginBottom: 20
              }}>
                {isPaymentConfigured ? (
                  <>
                    <CheckCircle style={{ color: '#10b981', fontSize: 'clamp(16px, 3vw, 22px)' }} />
                    <span style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#34d399', fontWeight: 800 }}>Payment credentials active! 🔒</span>
                  </>
                ) : (
                  <>
                    <CreditCard style={{ color: '#f59e0b', fontSize: 'clamp(16px, 3vw, 22px)' }} />
                    <span style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#fbbf24', fontWeight: 800 }}>Save payment credentials below to unlock.</span>
                  </>
                )}
              </div>

              {/* Secure Checkout Button */}
              <button
                disabled={cartItems.length === 0}
                onClick={handleProceedToCheckout}
                style={{
                  width: '100%',
                  padding: 'clamp(14px, 2.5vw, 18px)',
                  borderRadius: '9999px',
                  border: 'none',
                  background: cartItems.length === 0
                    ? '#475569'
                    : isPaymentConfigured 
                      ? 'linear-gradient(135deg, #6366f1, #3b82f6)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: cartItems.length === 0 ? '#94a3b8' : '#fff',
                  fontWeight: 900,
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                  cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: (cartItems.length > 0 && isPaymentConfigured) ? '0 8px 30px rgba(99, 102, 241, 0.35)' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                {isPaymentConfigured ? (
                  <>
                    <ShoppingCartCheckout style={{ fontSize: 'clamp(18px, 3vw, 22px)' }} /> Proceed to Checkout
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 'clamp(18px, 3vw, 22px)' }}>🔒</span> Unlock Checkout
                  </>
                )}
              </button>

              {/* Trust badges list */}
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#94a3b8' }}>
                  <Shield style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', color: '#6366f1' }} />
                  <span>🔒 256-bit Encrypted SSL Secure Checkout</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(10px, 1.5vw, 12px)', color: '#94a3b8' }}>
                  <AssignmentReturn style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', color: '#3b82f6' }} />
                  <span>🛡️ 30-Day Refund Guarantee & Verified Sellers</span>
                </div>
              </div>

            </div>

            {/* Secure Payment Credentials input */}
            <div style={{ background: 'rgba(30, 41, 59, 0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <CreditCard style={{ color: '#6366f1' }} />
                <Typography variant="subtitle1" style={{ fontWeight: 800, color: '#f1f5f9' }}>Secure Payment Settings</Typography>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>Link your preferred card or bank credentials securely here so they are auto-applied on the checkout screen.</p>
              
              <form onSubmit={handleUpdateBankDetails} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Cardholder Name" 
                  value={bankDetails.cardHolderName || ''} 
                  onChange={e => setBankDetails({...bankDetails, cardHolderName: e.target.value})} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
                <TextField 
                  fullWidth 
                  size="small" 
                  label="Card Number" 
                  placeholder="0000 0000 0000 0000"
                  value={bankDetails.cardNumber || ''} 
                  onChange={e => setBankDetails({...bankDetails, cardNumber: e.target.value})} 
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                    '& .MuiInputLabel-root': { color: '#94a3b8' }
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <TextField 
                    size="small" 
                    label="Bank Name" 
                    placeholder="e.g. Chase"
                    value={bankDetails.bankName || ''} 
                    onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  />
                  <TextField 
                    size="small" 
                    label="Account Number" 
                    placeholder="ACC#"
                    value={bankDetails.accountNumber || ''} 
                    onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} 
                    sx={{ 
                      '& .MuiOutlinedInput-root': { borderRadius: '12px', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } },
                      '& .MuiInputLabel-root': { color: '#94a3b8' }
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={bankLoading}
                  style={{
                    width: '100%',
                    padding: 'clamp(12px, 2vw, 16px)',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 'clamp(12px, 2vw, 14px)',
                    cursor: bankLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  {bankLoading ? <CircularProgress size={16} color="inherit" /> : <><CheckCircle style={{ fontSize: 'clamp(16px, 2.5vw, 20px)' }} /> Save Credentials</>}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
