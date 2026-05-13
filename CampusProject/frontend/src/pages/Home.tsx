import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navigation from '../sections/Navigation'
import Hero from '../sections/Hero'
import NewArrivals from '../sections/NewArrivals'
import TopPicks from '../sections/TopPicks'
import Footer from '../sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
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

    return () => {
      cancelAnimationFrame(rafId)
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [])

  return (
    <div className="relative bg-[#D4E0E2]">
      <Navigation />
      <Hero />
      <NewArrivals />
      <TopPicks />
      <Footer />
    </div>
  )
}
