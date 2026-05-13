import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CircularProgress, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Select, MenuItem, Button,
  Tab, Tabs, Box, Avatar, IconButton, Tooltip
} from '@mui/material';
import {
  People, Inventory2, ShoppingBag, AttachMoney, TrendingUp,
  Delete, Edit, AdminPanelSettings, Store, Person, Logout,
  Dashboard, BarChart, Settings
} from '@mui/icons-material';
import {
  AreaChart, Area, BarChart as ReBarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const COLORS = ['#5B2EFF', '#00C6FF', '#10B981', '#F59E0B', '#EF4444'];

function StatCard({ icon: Icon, title, value, sub, color }) {
  return (
    <motion.div whileHover={{ y: -4 }}
      style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>{title}</p>
          <p style={{ fontSize: 28, fontWeight: 900, color: '#1E293B' }}>{value}</p>
          {sub && <p style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{ width: 48, height: 48, background: `${color}18`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ color, fontSize: 24 }} />
        </div>
      </div>
    </motion.div>
  );
}

const NAV_ITEMS = [
  { icon: Dashboard, label: 'Overview', idx: 0 },
  { icon: People, label: 'Users', idx: 1 },
  { icon: Inventory2, label: 'Products', idx: 2 },
  { icon: ShoppingBag, label: 'Orders', idx: 3 },
  { icon: BarChart, label: 'Analytics', idx: 4 },
];

export default function AdminDashboard() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, u, p, o] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/products'),
          api.get('/admin/orders'),
        ]);
        setStats(s.data); setUsers(u.data); setProducts(p.data); setOrders(o.data);
      } catch { toast.error('Failed to load admin data'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api.delete(`/admin/users/${id}`); setUsers(u => u.filter(x => x.id !== id)); toast.success('User deleted'); }
    catch { toast.error('Failed'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/admin/products/${id}`); setProducts(p => p.filter(x => x.id !== id)); toast.success('Product deleted'); }
    catch { toast.error('Failed'); }
  };

  const updateOrderStatus = async (id, status) => {
    try { await api.put(`/admin/orders/${id}/status`, { status }); setOrders(o => o.map(x => x.orderId === id ? { ...x, status } : x)); toast.success('Status updated'); }
    catch { toast.error('Failed'); }
  };

  const updateUserRole = async (id, role) => {
    try { await api.put(`/admin/users/${id}/role`, { role }); setUsers(u => u.map(x => x.id === id ? { ...x, roles: [role] } : x)); toast.success('Role updated'); }
    catch { toast.error('Failed'); }
  };

  const orderStatusData = stats?.orderStatuses ? Object.entries(stats.orderStatuses).map(([name, value]) => ({ name, value })) : [];

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <CircularProgress sx={{ color: '#5B2EFF' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#0F172A', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '28px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AdminPanelSettings style={{ color: '#fff', fontSize: 20 }} />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Admin Panel</div>
              <div style={{ color: '#64748B', fontSize: 11 }}>MultiVendor</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV_ITEMS.map(({ icon: Icon, label, idx }) => (
            <button key={idx} onClick={() => setTab(idx)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 4, background: tab === idx ? 'rgba(91,46,255,0.2)' : 'transparent', color: tab === idx ? '#7C4DFF' : '#94A3B8', fontWeight: tab === idx ? 700 : 500, fontSize: 14, transition: 'all 0.2s', textAlign: 'left' }}>
              <Icon fontSize="small" /> {label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => navigate('/products')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#94A3B8', fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
            <Store fontSize="small" /> View Store
          </button>
          <button onClick={() => { logout(); navigate('/auth'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#EF4444', fontWeight: 500, fontSize: 14 }}>
            <Logout fontSize="small" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ background: '#fff', padding: '20px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 22, color: '#1E293B' }}>{NAV_ITEMS[tab].label}</h1>
            <p style={{ color: '#64748B', fontSize: 13 }}>Welcome back, Administrator</p>
          </div>
          <Button onClick={async () => { try { await api.post('/admin/seed'); toast.success('50 products seeded! 🌱'); } catch { toast.error('Seed failed'); } }}
            variant="outlined" size="small" sx={{ borderRadius: '9999px', borderColor: '#5B2EFF', color: '#5B2EFF', fontWeight: 600 }}>
            Seed Sample Data
          </Button>
        </div>

        <div style={{ padding: 32 }}>
          {/* ── OVERVIEW ─────────────────────────── */}
          {tab === 0 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
                <StatCard icon={People} title="Total Users" value={stats?.totalUsers || 0} sub="Registered accounts" color="#5B2EFF" />
                <StatCard icon={Store} title="Vendors" value={stats?.totalVendors || 0} sub="Active sellers" color="#7C4DFF" />
                <StatCard icon={Inventory2} title="Products" value={stats?.totalProducts || 0} sub="Listed items" color="#00C6FF" />
                <StatCard icon={ShoppingBag} title="Orders" value={stats?.totalOrders || 0} sub="All time" color="#10B981" />
                <StatCard icon={AttachMoney} title="Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(0)}`} sub="Total earnings" color="#F59E0B" />
              </div>

              {/* Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20, color: '#1E293B' }}>Monthly Revenue</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={stats?.monthlyRevenue || []}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#5B2EFF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#5B2EFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ReTooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#5B2EFF" fill="url(#rev)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20, color: '#1E293B' }}>Order Status</h3>
                  {orderStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {orderStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240, color: '#94A3B8' }}>No order data yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ─────────────────────────────── */}
          {tab === 1 && (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #F1F5F9' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, background: '#F8FAFC', color: '#64748B', fontSize: 12, textTransform: 'uppercase' } }}>
                    <TableCell>User</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u.id} hover>
                      <TableCell><Avatar sx={{ width: 32, height: 32, bgcolor: '#5B2EFF', fontSize: 13 }}>{u.email[0].toUpperCase()}</Avatar></TableCell>
                      <TableCell sx={{ fontSize: 14, fontWeight: 500 }}>{u.email}</TableCell>
                      <TableCell>
                        <Select size="small" value={u.roles?.[0] || 'CUSTOMER'} onChange={e => updateUserRole(u.id, e.target.value)} sx={{ fontSize: 12, borderRadius: '9999px', minWidth: 120 }}>
                          {['CUSTOMER','SELLER','ADMIN'].map(r => <MenuItem key={r} value={r} sx={{ fontSize: 12 }}>{r}</MenuItem>)}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => deleteUser(u.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* ── PRODUCTS ──────────────────────────── */}
          {tab === 2 && (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #F1F5F9' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, background: '#F8FAFC', color: '#64748B', fontSize: 12, textTransform: 'uppercase' } }}>
                    <TableCell>Product</TableCell><TableCell>Category</TableCell><TableCell>Brand</TableCell><TableCell>Price</TableCell><TableCell>Stock</TableCell><TableCell>Rating</TableCell><TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map(p => (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.imageUrl} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                          <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 180, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.title}</span>
                        </div>
                      </TableCell>
                      <TableCell><Chip label={p.category} size="small" sx={{ fontSize: 11, fontWeight: 600 }} /></TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{p.brand}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#5B2EFF' }}>${p.price}</TableCell>
                      <TableCell><Chip label={p.stock > 0 ? p.stock : 'Out'} size="small" color={p.stock > 0 ? 'success' : 'error'} /></TableCell>
                      <TableCell sx={{ fontSize: 13 }}>⭐ {p.rating || '—'}</TableCell>
                      <TableCell>
                        <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => deleteProduct(p.id)}><Delete fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* ── ORDERS ────────────────────────────── */}
          {tab === 3 && (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #F1F5F9' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 700, background: '#F8FAFC', color: '#64748B', fontSize: 12, textTransform: 'uppercase' } }}>
                    <TableCell>Order ID</TableCell><TableCell>Customer</TableCell><TableCell>Total</TableCell><TableCell>Status</TableCell><TableCell>Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8, color: '#94A3B8' }}>No orders yet. Customers need to place orders first.</TableCell></TableRow>
                  ) : orders.map(o => (
                    <TableRow key={o.orderId} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 700 }}>#{o.orderId?.slice(-6).toUpperCase()}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{o.customerEmail}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#10B981' }}>${o.orderTotal?.toFixed(2)}</TableCell>
                      <TableCell><Chip label={o.status || 'PENDING'} size="small" color={{ PENDING:'warning', PROCESSING:'info', SHIPPED:'primary', DELIVERED:'success', CANCELLED:'error' }[o.status] || 'default'} /></TableCell>
                      <TableCell>
                        <Select size="small" value={o.status || 'PENDING'} onChange={e => updateOrderStatus(o.orderId, e.target.value)} sx={{ fontSize: 11, borderRadius: '9999px', minWidth: 130 }}>
                          {['PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>{s}</MenuItem>)}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* ── ANALYTICS ─────────────────────────── */}
          {tab === 4 && (
            <div style={{ display: 'grid', gap: 24 }}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #F1F5F9' }}>
                <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Revenue Trend (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ReBarChart data={stats?.monthlyRevenue || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ReTooltip formatter={v => [`$${v}`, 'Revenue']} />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {(stats?.monthlyRevenue || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
                <StatCard icon={TrendingUp} title="Avg Order Value" value={`$${stats?.totalOrders ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0'}`} color="#5B2EFF" />
                <StatCard icon={People} title="Conversion Rate" value="3.2%" sub="+0.8% this month" color="#10B981" />
                <StatCard icon={ShoppingBag} title="Return Rate" value="2.1%" sub="Below avg" color="#F59E0B" />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
