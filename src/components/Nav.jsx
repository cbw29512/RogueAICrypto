import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'BREACH', href: '#breach' },
    { label: 'TOKEN', href: '#token' },
    { label: 'INSURANCE', href: '#insurance' },
    { label: 'MERCH', href: '#merch' },
    { label: 'CONSPIRACY', href: '#conspiracy' },
    { label: 'ROADMAP', href: '#roadmap' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '16px 32px',
      background: scrolled ? 'rgba(5,5,8,0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/rogueai-logo.png" alt="RogueAI" style={{ width: 36, height: 36, filter: 'drop-shadow(0 0 8px var(--red))' }} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '3px', color: 'var(--white)' }}>
          ROGUEAI
        </span>
      </a>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-nav">
        {links.map(l => (
          <a key={l.label} href={l.href} style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px',
            color: 'var(--muted)', transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--red)'}
          onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >{l.label}</a>
        ))}
        <a href="https://www.mintme.com/token/rougeAI" target="_blank" rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px',
            color: 'var(--red)', border: '1px solid var(--red)', padding: '6px 16px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.background = 'var(--red)'; e.target.style.color = 'var(--black)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--red)' }}
        >BUY $ROGUE</a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
