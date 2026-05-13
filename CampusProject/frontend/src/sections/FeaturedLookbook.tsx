import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function FeaturedLookbook() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.look-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power2.out'
      })
      gsap.from('.look-image', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        x: 50,
        duration: 1,
        ease: 'power2.out'
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto overflow-hidden" ref={sectionRef}>
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        <div className="flex-1 look-content">
          <span className="text-xs font-bold tracking-[0.2em] text-[#0F1112]/40 uppercase mb-4 block">Summer '26 Collection</span>
          <h2 className="text-4xl md:text-6xl font-black text-[#0F1112] tracking-tighter uppercase leading-[0.9] mb-8">
            The Aesthetics of <br /> Engineering
          </h2>
          <p className="text-[#0F1112]/70 text-lg max-w-md mb-12 leading-relaxed">
            Our latest lookbook explores the intersection of biomechanical precision and street couture. Every seam is intentional, every fabric is engineered for motion.
          </p>
          <button className="bg-[#111] text-white px-8 py-4 rounded-full text-sm font-bold tracking-widest hover:bg-black transition-colors uppercase">
            View Collection
          </button>
        </div>
        <div className="flex-1 look-image w-full">
          <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop" 
              alt="Fashion Look"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
