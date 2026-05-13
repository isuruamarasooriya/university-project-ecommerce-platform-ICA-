import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router'

gsap.registerPlugin(ScrollTrigger)

const picks = [
  {
    id: 1,
    season: 'Q1/WINTER 2025',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=800&fit=crop',
    title: 'TOP WORKOUT GEAR FOR PEAK PERFORMANCE! NICE!',
    tag: 'TOP SELLING GEAR',
  },
  {
    id: 2,
    season: 'Q2/SUMMER 2025',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop',
    title: 'LATEST STYLES AND INNOVATIONS IN WORKOUT GEAR.',
    tag: 'NEW ARRIVAL',
  },
]

export default function TopPicks() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.top-pick-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24"
      style={{ background: '#D4E0E2' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-medium tracking-[0.05em] text-[#0F1112]/50 uppercase mb-3 block">
              OUR TOP PICKS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F1112] leading-[1.2] tracking-[-0.01em] max-w-lg">
              TOP WORKOUT GEAR FOR PEAK PERFORMANCE!
            </h2>
          </div>
          <p className="text-sm text-[#0F1112]/60 max-w-[280px] leading-relaxed">
            Discover the best of our collection, designed to power your workouts all year round.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {picks.map((pick) => (
            <Link
              to="/shop"
              key={pick.id}
              className="top-pick-card group relative rounded-3xl overflow-hidden cursor-pointer block"
              style={{ height: '60vh', minHeight: '450px' }}
            >
              <img
                src={pick.image}
                alt={pick.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Season label */}
              <div className="absolute top-6 right-6">
                <span className="text-xs font-medium tracking-[0.05em] text-white/80">
                  {pick.season}
                </span>
              </div>

              {/* Title */}
              <div className="absolute bottom-16 left-6 right-6">
                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-[-0.01em]">
                  {pick.title}
                </h3>
              </div>

              {/* Tag */}
              <div className="absolute bottom-6 left-6">
                <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.05em] text-white/90 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  {pick.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
