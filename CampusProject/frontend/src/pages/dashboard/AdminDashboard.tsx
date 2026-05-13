import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { productService } from '../../services/api'
import { LayoutDashboard, ShoppingCart, Users, BarChart3, Plus, Search, MoreHorizontal, Edit, Trash2, X, Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [formLoading, setFormLoading] = useState(false)
  const navigate = useNavigate()

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Compression',
    price: '',
    stock: ''
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('vexo_user')
    if (!savedUser || JSON.parse(savedUser).role !== 'ADMIN') {
      navigate('/login')
      return
    }

    fetchProducts()
  }, [navigate])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await productService.getAll()
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString()
      })
    } else {
      setEditingProduct(null)
      setFormData({ name: '', category: 'Compression', price: '', stock: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      }

      if (editingProduct) {
        const res = await productService.update(editingProduct.id.toString(), data)
        setProducts(products.map(p => p.id === editingProduct.id ? res.data : p))
      } else {
        const res = await productService.create(data)
        setProducts([...products, res.data])
      }
      setIsModalOpen(false)
    } catch (err) {
      alert('Failed to save product')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string | number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id.toString())
        setProducts(products.filter(p => p.id !== id))
      } catch (err) {
        alert('Failed to delete product')
      }
    }
  }

  return (
    <div className="bg-[#0F1112] min-h-screen text-white">
      <div className="flex h-screen relative">
        {/* Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-[#18181A] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none focus:border-white/30 transition-all"
                    placeholder="e.g. Apex Compression V2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none focus:border-white/30 transition-all appearance-none"
                    >
                      <option value="Compression">Compression</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Price (USD)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none focus:border-white/30 transition-all"
                      placeholder="120.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Initial Stock</label>
                  <input 
                    required
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none focus:border-white/30 transition-all"
                    placeholder="50"
                  />
                </div>

                <button 
                  disabled={formLoading}
                  className="w-full bg-white text-black h-16 rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {formLoading ? <Loader2 className="animate-spin" /> : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Admin Sidebar */}
        <div className="w-72 bg-black/50 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col h-full">
          <div className="mb-12">
            <h1 className="text-2xl font-black tracking-[-0.05em] uppercase">VEXO <span className="text-[#333]">ADMIN</span></h1>
          </div>

          <nav className="flex-1 space-y-1.5">
            {[
              { icon: LayoutDashboard, label: 'Overview', active: true },
              { icon: ShoppingCart, label: 'Inventory' },
              { icon: Users, label: 'Customers' },
              { icon: BarChart3, label: 'Analytics' },
            ].map((item) => (
              <button 
                key={item.label}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold tracking-widest text-[10px] uppercase transition-all ${item.active ? 'bg-white text-black text-shadow-none' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="mt-auto flex items-center gap-4 p-4 rounded-2xl font-bold tracking-widest text-[10px] uppercase text-red-500 hover:bg-red-500/10 transition-all"
          >
            Logout session
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#0F1112] p-12">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Inventory</h2>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Manage performance gear stock</p>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-3 bg-white text-black px-8 h-12 rounded-full font-black text-xs tracking-widest uppercase hover:scale-[1.02] transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Products', value: products.length },
              { label: 'Low Stock', value: products.filter(p => p.stock < 15).length, alert: products.some(p => p.stock < 15) },
              { label: 'Avg Price', value: '$' + (products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1)).toFixed(2) },
              { label: 'Stock Value', value: '$' + (products.reduce((acc, p) => acc + p.price * p.stock, 0) / 1000).toFixed(1) + 'K' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                <p className={`text-4xl font-black tracking-tight ${stat.alert ? 'text-orange-500' : 'text-white'}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Product Table */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH INVENTORY..." 
                  className="w-full bg-[#18181A] border border-white/5 h-12 pl-12 pr-4 rounded-xl text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <MoreHorizontal size={20} className="text-white/40" />
              </button>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Product Name</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Stock</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Price</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-xs font-bold tracking-widest text-white/20 uppercase">Syncing with server...</td></tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl"></div>
                        <p className="text-xs font-black tracking-tight">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full">{product.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className={`text-xs font-bold ${product.stock < 15 ? 'text-orange-500' : 'text-white/60'}`}>{product.stock} units</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold">USD {product.price}</p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-white text-black transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 bg-white/5 rounded-lg hover:bg-red-500 text-white transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
