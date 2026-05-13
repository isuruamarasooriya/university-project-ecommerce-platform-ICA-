import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navigation from '../sections/Navigation'
import NewArrivals from '../sections/NewArrivals'
import TopPicks from '../sections/TopPicks'
import Footer from '../sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function CategoryPage({ title }: { title: string }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis directly in useEffect
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis
    
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const rafId = requestAnimationFrame(raf)

    gsap.defaults({ ease: 'power1.inOut' })

    return () => {
      cancelAnimationFrame(rafId)
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [title])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title])

  return (
    <div className="relative">
      <Navigation />
      
      {/* Basic Hero Banner for the Category */}
      <section className="pt-40 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto bg-gradient-to-b from-[#C8D8DB]/30 to-[#F4F5F5] rounded-3xl mb-16 relative overflow-hidden">
        {/* Subtle geometric lines background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1440 400" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M0 200 Q 360 50, 720 200 T 1440 200" stroke="#0F1112" strokeWidth="0.5" fill="none" />
            <line x1="200" y1="0" x2="200" y2="400" stroke="#0F1112" strokeWidth="0.2" />
            <line x1="1240" y1="0" x2="1240" y2="400" stroke="#0F1112" strokeWidth="0.2" />
          </svg>
        </div>
        <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#0F1112] tracking-[-0.02em] uppercase">
            {title}
          </h1>
          <p className="mt-6 text-[#0F1112]/70 max-w-lg mx-auto text-lg">
            Discover the latest drops and performance essentials curated just for {title.toLowerCase()}.
          </p>
        </div>
      </section>

      <NewArrivals />
      <TopPicks />
      <Footer />
    </div>
  )
}
