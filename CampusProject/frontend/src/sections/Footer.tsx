export default function Footer() {
  return (
    <footer className="py-16" style={{ background: '#0F1112' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <span className="text-xl font-bold tracking-[0.15em] text-white mb-4 block">
              VEXO
            </span>
            <p className="text-sm text-white/50 leading-relaxed">
              Premium performance workout gear engineered for athletes who demand the best.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.05em] text-white/40 uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {['Men', 'Women', 'Accessories', 'New Arrivals', 'Best Sellers'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.05em] text-white/40 uppercase mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {['Contact Us', 'FAQs', 'Shipping', 'Returns', 'Size Guide'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/70 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.05em] text-white/40 uppercase mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-white/50 mb-4">
              Subscribe for exclusive drops and workout tips.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 bg-white/10 text-white text-sm px-5 h-11 rounded-l-full outline-none placeholder:text-white/30 border border-white/10 border-r-0 focus:border-white/30 transition-colors"
              />
              <button className="bg-white text-[#0F1112] text-sm font-bold tracking-[0.05em] px-6 h-11 rounded-r-full hover:bg-gray-100 transition-colors uppercase shrink-0">
                JOIN
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-center md:text-left">
            <p className="text-xs text-white/40">
              © 2026 VEXO. All rights reserved.
            </p>
            <span className="hidden md:inline text-white/20 text-xs">|</span>
            <p className="text-xs text-white/40">
              Designed & built by{' '}
              <a href="https://lyra-self.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/70 transition-colors font-medium border-b border-white/20 hover:border-white/70 pb-[1px]">
                Wenura
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
