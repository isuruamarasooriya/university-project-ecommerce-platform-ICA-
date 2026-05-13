import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Heart, ChevronRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { productService } from '../services/api'

gsap.registerPlugin(ScrollTrigger)

const initialProducts: any[] = []

export default function NewArrivals() {
  const sectionRef = useRef<HTMLElement>(null)
  const [products, setProducts] = useState<any[]>([])


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAll();
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
        const fallbackProducts = [
          { id: 1, name: 'VEXO Pro Lycra', price: 116.00, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop', tag: 'Winter' },
          { id: 2, name: 'VEXO Tech Top', price: 85.00, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=1000&fit=crop', tag: 'Winter' },
          { id: 3, name: 'Performance Leggings', price: 92.00, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop', tag: 'Winter' },
          { id: 4, name: 'Thermal Shell', price: 145.00, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop', tag: 'Winter' },
          { id: 5, name: 'Aero Joggers', price: 105.00, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=1000&fit=crop', tag: 'Winter' },
          { id: 6, name: 'Core Base Layer', price: 65.00, image: 'https://images.unsplash.com/photo-1522898467493-49726bf28798?w=800&h=1000&fit=crop', tag: 'Winter' },
          { id: 7, name: 'Elite Shorts', price: 55.00, image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=1000&fit=crop', tag: 'Winter' },
          { id: 8, name: 'Hybrid Jacket', price: 185.00, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop', tag: 'Winter' },
        ];
        setProducts(fallbackProducts);
      }
    };
    fetchProducts();
    }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ background: '#D4E0E2' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
          <span className="text-xs font-medium tracking-[0.05em] text-[#0F1112]/50 uppercase">
            NEW ARRIVAL
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F1112] leading-[1.2] tracking-[-0.01em] text-center">
            FRESH FITS FOR YOUR<br />NEXT WORKOUT!
          </h2>
          <a
            href="#"
            className="text-xs font-medium tracking-[0.05em] text-[#0F1112]/70 hover:text-[#0F1112] transition-colors uppercase"
          >
            ALL BRANDS
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="product-card group relative rounded-3xl overflow-hidden cursor-pointer block"
              style={{ background: '#EBF0F1' }}
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="text-xs font-medium bg-white/80 backdrop-blur-sm text-[#0F1112] px-3 py-1.5 rounded-full shadow-sm">
                    {product.tag}
                  </span>
                  <button onClick={(e) => e.preventDefault()} className="pointer-events-auto w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                    <Heart size={14} className="text-[#0F1112]" />
                  </button>
                </div>
              </div>

              {/* Product Info Bar */}
              <div className="p-3">
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-full px-4 py-3 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-white/50">
                  <div>
                    <p className="text-xs font-bold tracking-[0.02em] text-[#0F1112] truncate mb-0.5">{product.name}</p>
                    <p className="text-[11px] font-medium tracking-[0.05em] text-[#0F1112]/60">{product.price}</p>
                  </div>
                  <button className="w-8 h-8 shrink-0 rounded-full bg-[#0F1112] flex items-center justify-center hover:bg-[#333] transition-colors">
                    <ChevronRight size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* See All Brands Button */}
        <div className="flex justify-center mt-12">
          <Link to="/shop" className="inline-flex items-center gap-3 bg-[#111] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#333] transition-colors">
            SEE ALL BRANDS
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

