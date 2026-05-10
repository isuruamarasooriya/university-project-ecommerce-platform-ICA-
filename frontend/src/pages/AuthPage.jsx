import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { email, password });
        const { token, role } = response.data;

        login(token, role);
        
        if (role === 'ADMIN') navigate('/admin-dashboard');
        else if (role === 'SELLER') navigate('/seller-dashboard');
        else navigate('/products');
        
      } else {
        await api.post('/auth/register', { 
          email, 
          password, 
          roles: [role] 
        });
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 transition-all duration-500 transform hover:scale-[1.02]">
          
          <Typography variant="h4" className="text-center font-bold text-white mb-2 drop-shadow-lg">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <Typography variant="body2" className="text-center text-gray-300 mb-8">
            {isLogin ? 'Enter your credentials to access your account' : 'Join our multi-vendor platform today'}
          </Typography>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              slotProps={{
                input: { className: "text-white bg-white/5 rounded-xl" },
                inputLabel: { className: "text-gray-400" },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{
                input: { className: "text-white bg-white/5 rounded-xl" },
                inputLabel: { className: "text-gray-400" },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                },
              }}
            />

            {!isLogin && (
              <FormControl fullWidth sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#818cf8' },
                },
                '& .MuiSvgIcon-root': { color: 'white' }
              }}>
                <InputLabel className="text-gray-400">Register as</InputLabel>
                <Select
                  value={role}
                  label="Register as"
                  onChange={(e) => setRole(e.target.value)}
                  className="text-white bg-white/5 rounded-xl"
                >
                  <MenuItem value="CUSTOMER">Customer</MenuItem>
                  <MenuItem value="SELLER">Seller</MenuItem>
                </Select>
              </FormControl>
            )}

            {error && (
              <Typography variant="body2" className="text-red-400 text-center bg-red-900/30 py-2 rounded-lg border border-red-500/30">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              className="py-3 rounded-xl font-bold tracking-wide transition-all duration-300"
              sx={{
                background: 'linear-gradient(45deg, #4f46e5 30%, #9333ea 90%)',
                color: 'white',
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px 0 rgba(79, 70, 229, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4338ca 30%, #7e22ce 90%)',
                  boxShadow: '0 6px 20px 0 rgba(79, 70, 229, 0.6)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <Typography variant="body2" className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span 
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-400 cursor-pointer font-semibold hover:text-indigo-300 hover:underline transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </span>
            </Typography>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
