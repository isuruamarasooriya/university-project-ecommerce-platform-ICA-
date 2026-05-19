import React, { useState } from 'react';
import { Typography, Stepper, Step, StepLabel, Button, TextField, CircularProgress, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleOutlined, CreditCard, AccountBalance, Payments, ArrowBack } from '@mui/icons-material';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

// Simple SVG for PayPal
const PayPalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.07 6.85c.13.78.02 1.62-.35 2.37-.53 1.08-1.57 1.83-2.73 1.98l-.12.02h-4.32l-.99 6.27-.03.16c-.05.3-.3.51-.6.51H7.81c-.2 0-.37-.12-.44-.3l-.8-2.61L5.3 6.94l-.03-.13c-.05-.3.2-.57.5-.57h6.63c1.2 0 2.27.36 3.1 1.06.84.7 1.34 1.7 1.47 2.87.05.3.06.6.04.9-.11 1.35-.91 2.45-2.07 2.92.23.14.44.33.62.56l3.83 4.79c.14.18.22.4.22.63 0 .55-.45 1-.99 1h-2.18c-.29 0-.57-.13-.76-.36l-3.32-4.15h-1.92l-.99 6.27-.03.16c-.05.3-.3.51-.6.51H7.81c-.34 0-.61-.26-.64-.6L5.03 5.48c-.05-.3.2-.57.5-.57h6.63c1.9 0 3.51.98 4.27 2.46l.08.15c.67.62 1.15 1.45 1.36 2.39z" fill="currentColor"/>
  </svg>
);

