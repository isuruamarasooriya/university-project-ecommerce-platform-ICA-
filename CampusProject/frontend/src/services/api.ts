import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept for Auth Token (demo/local)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vexo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  signup: (data: any) => api.post('/auth/signup', data),
};

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  getByCategory: (category: string) => api.get(`/products/category/${category}`),
  getByTag: (tag: string) => api.get(`/products/tag/${tag}`),
  search: (keyword: string) => api.get(`/products/search?keyword=${keyword}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  getByEmail: (email: string) => api.get(`/orders/email/${email}`),
  getByStatus: (status: string) => api.get(`/orders/status/${status}`),
  create: (data: any) => api.post('/orders', data),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status?status=${status}`),
  delete: (id: string) => api.delete(`/orders/${id}`),
};

export const userService = {
  getOrders: () => api.get('/user/orders'),
};

export default api;
