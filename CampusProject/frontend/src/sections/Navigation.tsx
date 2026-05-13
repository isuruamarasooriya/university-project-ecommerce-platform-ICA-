import { useEffect, useState } from 'react'
import { ShoppingBag, X, Menu } from 'lucide-react'
import { Link } from 'react-router'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled || isMobileMenuOpen ? 'bg-[#D4E0E2]/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Left Menu Button */}
            <div className="flex items-center gap-4 relative z-10 flex-1">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-[#0F1112] p-2 hover:opacity-70 transition-opacity -ml-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Center Logo with Notch Effect */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 z-20">
              <Link to="/" className="nav-notch flex items-center justify-center" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-xl font-bold tracking-[0.15em] text-[#0F1112]">
                  VEXO
                </span>
              </Link>
            </div>

            {/* Right Cart */}
            <div className="flex items-center justify-end gap-4 relative z-10 flex-1">
              <Link to="/cart" className="w-9 h-9 shrink-0 rounded-full border border-[#0F1112] flex items-center justify-center hover:bg-[#0F1112] hover:text-white transition-colors relative z-20">
                <ShoppingBag size={15} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#D4E0E2] z-[90] transition-transform duration-500 ease-in-out flex flex-col pt-32 px-6 pb-12 overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col justify-center items-center gap-8 text-3xl md:text-5xl font-black tracking-[-0.02em] flex-1">
          {['SHOP', 'MEN', 'WOMEN', 'TRENDING', 'SEASONAL', 'ACCESSORIES'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-[#0F1112] hover:opacity-50 transition-all hover:scale-110"
            >
              {item}
            </Link>
          ))}
        </div>
        <div className="mt-auto pt-8 flex flex-col items-center gap-4">
           {localStorage.getItem('vexo_token') ? (
             <Link 
               to={JSON.parse(localStorage.getItem('vexo_user') || '{}').role === 'ADMIN' ? '/admin' : '/dashboard'}
               onClick={() => setIsMobileMenuOpen(false)}
               className="text-base font-bold tracking-[0.05em] bg-[#0F1112] text-white px-8 py-4 rounded-full flex items-center justify-center hover:bg-[#333] transition-colors w-full max-w-sm"
             >
               DASHBOARD
             </Link>
           ) : (
             <Link 
               to="/login"
               onClick={() => setIsMobileMenuOpen(false)}
               className="text-base font-bold tracking-[0.05em] bg-[#111] text-white px-8 py-4 rounded-full flex items-center justify-center hover:bg-[#333] transition-colors w-full max-w-sm"
             >
               SIGN IN / UP
             </Link>
           )}
        </div>
      </div>
    </>
  )
}
