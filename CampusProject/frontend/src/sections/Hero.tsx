import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play } from 'lucide-react'
import { Link } from 'react-router'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Animate headline
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.3 }
      )

      // Animate hero image
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.5 }
      )

      // Parallax on scroll
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -80,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    }, sectionRef.current) // Use .current here

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #C8D8DB 0%, #D4E0E2 50%, #E0E8EA 100%)' }}
    >
      {/* Subtle geometric lines background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M0 450 Q 360 300, 720 450 T 1440 450" stroke="white" strokeWidth="1" fill="none" />
          <path d="M0 480 Q 360 330, 720 480 T 1440 480" stroke="white" strokeWidth="0.5" fill="none" />
          <path d="M0 420 Q 360 270, 720 420 T 1440 420" stroke="white" strokeWidth="0.5" fill="none" />
          <line x1="200" y1="0" x2="200" y2="900" stroke="white" strokeWidth="0.5" />
          <line x1="1240" y1="0" x2="1240" y2="900" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-12 min-h-screen flex flex-col">
        {/* Hero Text */}
        <div ref={textRef} className="text-center pt-12 mb-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0F1112] leading-[1.1] tracking-[-0.02em]">
            GEAR UP EVERY SEASON
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0F1112] leading-[1.1] tracking-[-0.02em]">
            EVERY WORKOUT!
          </h1>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 mt-8 relative z-20">
            <Link to="/shop" className="bg-[#111] text-white text-sm font-bold tracking-[0.05em] px-8 py-3 rounded-full hover:bg-[#333] transition-colors relative z-20">
              SHOP NOW
            </Link>
            <Link to="/explore" className="bg-white text-[#0F1112] text-sm font-bold tracking-[0.05em] px-8 py-3 rounded-full border border-[#0F1112]/10 hover:bg-[#f5f5f5] transition-colors relative z-20">
              EXPLORE ALL
            </Link>
          </div>
        </div>

        {/* Hero Image Container */}
        <div className="flex-1 flex items-end justify-center relative">
          <div
            ref={imageRef}
            className="relative w-full max-w-lg mx-auto"
            style={{ height: '65vh' }}
          >
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=1200&fit=crop"
              alt="VEXO Athletic Wear Model"
              className="w-full h-full object-contain object-bottom"
            />
          </div>

          {/* Bottom Left: User Avatars + Testimonial */}
          <div className="absolute bottom-8 left-0 hidden lg:block">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex -space-x-2">
                {[
                  'https://i.pravatar.cc/80?img=12',
                  'https://i.pravatar.cc/80?img=5',
                  'https://i.pravatar.cc/80?img=8',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`User ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#0F1112]/70 max-w-[200px] leading-relaxed">
              Stay cozy without compromising your range of motion. Our women's winter range is perfect for those chilly outdoor workouts.
            </p>
          </div>

          {/* Bottom Right: Video Thumbnail */}
          <div className="absolute bottom-8 right-0 hidden lg:block">
            <div className="relative w-48 h-28 rounded-2xl overflow-hidden cursor-pointer group">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop"
                alt="Video preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={16} className="text-[#0F1112] ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
