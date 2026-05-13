import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Heart, ChevronLeft, Star, ShoppingBag, Check } from 'lucide-react'

import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import { useCart } from '../context/CartContext'

gsap.registerPlugin(ScrollTrigger)

export default function ProductPage() {
  const { id } = useParams()
  const lenisRef = useRef<Lenis | null>(null)
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('#0F1112')
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', () => ScrollTrigger.update())
    const raf = (time: number) => { 
      lenis.raf(time)
      requestAnimationFrame(raf) 
    }
    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      if (lenisRef.current) lenisRef.current.destroy()
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    gsap.fromTo('.product-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' })
  }, [id])

  // Mock product data based on ID
  const numId = parseInt(id || '1') || 1
  const productImages = [
    'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1998&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975867597-0af37a22e31e?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1548690312-e3b507d17a4d?q=80&w=1974&auto=format&fit=crop'
  ]
  const product = {
    name: `Performance Gear ${numId}`,
    price: `USD ${(116 + (numId * 12)).toFixed(2)}`,
    image: productImages[(numId % 8)],
    description: 'Engineered for maximum mobility and breathability. This piece features our latest moisture-wicking technology and a tailored fit that moves with your body during high-intensity workouts or everyday wear.',
    features: ['Moisture-wicking fabric', '4-way stretch', 'Odor-resistant', 'Lightweight feel']
  }

  return (
    <div className="relative">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-[80vh]">
        <div className="mb-6 flex items-center gap-2 product-reveal">
          <Link to="/shop" className="text-sm font-bold text-[#0F1112]/50 hover:text-[#0F1112] transition-colors flex items-center gap-1">
            <ChevronLeft size={16} /> BACK TO SHOP
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image */}
          <div className="product-reveal">
            <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-[#EBF0F1]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center product-reveal">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-[#0F1112]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="text-xs font-bold tracking-[0.05em] text-[#0F1112]/50">(128 REVIEWS)</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0F1112] tracking-[-0.02em] uppercase mb-2">
              {product.name}
            </h1>
            <p className="text-xl font-medium text-[#0F1112]/70 mb-8">{product.price}</p>

            <p className="text-base text-[#0F1112]/70 leading-relaxed mb-8 max-w-lg">
              {product.description}
            </p>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold tracking-[0.05em] text-[#0F1112] uppercase">Color</span>
                <span className="text-xs font-bold text-[#0F1112]/50">{selectedColor === '#0F1112' ? 'BLACK' : 'VARIANT'}</span>
              </div>
              <div className="flex gap-3">
                {['#0F1112', '#C8D8DB', '#7B8A8D', '#D9D9D9'].map((c) => (
                  <button 
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border border-black/10 transition-all ${selectedColor === c ? 'ring-2 ring-offset-2 ring-[#0F1112]' : 'hover:ring-2 hover:ring-offset-1 hover:ring-[#0F1112]/30'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
               <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold tracking-[0.05em] text-[#0F1112] uppercase">Size</span>
                <button className="text-xs font-bold text-[#0F1112]/50 hover:text-[#0F1112] underline decoration-[#0F1112]/30 underline-offset-4">SIZE GUIDE</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                   <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-xl text-sm font-bold transition-all flex items-center justify-center ${selectedSize === size ? 'bg-[#0F1112] text-white border-[#0F1112]' : 'border-[#0F1112]/10 text-[#0F1112]/70 hover:text-[#0F1112] hover:border-[#0F1112]/30 hover:bg-[#EBF0F1]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  addItem({
                    id: `${product.name}-${selectedColor}-${selectedSize}`,
                    productId: numId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    color: selectedColor === '#0F1112' ? 'BLACK' : selectedColor === '#C8D8DB' ? 'LIGHT BLUE' : selectedColor === '#7B8A8D' ? 'GRAY' : 'WHITE',
                    size: selectedSize,
                    quantity: 1
                  });
                  setAdded(true);
                  setTimeout(() => setAdded(false), 2000);
                }}
                className="flex-1 bg-[#111] text-white text-sm font-bold tracking-[0.05em] px-8 py-4 rounded-full hover:bg-[#333] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 relative z-20"
              >
                {added ? <><Check size={16} /> ADDED TO CART</> : <>ADD TO CART <ShoppingBag size={16} /></>}
              </button>
              <button className="w-14 h-14 shrink-0 rounded-full border border-[#0F1112]/20 flex items-center justify-center hover:bg-[#EBF0F1] transition-colors text-[#0F1112]">
                <Heart size={20} />
              </button>
            </div>
            
            <ul className="mt-8 space-y-2 border-t border-[#0F1112]/10 pt-8">
              {product.features.map((feature, i) => (
                <li key={i} className="text-sm text-[#0F1112]/70 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0F1112]/30" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
