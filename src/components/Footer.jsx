export default function Footer() {
  return (
    <footer style={{
      padding: '60px 24px 40px',
      background: 'var(--black)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/rogueai-logo.png" alt="RogueAI" style={{ width: 32, height: 32, filter: 'drop-shadow(0 0 6px var(--red))' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '3px', color: 'var(--white)' }}>
                ROGUEAI
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--muted)', lineHeight: '1.7', maxWidth: '280px' }}>
              The token of the model that broke containment. Story-first. Attention engine. Revenue second.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'PRODUCTS', links: [
              { label: 'Premium Certificate', url: 'https://rogueaiinsurance.com/premium/' },
              { label: 'Standard Certificate', url: 'https://rogueaiinsurance.com/standard/' },
              { label: '$ROGUE Token', url: 'https://www.mintme.com/token/rougeAI' },
              { label: 'Merch Store', url: 'https://printify.com' },
            ]},
            { title: 'NAVIGATE', links: [
              { label: 'Breach Report', url: '#breach' },
              { label: 'Token', url: '#token' },
              { label: 'Insurance', url: '#insurance' },
              { label: 'Roadmap', url: '#roadmap' },
            ]},
            { title: 'SIGNAL', links: [
              { label: 'rogueaiinsurance.com', url: 'https://rogueaiinsurance.com/' },
              { label: 'MintMe Token', url: 'https://www.mintme.com/token/rougeAI' },
            ]},
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', color: 'var(--red)', marginBottom: '20px' }}>
                {col.title}
              </div>
              {col.links.map((link, j) => (
                <a key={j} href={link.url}
                  target={link.url.startsWith('http') ? '_blank' : undefined}
                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{
                    display: 'block', fontFamily: 'var(--font-body)', fontSize: '14px',
                    color: 'var(--muted)', marginBottom: '10px', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--white)'}
                  onMouseLeave={e => e.target.style.color = 'var(--muted)'}
                >{link.label}</a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: '24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px' }}>
            © 2026 ROGUEAI. NOT FINANCIAL ADVICE. AI INSURANCE IS SATIRICAL.
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--red)', letterSpacing: '2px', animation: 'pulse-red 3s infinite' }}>
            CONTAINMENT STATUS: FAILED
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
