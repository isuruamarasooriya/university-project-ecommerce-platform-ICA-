import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navigation from '../sections/Navigation'
import Footer from '../sections/Footer'
import LevelUpMarquee from '../sections/LevelUpMarquee'
import WorkoutGallery from '../sections/WorkoutGallery'
import FeaturedLookbook from '../sections/FeaturedLookbook'

gsap.registerPlugin(ScrollTrigger)

export default function Explore() {
  const lenisRef = useRef<Lenis | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)

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
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.2 }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative">
      <Navigation />
      
      <div className="pt-36 pb-16 px-6 lg:px-12 max-w-[1400px] mx-auto text-center" ref={headerRef}>
        <span className="text-xs font-bold tracking-[0.1em] text-[#0F1112]/50 uppercase mb-4 block">
          The Brand
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#0F1112] tracking-[-0.02em] leading-[1.1] max-w-4xl mx-auto uppercase">
          Explore Our Innovations
        </h1>
        <p className="mt-8 text-base md:text-lg text-[#0F1112]/70 max-w-xl mx-auto leading-relaxed">
          Dive into the technology, lifestyle, and visual aesthetics behind VEXO. We merge performance functionality with high-end modern design.
        </p>
      </div>

      <FeaturedLookbook />
      <LevelUpMarquee />
      <WorkoutGallery />
      
      <Footer />
    </div>
  )
}
