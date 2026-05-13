import React from 'react';
import { Link } from 'react-router-dom';
import { LocalMall, Facebook, Twitter, Instagram, YouTube } from '@mui/icons-material';

const COL = [
  { title: 'Company', links: [['About Us','/'],['Careers','/'],['Press','/'],['Blog','/']] },
  { title: 'Support', links: [['Help Center','/'],['Contact Us','/'],['Returns','/'],['Order Status','/']] },
  { title: 'Categories', links: [['Electronics','/products?category=Electronics'],['Fashion','/products?category=Fashion'],['Home & Living','/products?category=Home'],['Books','/products?category=Books']] },
  { title: 'Sell', links: [['Become a Seller','/auth'],['Seller Dashboard','/seller-dashboard'],['Seller Guide','/'],['Fees & Pricing','/']] },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0F172A', color: '#94A3B8', marginTop: 80 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LocalMall style={{ color: '#fff', fontSize: 20 }} />
              </div>
              <span style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>MultiVendor</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Your premier destination for multi-vendor shopping. Discover millions of products from thousands of sellers.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[Facebook, Twitter, Instagram, YouTube].map((Icon, i) => (
                <div key={i} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(91,46,255,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  <Icon style={{ fontSize: 18, color: '#94A3B8' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Columns */}
          {COL.map(col => (
            <div key={col.title}>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#5B2EFF'}
                      onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ background: 'rgba(91,46,255,0.1)', border: '1px solid rgba(91,46,255,0.2)', borderRadius: 16, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Stay in the loop ✨</h3>
            <p style={{ fontSize: 14 }}>Get exclusive deals and new arrivals straight to your inbox.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Your email address" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9999, padding: '10px 20px', color: '#fff', fontSize: 14, outline: 'none', minWidth: 240 }} />
            <button style={{ background: 'linear-gradient(135deg,#5B2EFF,#00C6FF)', color: '#fff', border: 'none', borderRadius: 9999, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              Subscribe
            </button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 13 }}>© 2025 MultiVendor Marketplace. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ color: '#64748B', textDecoration: 'none', fontSize: 13 }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
