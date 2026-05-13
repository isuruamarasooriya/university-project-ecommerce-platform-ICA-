import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import { Heart, ChevronRight, SlidersHorizontal, ChevronDown, Check, X } from 'lucide-react'

import { Link } from 'react-router'
import { productService } from '../services/api'

gsap.registerPlugin(ScrollTrigger)

const categories = ['All Products', 'Tops & Shirts', 'Bottoms & Pants', 'Outerwear', 'Compression', 'Accessories']
const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const colorsList = ['#0F1112', '#C8D8DB', '#7B8A8D', '#D9D9D9', '#5A3E36', '#212A3E']

const productImages = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1522898467493-49726bf28798?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop'
]

const shopProducts = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Performance Gear ${i + 1}`,
  price: `USD ${(116 + (i * 12)).toFixed(2)}`,
  image: productImages[i % 8],
  tag: i % 4 === 0 ? 'New' : i % 3 === 0 ? 'Top Rated' : 'Winter',
  category: categories[(i % (categories.length - 1)) + 1],
  sizes: [sizesList[i % 6], sizesList[(i + 1) % 6]],
  color: colorsList[i % 6]
}))

const FilterContent = ({ categories, sizesList, colorsList, activeCategory, setActiveCategory, activeSizes, toggleSize, activeColor, setActiveColor }: any) => (
  <>
    <div className="mb-10">
      <h3 className="text-sm font-bold tracking-[0.05em] text-[#0F1112] mb-5 uppercase">Category</h3>
      <ul className="space-y-4">
        {categories.map((cat: string) => (
          <li 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`text-sm font-bold tracking-[0.02em] cursor-pointer transition-colors ${activeCategory === cat ? 'text-[#0F1112]' : 'text-[#0F1112]/50 hover:text-[#0F1112]'}`}
          >
            {cat}
          </li>
        ))}
      </ul>
    </div>
    
    <div className="mb-10">
      <h3 className="text-sm font-bold tracking-[0.05em] text-[#0F1112] mb-5 uppercase">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizesList.map((size: string) => (
          <button 
            key={size}
            onClick={() => toggleSize(size)} 
            className={`w-[3.25rem] h-[2.75rem] border rounded-xl text-sm font-bold transition-all flex items-center justify-center ${activeSizes.includes(size) ? 'bg-[#0F1112] text-white border-[#0F1112]' : 'border-[#0F1112]/10 text-[#0F1112]/70 hover:text-[#0F1112] hover:border-[#0F1112]/30 hover:bg-white'}`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>

    <div className="mb-10">
      <h3 className="text-sm font-bold tracking-[0.05em] text-[#0F1112] mb-5 uppercase">Color</h3>
      <div className="flex flex-wrap gap-3">
        {colorsList.map((color: string) => (
          <button 
            key={color} 
            onClick={() => setActiveColor(activeColor === color ? null : color)}
            className={`w-8 h-8 rounded-full border border-black/10 transition-all shadow-sm flex items-center justify-center ${activeColor === color ? 'ring-2 ring-offset-2 ring-[#0F1112]' : 'ring-2 ring-transparent hover:ring-[#0F1112]/30'}`} 
            style={{ backgroundColor: color }}
          >
            {activeColor === color && <Check size={14} className={color === '#0F1112' || color === '#212A3E' || color === '#5A3E36' ? 'text-white' : 'text-[#0F1112]'} />}
          </button>
        ))}
      </div>
    </div>
  </>
)

export default function Shop() {
  const lenisRef = useRef<Lenis | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [activeSizes, setActiveSizes] = useState<string[]>([])
  const [activeColor, setActiveColor] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [sortOption, setSortOption] = useState('Featured')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)


  const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest Arrivals'];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to sample products if API fails
        const fallbackProducts = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          name: `Performance Gear ${i + 1}`,
          price: 116 + (i * 12),
          image: productImages[i % 8],
          tag: i % 4 === 0 ? 'New' : i % 3 === 0 ? 'Top Rated' : 'Winter',
          category: categories[(i % (categories.length - 1)) + 1],
          sizes: [sizesList[i % 6], sizesList[(i + 1) % 6]],
          color: colorsList[i % 6]
        }));
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    if (activeCategory !== 'All Products' && product.category !== activeCategory) return false;
    if (activeSizes.length > 0 && !activeSizes.some(size => product.sizes.includes(size))) return false;
    if (activeColor && product.color !== activeColor) return false;
    return true;
  });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Price: Low to High') {
      const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price.replace('USD ', ''));
      const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price.replace('USD ', ''));
      return priceA - priceB;
    }
        if (sortOption === 'Price: High to Low') {
      const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price.replace('USD ', ''));
      const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price.replace('USD ', ''));
      return priceB - priceA;
    }
    if (sortOption === 'Newest Arrivals') {
      return b.id - a.id;
    }
    return 0;
  });

  const toggleSize = (size: string) => {
    setActiveSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    )
  }

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
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.shop-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
      )
      
      gsap.fromTo(
        '.shop-sidebar',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
      )
    }, gridRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => { document.body.style.overflow = 'auto' }
  }, [isFilterOpen])

  return (
    <div className="relative">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen" ref={gridRef}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-[#0F1112]/10 pb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F1112] tracking-[-0.02em] uppercase leading-none">
            ALL PRODUCTS
          </h1>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="xl:hidden inline-flex items-center justify-center gap-2 text-sm font-bold tracking-[0.05em] text-[#0F1112] bg-[#EBF0F1] px-6 h-11 rounded-full hover:bg-white transition-colors border border-transparent hover:border-[#0F1112]/10 shadow-sm whitespace-nowrap"
            >
              <SlidersHorizontal size={16} /> FILTERS
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="inline-flex items-center justify-center gap-2 text-sm font-bold tracking-[0.05em] text-[#0F1112] bg-[#EBF0F1] px-6 h-11 rounded-full hover:bg-white transition-colors border border-transparent hover:border-[#0F1112]/10 shadow-sm whitespace-nowrap"
              >
                {sortOption === 'Featured' ? 'SORT BY' : sortOption.toUpperCase()} <ChevronDown size={16} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-[#0F1112]/5 py-2 z-50 overflow-hidden">
                  {sortOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => { setSortOption(option); setIsSortOpen(false); }}
                      className={`w-full text-left px-5 py-3 text-xs font-bold tracking-[0.05em] hover:bg-[#EBF0F1] transition-colors uppercase ${sortOption === option ? 'text-[#0F1112] bg-[#EBF0F1]/50' : 'text-[#0F1112]/60'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <div className="hidden xl:block col-span-1 shop-sidebar">
            <FilterContent 
              categories={categories}
              sizesList={sizesList}
              colorsList={colorsList}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeSizes={activeSizes}
              toggleSize={toggleSize}
              activeColor={activeColor}
              setActiveColor={setActiveColor}
            />
          </div>

          {/* Product Grid */}
          <div className="col-span-1 xl:col-span-3">
            {loading ? (
              <div className="col-span-full text-center py-20">
                <p className="text-lg text-[#0F1112]/50">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center bg-[#EBF0F1] rounded-3xl">
                <h3 className="text-xl font-bold tracking-[0.02em] text-[#0F1112]">No products found</h3>
                <p className="text-sm font-medium tracking-[0.05em] text-[#0F1112]/60 mt-2">Try adjusting your filters to see more results.</p>
                <button 
                  onClick={() => { setActiveCategory('All Products'); setActiveSizes([]); setActiveColor(null); }}
                  className="mt-6 text-xs font-bold tracking-[0.05em] text-white bg-[#0F1112] px-6 py-2.5 rounded-full hover:bg-black transition-colors"
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedProducts.map((product) => (
                  <Link to={`/product/${product.id}`} key={product.id} className="shop-card group relative rounded-3xl overflow-hidden cursor-pointer block" style={{ background: '#EBF0F1' }}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl border border-transparent">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span className="text-xs font-bold bg-white/90 backdrop-blur-md text-[#0F1112] px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-sm">
                          {product.tag}
                        </span>
                        <button 
                          onClick={(e) => { e.preventDefault(); toggleFavorite(e, product.id); }}
                          className={`pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white transition-colors shrink-0 shadow-sm ${favorites.includes(product.id) ? 'text-red-500' : 'text-[#0F1112]'}`}
                        >
                          < Heart size={15} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} className={favorites.includes(product.id) ? 'text-red-500' : 'text-[#0F1112]'} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-white/50">
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold tracking-[0.02em] text-[#0F1112] truncate mb-0.5">{product.name}</p>
                          <p className="text-[11px] font-medium tracking-[0.05em] text-[#0F1112]/60">{product.price}</p>
                        </div>
                        <button className="w-9 h-9 rounded-full bg-[#0F1112] flex items-center justify-center hover:bg-[#333] transition-colors shrink-0">
                          <ChevronRight size={16} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center mt-20 pt-10 border-t border-[#0F1112]/10">
            <button className="bg-[#111] text-white text-sm font-bold tracking-[0.05em] px-10 py-3.5 rounded-full hover:bg-[#333] hover:shadow-lg transition-all active:scale-95">
              LOAD MORE
            </button>
        </div>
      </div>
      
      <Footer />

      {/* Mobile Filters Drawer */}
      <div 
        className={`fixed inset-0 bg-[#D4E0E2] z-[110] transition-transform duration-500 ease-in-out xl:hidden flex flex-col pt-6 px-6 pb-6 overflow-y-auto ${
          isFilterOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-8 border-b border-[#0F1112]/10 pb-4 mt-12">
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#0F1112] uppercase">Filters</h2>
          <button 
            onClick={() => setIsFilterOpen(false)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
          >
            <X size={20} className="text-[#0F1112]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 pb-20">
          <FilterContent 
            categories={categories}
            sizesList={sizesList}
            colorsList={colorsList}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeSizes={activeSizes}
            toggleSize={toggleSize}
            activeColor={activeColor}
            setActiveColor={setActiveColor}
          />
        </div>
        <div className="pt-4 border-t border-[#0F1112]/10 bg-[#D4E0E2] sticky bottom-0">
          <div className="flex gap-4">
            <button 
              onClick={() => { setActiveCategory('All Products'); setActiveSizes([]); setActiveColor(null); }}
              className="flex-1 bg-white border border-[#0F1112]/10 text-[#0F1112] text-sm font-bold tracking-[0.05em] px-6 py-4 rounded-full hover:bg-[#EBF0F1] transition-colors"
            >
              CLEAR
            </button>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="flex-1 bg-[#111] text-white text-sm font-bold tracking-[0.05em] px-6 py-4 rounded-full hover:bg-[#333] transition-colors"
            >
              VIEW RESULTS ({sortedProducts.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

