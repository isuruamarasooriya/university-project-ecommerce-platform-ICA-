import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { userService } from '../../services/api'
import Navigation from '../../sections/Navigation'
import Footer from '../../sections/Footer'
import { Package, User, Settings, LogOut, ChevronRight } from 'lucide-react'

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('orders')
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('vexo_user')
    if (!savedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(savedUser))

    const fetchOrders = async () => {
      try {
        const res = await userService.getOrders()
        setOrders(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('vexo_token')
    localStorage.removeItem('vexo_user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="bg-[#D4E0E2] min-h-screen">
      <Navigation />
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-white rounded-[2rem] p-8 mb-6 border border-[#0F1112]/5 shadow-xl shadow-black/5 group hover:border-[#0F1112]/10 transition-all">
              <div className="w-16 h-16 bg-[#0F1112] text-white rounded-2xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-500">
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-black text-[#0F1112] uppercase tracking-tight leading-none mb-2">{user.name || user.email.split('@')[0]}</h2>
              <p className="text-[10px] font-bold text-[#0F1112]/40 tracking-[0.2em] uppercase">{user.email}</p>
            </div>

            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold tracking-widest text-[10px] uppercase transition-all ${activeTab === 'profile' ? 'bg-[#0F1112] text-white shadow-xl shadow-black/10' : 'bg-white text-[#0F1112] hover:bg-[#F5F8F9]'}`}
            >
              <User size={18} /> My Profile
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold tracking-widest text-[10px] uppercase transition-all ${activeTab === 'orders' ? 'bg-[#0F1112] text-white shadow-xl shadow-black/10' : 'bg-white text-[#0F1112] hover:bg-[#F5F8F9]'}`}
            >
              <Package size={18} /> My Orders
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold tracking-widest text-[10px] uppercase transition-all ${activeTab === 'settings' ? 'bg-[#0F1112] text-white shadow-xl shadow-black/10' : 'bg-white text-[#0F1112] hover:bg-[#F5F8F9]'}`}
            >
              <Settings size={18} /> Settings
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 bg-white text-red-500 p-4 rounded-2xl font-bold tracking-widest text-[10px] uppercase transition-all hover:bg-red-50"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-[#0F1112]/5 min-h-[500px]">
              
              {activeTab === 'orders' && (
                <>
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-[#0F1112] uppercase tracking-tight">Recent Orders</h3>
                  </div>

                  {loading ? (
                    <p className="text-sm font-bold text-[#0F1112]/40 uppercase tracking-widest">Loading orders...</p>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="group flex items-center justify-between p-6 rounded-2xl bg-[#F5F8F9] hover:bg-white hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-[#0F1112]/5">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                              <Package size={20} className="text-[#0F1112]" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-[#0F1112] uppercase tracking-tight">{order.id}</p>
                              <p className="text-[10px] font-bold text-[#0F1112]/40 uppercase tracking-widest mt-0.5">{order.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-12">
                            <div className="text-right hidden sm:block">
                              <p className="text-[10px] font-black text-[#0F1112]/40 uppercase tracking-widest mb-1">Status</p>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-[#0F1112]/40 uppercase tracking-widest mb-1">Total</p>
                              <p className="text-sm font-black text-[#0F1112]">USD {order.total.toFixed(2)}</p>
                            </div>
                            <ChevronRight className="text-[#0F1112]/20 group-hover:text-[#0F1112] transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-bold text-[#0F1112]/40 uppercase tracking-widest">No orders yet.</p>
                  )}
                </>
              )}

              {activeTab === 'profile' && (
                <>
                  <div className="mb-10">
                    <h3 className="text-2xl font-black text-[#0F1112] uppercase tracking-tight mb-2">My Profile</h3>
                    <p className="text-xs font-bold text-[#0F1112]/40 uppercase tracking-[0.2em]">Manage your personal athletic data</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-3">Display Name</label>
                        <div className="w-full h-14 bg-[#F5F8F9] rounded-2xl px-5 flex items-center text-sm font-bold text-[#0F1112]">
                          {user.name || user.email.split('@')[0]}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-3">Email Address</label>
                        <div className="w-full h-14 bg-[#F5F8F9] rounded-2xl px-5 flex items-center text-sm font-bold text-[#0F1112]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-3">Account Type</label>
                        <div className="w-full h-14 bg-[#F5F8F9] rounded-2xl px-5 flex items-center text-sm font-bold text-[#0F1112]">
                          {user.role} ATHLETE
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-3">Member Since</label>
                        <div className="w-full h-14 bg-[#F5F8F9] rounded-2xl px-5 flex items-center text-sm font-bold text-[#0F1112]">
                          MAY 2024
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'settings' && (
                <>
                  <div className="mb-10">
                    <h3 className="text-2xl font-black text-[#0F1112] uppercase tracking-tight mb-2">Account Settings</h3>
                    <p className="text-xs font-bold text-[#0F1112]/40 uppercase tracking-[0.2em]">Preferences and security</p>
                  </div>
                  
                  <div className="space-y-6 max-w-md">
                    <div className="flex items-center justify-between p-6 bg-[#F5F8F9] rounded-2xl">
                      <div>
                        <p className="text-xs font-black text-[#0F1112] uppercase tracking-tight">Order Notifications</p>
                        <p className="text-[10px] font-bold text-[#0F1112]/40 uppercase tracking-widest mt-1">Get updates on your gear</p>
                      </div>
                      <div className="w-12 h-6 bg-[#0F1112] rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-[#F5F8F9] rounded-2xl">
                      <div>
                        <p className="text-xs font-black text-[#0F1112] uppercase tracking-tight">Two-Factor Auth</p>
                        <p className="text-[10px] font-bold text-[#0F1112]/40 uppercase tracking-widest mt-1">Enhance account security</p>
                      </div>
                      <div className="w-12 h-6 bg-[#0F1112]/10 rounded-full relative p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full absolute left-1"></div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
