import React, { useState, useEffect } from 'react';
import {
  Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  Card, CardContent, CardMedia, IconButton, CircularProgress, Tabs, Tab, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Chip, Collapse, Divider, Alert, Snackbar
} from '@mui/material';
import { Add, Edit, Delete, ExpandMore, ExpandLess, Save, Storefront, ShoppingBag, AccountBalance } from '@mui/icons-material';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const statusColors = { PENDING: 'warning', PROCESSING: 'info', SHIPPED: 'primary', DELIVERED: 'success', CANCELLED: 'error' };

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const MyProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', category: '', imageUrl: '', tags: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/seller');
      setProducts(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleOpen = (product = null) => {
    if (product) {
      setEditId(product.id);
      setFormData({ title: product.title, description: product.description, price: product.price, category: product.category, imageUrl: product.imageUrl || '', tags: product.tags ? product.tags.join(', ') : '' });
      setImagePreview(product.imageUrl || null);
    } else {
      setEditId(null);
      setFormData({ title: '', description: '', price: '', category: '', imageUrl: '', tags: '' });
      setImagePreview(null);
    }
    setOpen(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setImageUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await api.post('/upload/image', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData(prev => ({ ...prev, imageUrl: res.data.url }));
    } catch (err) {
      setSnack({ open: true, msg: 'Image upload failed. Try again.', severity: 'error' });
      setImagePreview(null);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData, price: parseFloat(formData.price), tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editId) await api.put(`/products/${editId}`, payload);
      else await api.post('/products', payload);
      setOpen(false);
      fetchProducts();
      setSnack({ open: true, msg: editId ? 'Product updated!' : 'Product added!', severity: 'success' });
    } catch (e) {
      const errMsg = e.response?.data || e.response?.statusText || e.message || 'Unknown error';
      const status = e.response?.status;
      setSnack({ open: true, msg: `Error ${status}: ${errMsg}`, severity: 'error' });
      console.error('Product save error:', e.response);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
      setSnack({ open: true, msg: 'Product deleted.', severity: 'info' });
    } catch (e) { setSnack({ open: true, msg: 'Failed to delete.', severity: 'error' }); }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}
          sx={{ background: 'linear-gradient(45deg, #4f46e5, #9333ea)', borderRadius: '9999px', textTransform: 'none', px: 3 }}>
          Add Product
        </Button>
      </div>

      {loading ? <div className="flex justify-center py-12"><CircularProgress /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Card key={product.id} className="rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <CardMedia component="img" height="200"
                image={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'}
                alt={product.title} className="h-48 object-cover" />
              <CardContent>
                <div className="flex justify-between items-start">
                  <Typography variant="h6" className="font-bold truncate flex-1">{product.title}</Typography>
                  <Typography variant="h6" className="text-indigo-600 font-bold ml-2">${product.price}</Typography>
                </div>
                <Typography variant="body2" color="text.secondary" className="mt-1 h-10 overflow-hidden">{product.description}</Typography>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <Chip label={product.category} size="small" className="bg-gray-100 text-gray-600 font-semibold text-xs" />
                  <div>
                    <IconButton color="primary" onClick={() => handleOpen(product)} size="small"><Edit fontSize="small" /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product.id)} size="small"><Delete fontSize="small" /></IconButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400">
              <Storefront style={{ fontSize: 48 }} className="mb-3" />
              <Typography variant="h6" className="font-bold">No products yet</Typography>
              <Typography variant="body2" className="mt-1">Click "Add Product" to list your first item.</Typography>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle className="font-bold">{editId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent className="space-y-4 pt-2">
          <TextField fullWidth label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required margin="dense" />
          <TextField fullWidth label="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} multiline rows={3} margin="dense" />
          <div className="grid grid-cols-2 gap-4">
            <TextField fullWidth label="Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required margin="dense" />
            <FormControl fullWidth required margin="dense">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={formData.category}
                label="Category"
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Home">Home</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
                <MenuItem value="Toys">Toys</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="mt-2">
            <Typography variant="caption" className="text-gray-500 font-semibold uppercase tracking-wide">Product Image</Typography>
            <div className="mt-2 flex flex-col items-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50 hover:border-indigo-400 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-contain rounded-xl" />
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">🖼️</div>
                  <Typography variant="body2" className="text-gray-400">Click to select an image</Typography>
                </div>
              )}
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <Button
                  component="span"
                  variant="outlined"
                  size="small"
                  disabled={imageUploading}
                  sx={{ borderRadius: '9999px', textTransform: 'none' }}
                >
                  {imageUploading ? <><CircularProgress size={14} sx={{ mr: 1 }} /> Uploading...</> : (imagePreview ? '🔄 Change Image' : '📁 Choose Image')}
                </Button>
              </label>
            </div>
          </div>

          <TextField fullWidth label="Tags (comma separated)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} margin="dense" />
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ borderRadius: '9999px', textTransform: 'none', px: 3 }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({...snack, open: false})}>
        <Alert severity={snack.severity} onClose={() => setSnack({...snack, open: false})}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
};

const MySalesTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    api.get('/orders/seller-orders')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderTotal || 0), 0);

  if (loading) return <div className="flex justify-center py-12"><CircularProgress /></div>;

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow">
          <Typography variant="body2" className="opacity-75 mb-1">Total Orders</Typography>
          <Typography variant="h4" className="font-black">{orders.length}</Typography>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-5 text-white shadow">
          <Typography variant="body2" className="opacity-75 mb-1">Total Revenue</Typography>
          <Typography variant="h4" className="font-black">${totalRevenue.toFixed(2)}</Typography>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-300">
          <ShoppingBag style={{ fontSize: 48 }} className="mb-3" />
          <Typography variant="h6" className="font-bold">No sales yet</Typography>
          <Typography variant="body2" className="mt-1">Orders for your products will appear here.</Typography>
        </div>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #f3f4f6' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: '#f9fafb', color: '#374151' } }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Shipping Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Revenue</TableCell>
                <TableCell align="center">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <React.Fragment key={order.orderId}>
                  <TableRow hover sx={{ '& td': { borderBottom: expandedRow === order.orderId ? 'none' : undefined } }}>
                    <TableCell>
                      <Typography variant="body2" className="font-mono font-bold text-gray-700">
                        #{order.orderId?.slice(-6).toUpperCase()}
                      </Typography>
                      <Typography variant="caption" className="text-gray-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-700">{order.customerEmail}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600 max-w-xs truncate">{order.shippingAddress}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={order.status || 'PENDING'} color={statusColors[order.status] || 'default'} size="small" className="font-bold" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" className="font-black text-green-600">${order.orderTotal?.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => setExpandedRow(expandedRow === order.orderId ? null : order.orderId)}>
                        {expandedRow === order.orderId ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={6} sx={{ py: 0 }}>
                      <Collapse in={expandedRow === order.orderId} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2, bgcolor: '#f9fafb', borderRadius: 2, p: 2 }}>
                          <Typography variant="subtitle2" className="font-bold text-gray-600 mb-2">Ordered Items</Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>Product</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600, color: '#6b7280' }}>Qty</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#6b7280' }}>Unit Price</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600, color: '#6b7280' }}>Subtotal</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {order.sellerItems?.map((item, i) => (
                                <TableRow key={i}>
                                  <TableCell>{item.productTitle}</TableCell>
                                  <TableCell align="center">{item.quantity}</TableCell>
                                  <TableCell align="right">${item.priceAtPurchase?.toFixed(2)}</TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 700, color: '#16a34a' }}>${item.subtotal?.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

const BankDetailsTab = () => {
  const [form, setForm] = useState({ accountHolderName: '', accountNumber: '', bankName: '', ifscCode: '', upiId: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  useEffect(() => {
    api.get('/user/bank-details')
      .then(res => { if (res.data) setForm(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/bank-details', form);
      setSnack({ open: true, msg: 'Bank details saved successfully!', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, msg: 'Failed to save bank details.', severity: 'error' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-12"><CircularProgress /></div>;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 text-white mb-6 shadow-xl flex items-center gap-4">
        <AccountBalance style={{ fontSize: 40 }} />
        <div>
          <Typography variant="h6" className="font-black">Payout Bank Account</Typography>
          <Typography variant="body2" className="opacity-75">This is where your earnings will be transferred.</Typography>
        </div>
      </div>

      <Paper sx={{ borderRadius: 3, p: 4, boxShadow: 'none', border: '1px solid #f3f4f6' }}>
        <div className="space-y-4">
          <TextField
            fullWidth label="Account Holder Name" value={form.accountHolderName}
            onChange={e => setForm({...form, accountHolderName: e.target.value})}
            placeholder="As per bank records"
          />
          <TextField
            fullWidth label="Bank Name" value={form.bankName}
            onChange={e => setForm({...form, bankName: e.target.value})}
            placeholder="e.g. State Bank of India"
          />
          <TextField
            fullWidth label="Account Number" value={form.accountNumber}
            onChange={e => setForm({...form, accountNumber: e.target.value})}
            placeholder="Enter account number"
          />
          <TextField
            fullWidth label="IFSC Code" value={form.ifscCode}
            onChange={e => setForm({...form, ifscCode: e.target.value.toUpperCase()})}
            placeholder="e.g. SBIN0001234"
          />
          <Divider><Typography variant="caption" className="text-gray-400">OR</Typography></Divider>
          <TextField
            fullWidth label="UPI ID" value={form.upiId}
            onChange={e => setForm({...form, upiId: e.target.value})}
            placeholder="yourname@upi"
          />
        </div>

        <Button
          fullWidth variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}
          sx={{ mt: 4, borderRadius: '9999px', py: 1.5, textTransform: 'none', fontSize: '1rem',
            background: 'linear-gradient(45deg, #4f46e5, #9333ea)',
            '&:hover': { background: 'linear-gradient(45deg, #4338ca, #7e22ce)' }
          }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Bank Details'}
        </Button>
      </Paper>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({...snack, open: false})}>
        <Alert severity={snack.severity} onClose={() => setSnack({...snack, open: false})}>{snack.msg}</Alert>
      </Snackbar>
    </div>
  );
};

const SellerDashboard = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto w-full px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <Typography variant="h4" className="font-black text-gray-900">Seller Dashboard</Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">Manage your store, track orders, and update payout details.</Typography>
          </div>
          <Button variant="outlined" color="error" onClick={() => { logout(); navigate('/auth'); }} className="rounded-full">
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Paper sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #f3f4f6', mb: 4 }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            slotProps={{ indicator: { style: { background: 'linear-gradient(45deg, #4f46e5, #9333ea)', height: 3, borderRadius: 2 } } }}
            sx={{ px: 2, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' } }}
          >
            <Tab icon={<Storefront fontSize="small" />} iconPosition="start" label="My Products" />
            <Tab icon={<ShoppingBag fontSize="small" />} iconPosition="start" label="My Sales" />
            <Tab icon={<AccountBalance fontSize="small" />} iconPosition="start" label="Bank Details" />
          </Tabs>
        </Paper>

        <TabPanel value={tab} index={0}><MyProductsTab /></TabPanel>
        <TabPanel value={tab} index={1}><MySalesTab /></TabPanel>
        <TabPanel value={tab} index={2}><BankDetailsTab /></TabPanel>
      </div>
    </div>
  );
};

export default SellerDashboard;
