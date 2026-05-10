import React, { useState } from 'react';
import { Typography, Stepper, Step, StepLabel, Button, TextField, CircularProgress, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { CheckCircleOutlined } from '@mui/icons-material';

const steps = ['Shipping Address', 'Payment Details', 'Review your order'];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [shippingAddress, setShippingAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleNext = async () => {
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
      await api.post('/orders/checkout', { shippingAddress, paymentMethod: 'Credit Card' });
      setActiveStep(steps.length);
    } catch (error) {
      console.error("Error placing order", error);
      alert(error.response?.data || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 py-4">
            <Typography variant="h6" className="font-bold text-gray-800 mb-4">Shipping Information</Typography>
            <TextField
              required
              id="address"
              name="address"
              label="Full Address"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 py-4">
            <Typography variant="h6" className="font-bold text-gray-800 mb-4">Payment Method</Typography>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl shadow-xl text-white mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
              <Typography variant="subtitle2" className="text-gray-400 mb-1">Card Number</Typography>
              <TextField
                required
                fullWidth
                variant="standard"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                slotProps={{ input: { className: "text-white text-xl tracking-widest before:border-b-white/20 hover:before:border-b-white/50 after:border-b-indigo-400" } }}
              />
              <div className="flex gap-8 mt-6">
                <div className="flex-1">
                  <Typography variant="subtitle2" className="text-gray-400 mb-1">Expiry Date</Typography>
                  <TextField
                    required
                    fullWidth
                    variant="standard"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    slotProps={{ input: { className: "text-white tracking-widest before:border-b-white/20 hover:before:border-b-white/50 after:border-b-indigo-400" } }}
                  />
                </div>
                <div className="flex-1">
                  <Typography variant="subtitle2" className="text-gray-400 mb-1">CVV</Typography>
                  <TextField
                    required
                    fullWidth
                    variant="standard"
                    placeholder="123"
                    type="password"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    slotProps={{ input: { className: "text-white tracking-widest before:border-b-white/20 hover:before:border-b-white/50 after:border-b-indigo-400" } }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 py-4 text-center">
            <Typography variant="h6" className="font-bold text-gray-800 mb-2">Order Confirmation</Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              Please confirm your details before placing the order.
            </Typography>
            <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100">
              <Typography variant="subtitle2" className="font-bold text-gray-800">Shipping To:</Typography>
              <Typography variant="body2" className="text-gray-600 mb-4">{shippingAddress}</Typography>
              
              <Typography variant="subtitle2" className="font-bold text-gray-800">Payment Method:</Typography>
              <Typography variant="body2" className="text-gray-600">Card ending in {cardNumber.slice(-4) || 'XXXX'}</Typography>
            </div>
          </div>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        
        <Paper className="p-8 rounded-3xl shadow-sm border border-gray-100">
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
                    <Button onClick={handleBack} className="rounded-full" sx={{ mr: 1 }}>
                      Back
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    className="bg-gray-900 hover:bg-indigo-600 rounded-full px-8 shadow-md"
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