const steps = ['Shipping Address', 'Payment Details', 'Review your order'];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [shippingAddress, setShippingAddress] = useState('');
  
  // Payment Type
  const [paymentMethod, setPaymentMethod] = useState('Credit Card'); // 'Credit Card', 'PayPal', 'Bank Transfer', 'COD'
  
  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // PayPal State
  const [paypalEmail, setPaypalEmail] = useState('');

  const handleNext = async () => {
    if (activeStep === 0 && !shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }
    if (activeStep === 1) {
      if (paymentMethod === 'Credit Card' && (!cardNumber || !expiry || !cvv || !cardHolder)) {
        toast.error('Please complete all card details');
        return;
      }
      if (paymentMethod === 'PayPal' && !paypalEmail.trim()) {
        toast.error('Please enter your PayPal email');
        return;
      }
    }

    if (activeStep === steps.length - 1) {
      await placeOrder();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      await api.post('/orders/checkout', { shippingAddress, paymentMethod });
      setActiveStep(steps.length);
      toast.success("Order placed successfully! 🎉");
    } catch (error) {
      console.error("Error placing order", error);
      toast.error(error.response?.data || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-4 py-4">
            <Typography variant="h6" className="font-bold text-gray-800 mb-4">Shipping Information</Typography>
            <TextField
              required
              id="address"
              name="address"
              label="Full Address"
              fullWidth
              multiline
              rows={4}
              placeholder="123 Main St, Apartment 4B, New York, NY 10001"
              variant="outlined"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
            />
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-6 py-4">
            <Typography variant="h6" className="font-bold text-gray-800">Select Payment Method</Typography>
            
            {/* Elegant Tab Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { id: 'Credit Card', label: 'Card', icon: CreditCard, color: '#5B2EFF' },
                { id: 'PayPal', label: 'PayPal', icon: PayPalIcon, color: '#003087' },
                { id: 'Bank Transfer', label: 'Bank', icon: AccountBalance, color: '#10B981' },
                { id: 'COD', label: 'COD', icon: Payments, color: '#EC4899' },
              ].map((method) => {
                const IconComponent = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '16px',
                      border: `2px solid ${isSelected ? method.color : '#E2E8F0'}`,
                      background: isSelected ? `${method.color}0A` : '#fff',
                      color: isSelected ? method.color : '#64748B',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s',
                    }}
                    className="hover:border-indigo-400 hover:shadow-sm"
                  >
                    <IconComponent style={{ fontSize: 24 }} />
                    {method.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Forms based on selection */}
            <AnimatePresence mode="wait">
              {paymentMethod === 'Credit Card' && (
                <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {/* Premium Credit Card Visualization */}
                  <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)', color: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(91,46,255,0.15)', position: 'relative', overflow: 'hidden' }} className="mb-6 max-w-sm mx-auto">
                    <div style={{ position: 'absolute', width: 200, height: 200, top: -50, right: -50, background: 'linear-gradient(135deg, #5B2EFF, #00C6FF)', borderRadius: '50%', opacity: 0.2, filter: 'blur(30px)' }} />
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <Typography variant="caption" className="text-gray-400 font-bold uppercase tracking-wider">Credit Card</Typography>
                        <Typography variant="h6" className="font-extrabold text-white tracking-widest mt-1">MultiVendor Pay</Typography>
                      </div>
                      <CreditCard style={{ fontSize: 36, opacity: 0.8 }} />
                    </div>

                    <div className="mb-6">
                      <span className="text-gray-400 text-xs tracking-wider block mb-1">CARD NUMBER</span>
                      <Typography variant="h6" className="font-bold tracking-widest text-white">
                        {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                      </Typography>
                    </div>

                    <div className="flex justify-between">
                      <div>
                        <span className="text-gray-400 text-xs tracking-wider block mb-1">CARD HOLDER</span>
                        <Typography variant="subtitle1" className="font-bold text-white uppercase truncate max-w-[180px]">
                          {cardHolder || 'Your Name'}
                        </Typography>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs tracking-wider block mb-1">EXPIRES</span>
                        <Typography variant="subtitle1" className="font-bold text-white tracking-wider">
                          {expiry || 'MM/YY'}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="space-y-4 max-w-md mx-auto">
                    <TextField fullWidth label="Cardholder Name" variant="outlined" value={cardHolder} onChange={e => setCardHolder(e.target.value)} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    <TextField fullWidth label="Card Number" placeholder="16-Digit Card Number" inputProps={{ maxLength: 16 }} value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    <div className="grid grid-cols-2 gap-4">
                      <TextField label="Expiry Date" placeholder="MM/YY" inputProps={{ maxLength: 5 }} value={expiry} onChange={e => setExpiry(e.target.value)} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                      <TextField label="CVV" placeholder="123" type="password" inputProps={{ maxLength: 3 }} value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'PayPal' && (
                <motion.div key="paypal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-md mx-auto">
                  <div style={{ background: '#F0F4FC', border: '1px solid #D2E3FC', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, background: '#D2E3FC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#003087' }}>
                      <PayPalIcon />
                    </div>
                    <Typography variant="h6" className="font-extrabold text-blue-900 mb-2">PayPal Instant Checkout</Typography>
                    <p className="text-sm text-blue-700/80 mb-6">Log in to your PayPal account to finalize payment during the next step.</p>
                    <TextField fullWidth type="email" label="PayPal Email Address" placeholder="yourname@domain.com" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <motion.div key="bank" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-md mx-auto">
                  <div style={{ border: '1px dashed #10B981', background: '#ECFDF5', borderRadius: '20px', padding: '24px' }}>
                    <div className="flex items-center gap-3 mb-4">
                      <AccountBalance className="text-emerald-600" />
                      <Typography variant="h6" className="font-bold text-emerald-900">Direct Bank Transfer</Typography>
                    </div>
                    <p className="text-sm text-emerald-700/80 mb-4">Please transfer the total amount to our verified bank account details below. Your order will process once payment is confirmed.</p>
                    <div className="bg-white p-4 rounded-xl space-y-2 border border-emerald-100 font-mono text-sm text-gray-700">
                      <div><strong className="text-gray-900 font-sans">Bank:</strong> MultiVendor Capital Union</div>
                      <div><strong className="text-gray-900 font-sans">Account Name:</strong> MultiVendor INC</div>
                      <div><strong className="text-gray-900 font-sans">Account No:</strong> 9940-2394-1102-4820</div>
                      <div><strong className="text-gray-900 font-sans">Routing No:</strong> 021000021</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {paymentMethod === 'COD' && (
                <motion.div key="cod" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-md mx-auto">
                  <div style={{ border: '1px dashed #EC4899', background: '#FDF2F8', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, background: '#FCE7F3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EC4899' }}>
                      <Payments style={{ fontSize: 32 }} />
                    </div>
                    <Typography variant="h6" className="font-bold text-pink-900 mb-2">Cash on Delivery (COD)</Typography>
                    <p className="text-sm text-pink-700/80">Pay with physical cash upon receiving your order at your shipping address. Please make sure to prepare the exact amount.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="space-y-4 py-4 text-center">
            <Typography variant="h6" className="font-bold text-gray-800 mb-2">Order Confirmation</Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              Please confirm your details before placing the order.
            </Typography>
            <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100 max-w-md mx-auto space-y-4">
              <div>
                <Typography variant="subtitle2" className="font-bold text-gray-800">Shipping To:</Typography>
                <Typography variant="body2" className="text-gray-600">{shippingAddress}</Typography>
              </div>
              
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                <Typography variant="subtitle2" className="font-bold text-gray-800">Payment Method:</Typography>
                <Typography variant="body2" className="text-gray-600 flex items-center gap-2 mt-1">
                  {paymentMethod === 'Credit Card' && <>💳 Card (ending in {cardNumber.slice(-4) || 'XXXX'})</>}
                  {paymentMethod === 'PayPal' && <>🔵 PayPal ({paypalEmail})</>}
                  {paymentMethod === 'Bank Transfer' && <>🏦 Direct Bank Transfer</>}
                  {paymentMethod === 'COD' && <>💵 Cash on Delivery (COD)</>}
                </Typography>
              </div>
            </div>
          </motion.div>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        
        <Paper className="p-8 rounded-3xl shadow-sm border border-gray-100 bg-white">
          <Typography component="h1" variant="h4" align="center" className="font-black text-gray-900 mb-8">
            Checkout
          </Typography>
          
          <Stepper activeStep={activeStep} className="mb-8" alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <React.Fragment>
            {activeStep === steps.length ? (
              <div className="text-center py-12">
                <CheckCircleOutlined className="text-green-500 w-24 h-24 mx-auto mb-4" />
                <Typography variant="h5" gutterBottom className="font-bold text-gray-900">
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1" className="text-gray-600 mb-8">
                  Your order number is #{Math.floor(Math.random() * 1000000)}. We have emailed your order confirmation, and will send you an update when your order has shipped.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/products')} className="rounded-full px-8 bg-gray-900 hover:bg-indigo-600">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, pt: 3, borderTop: '1px solid #f3f4f6' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className="rounded-full" sx={{ mr: 1, textTransform: 'none', fontWeight: 600 }}>
                      Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    className="bg-gray-900 hover:bg-indigo-600 rounded-full px-8 shadow-md"
                    sx={{ borderRadius: '9999px', px: 4, py: 1, textTransform: 'none', fontWeight: 700 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (activeStep === steps.length - 1 ? 'Place Order' : 'Next')}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>

      </div>
    </div>
  );
};

export default CheckoutPage;
