import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { authService } from '../services/api'
import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.signup({ name, email, password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[#D4E0E2] min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[3rem] p-12 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#0F1112] mb-4">Account Created</h1>
          <p className="text-sm font-bold text-[#0F1112]/50 uppercase tracking-widest leading-relaxed">
            Welcome to the elite tier of performance athletes. Redirecting you to sign in...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#D4E0E2] min-h-screen">
      <Navigation />
      <div className="pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 lg:p-14 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 hover:text-[#0F1112] transition-colors mb-10 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to sign in
            </Link>
            
            <div className="mb-10">
              <h1 className="text-4xl font-black tracking-[-0.03em] text-[#0F1112] uppercase mb-3">Join the Elite</h1>
              <p className="text-xs font-bold text-[#0F1112]/40 uppercase tracking-[0.2em]">Unlock exclusive performance gear & tracking</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-3">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-14 bg-[#F5F8F9] rounded-2xl px-5 text-sm font-bold border-2 border-transparent focus:border-[#0F1112]/10 focus:bg-white outline-none transition-all placeholder:text-[#0F1112]/20"
                    placeholder="WENURA C."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-3">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-14 bg-[#F5F8F9] rounded-2xl px-5 text-sm font-bold border-2 border-transparent focus:border-[#0F1112]/10 focus:bg-white outline-none transition-all placeholder:text-[#0F1112]/20"
                    placeholder="ATHLETE@VEXO.COM"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F1112]/40 mb-3">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-14 bg-[#F5F8F9] rounded-2xl px-5 text-sm font-bold border-2 border-transparent focus:border-[#0F1112]/10 focus:bg-white outline-none transition-all placeholder:text-[#0F1112]/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={loading}
                  className="w-full h-16 bg-[#0F1112] text-white rounded-2xl font-black text-sm tracking-[0.1em] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-[#0F1112]/10 group disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>CREATE ACCOUNT <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
              </div>
            </form>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EBF0F1] rounded-full -translate-y-1/2 translate-x-1/2 z-0 opacity-50"></div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
