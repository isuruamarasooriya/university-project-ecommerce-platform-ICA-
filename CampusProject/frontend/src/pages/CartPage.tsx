import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, Trash2, ArrowRight } from 'lucide-react'

import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import { useCart } from '../context/CartContext'

gsap.registerPlugin(ScrollTrigger)

export default function CartPage() {
  const lenisRef = useRef<Lenis | null>(null)
  const { items, removeItem, updateQuantity, cartTotal } = useCart()

  useEffect(() => {
    const initLenis = () => {
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
      lenisRef.current = lenis
      lenis.on('scroll', () => ScrollTrigger.update())
      const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
    }
    if (document.readyState === 'complete') initLenis()
    else window.addEventListener('load', initLenis)

    return () => {
      window.removeEventListener('load', initLenis)
      if (lenisRef.current) lenisRef.current.destroy()
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    gsap.fromTo('.cart-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' })
  }, [])

  return (
    <div className="relative">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-[80vh]">
        <div className="mb-8 flex items-center gap-2 cart-reveal">
          <Link to="/shop" className="text-sm font-bold text-[#0F1112]/50 hover:text-[#0F1112] transition-colors flex items-center gap-1">
            <ChevronLeft size={16} /> CONTINUE SHOPPING
          </Link>
        </div>

        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0F1112] tracking-[-0.02em] uppercase mb-12 cart-reveal">
          YOUR CART
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-2 flex flex-col gap-8 cart-reveal">
            {items.length === 0 ? (
              <div className="py-12 border-t border-[#0F1112]/10 text-center">
                <p className="text-lg font-medium text-[#0F1112]/60 mb-6">Your cart is empty.</p>
                <Link to="/shop" className="bg-[#111] text-white text-sm font-bold tracking-[0.05em] px-8 py-3 rounded-full hover:bg-[#333] transition-colors inline-block">
                  START SHOPPING
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-6 border-b border-[#0F1112]/10 pb-8">
                  <div className="w-32 h-40 shrink-0 rounded-2xl overflow-hidden bg-[#EBF0F1]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold tracking-[0.02em] text-[#0F1112]">{item.name}</h3>
                        <p className="text-lg font-bold text-[#0F1112]">{item.price}</p>
                      </div>
                      <p className="text-sm font-medium text-[#0F1112]/60 mb-2">Color: {item.color} | Size: {item.size}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 bg-[#EBF0F1] px-4 py-2 rounded-full">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#0F1112] hover:text-[#0F1112]/50 transition-colors">-</button>
                        <span className="text-sm font-bold text-[#0F1112]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#0F1112] hover:text-[#0F1112]/50 transition-colors">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-[#0F1112]/50 hover:text-red-500 transition-colors p-2 flex items-center gap-2 text-sm font-bold tracking-[0.05em]">
                        <Trash2 size={16} /> REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-reveal">
            <div className="bg-[#EBF0F1] rounded-3xl p-8 sticky top-32">
              <h3 className="text-xl font-bold tracking-[0.02em] text-[#0F1112] mb-6 border-b border-[#0F1112]/10 pb-4">ORDER SUMMARY</h3>
              <div className="space-y-4 text-sm font-medium text-[#0F1112]/70 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#0F1112]">USD {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#0F1112]">{cartTotal > 0 ? 'Calculated at checkout' : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-[#0F1112]">{cartTotal > 0 ? 'Calculated at checkout' : '-'}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-[#0F1112]/10 pt-6 mb-8">
                <span className="text-base font-bold text-[#0F1112]">Estimated Total</span>
                <span className="text-xl font-bold text-[#0F1112]">USD {cartTotal.toFixed(2)}</span>
              </div>
              <Link to={items.length > 0 ? "/checkout" : "#"} onClick={(e) => items.length === 0 && e.preventDefault()} className={`w-full text-white text-sm font-bold tracking-[0.05em] px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 ${items.length > 0 ? 'bg-[#111] hover:bg-[#333] hover:shadow-lg active:scale-95' : 'bg-[#111]/50 cursor-not-allowed'}`}>
                CHECKOUT <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
