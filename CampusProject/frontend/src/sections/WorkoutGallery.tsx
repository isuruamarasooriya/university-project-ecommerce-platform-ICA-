import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const images = [
  { url: 'https://images.unsplash.com/photo-1522898467493-49726bf28798?w=800&h=1000&fit=crop', title: 'Strength' },
  { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=1000&fit=crop', title: 'Endurance' },
  { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1000&fit=crop', title: 'Focus' },
  { url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=1000&fit=crop', title: 'Power' },
  { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=1000&fit=crop', title: 'Agility' },
  { url: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&h=1000&fit=crop', title: 'Balance' },
]

export default function WorkoutGallery() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gallery-item', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="py-24 px-6 lg:px-12 max-w-[1400px] mx-auto" ref={containerRef}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div 
            key={i} 
            className="gallery-item relative aspect-[4/5] overflow-hidden rounded-3xl group cursor-pointer"
          >
            <img 
              src={img.url} 
              alt={img.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
              <h3 className="text-white text-2xl font-bold uppercase">{img.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
