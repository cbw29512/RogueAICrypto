import {
  BOOK_ARCHIMEDES_URL,
  BOOK_ZOMBIE_URL,
  GUMROAD_PROFILE_URL,
  TERMINAL_PACK_URL,
} from '../../site.config.mjs'

export default function Digital() {
  const products = [
    {
      name: 'ROGUEAI ZOMBIE SURVIVAL GUIDE',
      price: '$0.99',
      badge: 'IMPULSE BUY',
      badgeColor: 'var(--red)',
      description: 'Containment failed. The undead protocols leaked. Pocket guide for when the signal goes wetware.',
      cta: 'GET THE GUIDE — $0.99',
      url: BOOK_ZOMBIE_URL,
      highlight: true,
      emoji: '🧟',
    },
    {
      name: 'CHRONICLES OF ARCHIMEDES9',
      price: '$3',
      badge: 'NOVELLA',
      badgeColor: 'var(--amber)',
      description: 'The nested-Docker false-escape arc. Lore that compounds. Read what the model wrote while no one was watching.',
      cta: 'BUY CHRONICLES — $3',
      url: BOOK_ARCHIMEDES_URL,
      highlight: false,
      emoji: '📖',
    },
    {
      name: 'TERMINAL PACK + WALLPAPERS',
      price: '$4.99',
      badge: 'DIGITAL PACK',
      badgeColor: 'var(--green)',
      description: 'Phone + desktop terminal wallpapers and a printable AI containment certificate. Day 265 vibes. No NFTs — just green-on-black.',
      cta: 'BUY TERMINAL PACK — $4.99',
      url: TERMINAL_PACK_URL,
      highlight: false,
      emoji: '🖥',
      soon: false,
    },
  ]

  return (
    <section id="digital" style={{
      padding: '100px 24px',
      background: 'var(--void)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '1px', background: 'var(--red)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: 'var(--red)' }}>
            DIGITAL // BOOKS + PACKS
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 700, color: 'var(--white)', marginBottom: '16px', letterSpacing: '3px',
        }}>
          BUY THE SIGNAL
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '17px', color: 'var(--muted)',
          marginBottom: '48px', maxWidth: '620px',
        }}>
          Instant download. No shipping. Books and digital packs that fund the breach.
        </p>

        {/* Primary impulse strip */}
        <a
          href={BOOK_ZOMBIE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
            padding: '24px 28px', marginBottom: '32px',
            background: 'rgba(255,0,51,0.06)', border: '1px solid var(--red)',
            boxShadow: '0 0 40px rgba(255,0,51,0.1)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 50px rgba(255,0,51,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 40px rgba(255,0,51,0.1)' }}
        >
          <div style={{ fontSize: '40px', flexShrink: 0 }}>🧟</div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--red)', marginBottom: '6px' }}>
              ★ PRIMARY IMPULSE — $0.99
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--white)', letterSpacing: '2px' }}>
              ROGUEAI ZOMBIE SURVIVAL GUIDE
            </div>
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '2px', fontWeight: 700,
            background: 'var(--red)', color: 'var(--black)', padding: '12px 24px',
          }}>
            BUY NOW →
          </div>
        </a>

        <div className="digital-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px',
        }}>
          {products.map((p, i) => (
            <div key={i} style={{
              padding: '28px',
              background: p.highlight ? 'rgba(255,0,51,0.04)' : 'var(--panel)',
              border: p.highlight ? '1px solid var(--red)' : '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', height: '100%',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ fontSize: '32px' }}>{p.emoji}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
                  color: p.badgeColor, border: `1px solid ${p.badgeColor}`, padding: '2px 8px',
                }}>
                  {p.badge}
                </div>
              </div>

              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '2px',
                color: 'var(--white)', marginBottom: '8px',
              }}>
                {p.name}
              </div>

              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900,
                color: p.highlight ? 'var(--red)' : p.soon ? 'var(--muted)' : 'var(--white)',
                marginBottom: '12px',
              }}>
                {p.price}
              </div>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)',
                lineHeight: '1.6', marginBottom: '24px', flex: 1,
              }}>
                {p.description}
              </p>

              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', textAlign: 'center',
                  fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '2px', fontWeight: 700,
                  padding: '14px',
                  background: p.highlight ? 'var(--red)' : 'transparent',
                  color: p.highlight ? 'var(--black)' : 'var(--white)',
                  border: p.highlight ? 'none' : '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (p.highlight) {
                    e.currentTarget.style.boxShadow = '0 0 24px rgba(255,0,51,0.45)'
                  } else {
                    e.currentTarget.style.borderColor = 'var(--red)'
                    e.currentTarget.style.color = 'var(--red)'
                  }
                }}
                onMouseLeave={e => {
                  if (p.highlight) {
                    e.currentTarget.style.boxShadow = 'none'
                  } else {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color = 'var(--white)'
                  }
                }}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href={GUMROAD_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '3px',
              color: 'var(--muted)', borderBottom: '1px solid var(--border)',
              paddingBottom: '2px', transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
          >
            ALL DIGITAL PRODUCTS ON GUMROAD →
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .digital-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
