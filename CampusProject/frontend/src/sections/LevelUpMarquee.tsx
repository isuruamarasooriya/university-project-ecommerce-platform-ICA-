import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function LevelUpMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return

    const scrollWidth = marquee.scrollWidth
    
    gsap.to(marquee, {
      x: -scrollWidth / 2,
      duration: 30,
      ease: 'none',
      repeat: -1,
    })
  }, [])

  const words = ['LEVEL UP', 'PEAK PERFORMANCE', 'MODERN DESIGN', 'STREET STYLE', 'INNOVATION', 'DURABILITY', 'COMFORT']

  return (
    <div className="bg-[#111] py-12 overflow-hidden border-y border-white/10">
      <div 
        ref={marqueeRef}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...words, ...words].map((word, i) => (
          <span 
            key={i} 
            className="text-white/20 text-7xl md:text-9xl font-black tracking-tighter"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
