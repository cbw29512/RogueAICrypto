import { MERCH_STORE_URL } from '../../site.config.mjs'
import items from '../data/merch.json'

// Products come from src/data/merch.json, written by scripts/refresh_merch.py
// from the live Printify storefront. Run it before every deploy so this
// section never shows a product that was removed from the shop.
const UTM = 'utm_source=rogueaicrypto&utm_medium=website&utm_campaign=merch'
const withUtm = (url) => `${url}${url.includes('?') ? '&' : '?'}${UTM}`

export default function Merch() {
  const STORE = MERCH_STORE_URL

  return (
    <section id="merch" style={{
      padding: '100px 24px',
      background: 'var(--void)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '1px', background: 'var(--red)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '4px', color: 'var(--red)' }}>
            MERCH
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 700, color: 'var(--white)', marginBottom: '16px', letterSpacing: '3px',
        }}>
          WEAR THE LESSON
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '18px', color: '#cfd3dc',
          marginBottom: '48px', maxWidth: '640px',
        }}>
          Shirts, hoodies and mugs based on the free RogueAI Linux lessons.
          Each one is printed when you order it.
        </p>

        <div className="merch-grid">
          {items.map((item) => (
            <a key={item.id} className="merch-card" href={withUtm(item.url)} target="_blank" rel="noopener noreferrer">
              <img src={item.image} alt={`${item.name} ${item.kind.toLowerCase()}`} loading="lazy" width="600" height="600" />
              <div className="merch-info">
                <div className="merch-name">{item.name}</div>
                <div className="merch-meta">{item.kind} · from {item.price}</div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href={withUtm(STORE)} target="_blank" rel="noopener noreferrer" className="merch-store-btn">
            SEE THE WHOLE SHOP →
          </a>
        </div>
      </div>

      <style>{`
        #merch .merch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 48px; }
        #merch .merch-card { display: block; text-decoration: none; background: var(--panel); border: 1px solid var(--border); transition: border-color 0.2s; overflow: hidden; }
        #merch .merch-card:hover, #merch .merch-card:focus-visible { border-color: var(--red); }
        #merch .merch-card img { display: block; width: 100%; height: auto; aspect-ratio: 1 / 1; object-fit: cover; background: #fff; }
        #merch .merch-info { padding: 16px 18px 20px; }
        #merch .merch-name { font-family: var(--font-display); font-size: 17px; letter-spacing: 1px; color: var(--white); margin-bottom: 6px; }
        #merch .merch-meta { font-family: var(--font-body); font-size: 16px; color: #cfd3dc; }
        #merch .merch-store-btn { font-family: var(--font-display); font-size: 14px; letter-spacing: 3px; font-weight: 700; border: 1px solid var(--red); color: var(--red); padding: 16px 48px; display: inline-block; transition: all 0.2s; }
        #merch .merch-store-btn:hover { background: var(--red); color: var(--black); }
        @media (max-width: 768px) { #merch .merch-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { #merch .merch-grid { gap: 10px; } #merch .merch-info { padding: 12px; } #merch .merch-name { font-size: 15px; } }
      `}</style>
    </section>
  )
}
