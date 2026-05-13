import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, Lock, ArrowRight, Loader2 } from 'lucide-react'

import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/api'

gsap.registerPlugin(ScrollTrigger)

export default function CheckoutPage() {
  const lenisRef = useRef<Lenis | null>(null)
  const { items, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (items.length === 0 && !loading) {
      navigate('/cart', { replace: true })
    }
  }, [items, navigate, loading])

  const shippingCost = 10.00
  const taxCost = cartTotal * 0.08625 // approx 8.625% tax
  const finalTotal = cartTotal + shippingCost + taxCost

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const savedUser = localStorage.getItem('vexo_user');
      const user = savedUser ? JSON.parse(savedUser) : { email: 'guest@vexo.com', name: 'Guest' };
      
      const orderItems = items.map(item => ({
        productId: item.productId.toString(),
        productName: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(/[^0-9.]/g, '')),
        size: item.size
      }));

      const orderData = {
        customerName: user.name || user.email.split('@')[0],
        email: user.email,
        phone: "123-456-7890",
        address: "123 Main St",
        city: "City",
        zipCode: "12345",
        items: orderItems,
        totalAmount: finalTotal,
        status: "Processing"
      };
      
      await orderService.create(orderData);
      
      clearCart();
      setTimeout(() => navigate('/dashboard'), 100);
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
      setLoading(false);
    }
  };

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
    gsap.fromTo('.checkout-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' })
  }, [])

  return (
    <div className="relative">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-[80vh]">
        <div className="mb-8 flex items-center gap-2 checkout-reveal">
          <Link to="/cart" className="text-sm font-bold text-[#0F1112]/50 hover:text-[#0F1112] transition-colors flex items-center gap-1">
            <ChevronLeft size={16} /> BACK TO CART
          </Link>
        </div>

        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0F1112] tracking-[-0.02em] uppercase mb-12 checkout-reveal">
          CHECKOUT
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-2 flex flex-col gap-12 checkout-reveal">
            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold tracking-[0.02em] text-[#0F1112] mb-6">1. Contact Information</h2>
              <div className="grid grid-cols-1 gap-4">
                <input type="email" placeholder="Email address" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                <input type="tel" placeholder="Phone number" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-xl font-bold tracking-[0.02em] text-[#0F1112] mb-6">2. Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="First name" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                <input type="text" placeholder="Last name" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                <input type="text" placeholder="Address" className="w-full sm:col-span-2 bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                <input type="text" placeholder="City" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="State" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                  <input type="text" placeholder="ZIP" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-[0.02em] text-[#0F1112]">3. Payment</h2>
                <Lock size={16} className="text-[#0F1112]/50" />
              </div>
              <div className="bg-[#EBF0F1] p-6 rounded-2xl border border-[#0F1112]/10 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-[5px] border-[#0F1112] bg-white" />
                  <span className="text-sm font-bold tracking-[0.02em] text-[#0F1112]">Credit Card</span>
                </div>
                <div className="flex gap-2">
                   {/* Abstract card icons */}
                   <div className="w-8 h-5 bg-[#0F1112]/10 rounded flex items-center justify-center text-[10px] font-bold text-[#0F1112]/50">VS</div>
                   <div className="w-8 h-5 bg-[#0F1112]/10 rounded flex items-center justify-center text-[10px] font-bold text-[#0F1112]/50">MC</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Card number" className="w-full sm:col-span-2 bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                <input type="text" placeholder="Name on card" className="w-full sm:col-span-2 bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                <input type="text" placeholder="Expiration date (MM/YY)" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
                <input type="text" placeholder="Security code" className="w-full bg-[#EBF0F1] px-5 py-4 rounded-xl text-sm font-medium tracking-[0.02em] text-[#0F1112] outline-none focus:ring-2 focus:ring-[#0F1112]/20 transition-all border border-transparent focus:border-[#0F1112]/30 placeholder:text-[#0F1112]/40" />
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-reveal">
            <div className="bg-[#EBF0F1] rounded-3xl p-8 sticky top-32">
              <h3 className="text-xl font-bold tracking-[0.02em] text-[#0F1112] mb-6 border-b border-[#0F1112]/10 pb-4">ORDER SUMMARY</h3>
              
              {/* Small cart items list */}
              <div className="space-y-4 mb-6 border-b border-[#0F1112]/10 pb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-[#EBF0F1] rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold tracking-[0.02em] text-[#0F1112]">{item.name}</h4>
                      <p className="text-xs font-medium text-[#0F1112]/60">Color: {item.color} | Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#0F1112] mt-1">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm font-medium text-[#0F1112]/70 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#0F1112]">USD {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-[#0F1112]">USD {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="text-[#0F1112]">USD {taxCost.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-[#0F1112]/10 pt-6 mb-8">
                <span className="text-base font-bold text-[#0F1112]">Total</span>
                <span className="text-xl font-bold text-[#0F1112]">USD {finalTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-[#111] text-white text-sm font-bold tracking-[0.05em] px-8 py-4 rounded-full hover:bg-[#333] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : 'PLACE ORDER'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
