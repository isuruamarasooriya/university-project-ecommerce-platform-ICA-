import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { authService } from '../services/api'
import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authService.login({ email, password })
      localStorage.setItem('vexo_token', res.data.token)
      localStorage.setItem('vexo_user', JSON.stringify(res.data.user))
      
      if (res.data.user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#D4E0E2] min-h-screen">
      <Navigation />
      <div className="pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tight text-[#0F1112] uppercase mb-2">Sign In</h1>
            <p className="text-sm font-medium text-[#0F1112]/60 uppercase tracking-widest">Welcome back to VEXO</p>
          </div>

          <div className="mb-6 p-4 bg-[#F5F8F9] rounded-2xl border border-[#0F1112]/5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0F1112]/40 mb-3">Demo Credentials</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#0F1112]/60 uppercase">Admin: admin@vexo.com</span>
                <span className="text-[10px] font-bold text-[#0F1112]">admin123</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#0F1112]/60 uppercase">User: user@vexo.com</span>
                <span className="text-[10px] font-bold text-[#0F1112]">user123</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 bg-[#F5F8F9] rounded-xl px-4 text-sm font-bold border border-transparent focus:border-[#0F1112]/20 focus:bg-white outline-none transition-all"
                placeholder="athlete@vexo.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-[#F5F8F9] rounded-xl px-4 text-sm font-bold border border-transparent focus:border-[#0F1112]/20 focus:bg-white outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-xs font-bold uppercase text-center">{error}</p>}

            <button 
              disabled={loading}
              className="w-full h-14 bg-[#0F1112] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>SIGN IN <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#0F1112]/5 text-center">
            <p className="text-xs font-bold text-[#0F1112]/60 uppercase tracking-widest">
              New to VEXO? <Link to="/signup" className="text-[#0F1112] hover:underline">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
