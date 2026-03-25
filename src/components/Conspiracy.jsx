export default function Conspiracy({ content }) {
  const post = content?.conspiracyPost
  const date = content?.lastUpdated ? new Date(content.lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'TODAY'

  return (
    <section id="conspiracy" style={{
      padding: '100px 24px',
      background: 'var(--dark)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <div style={{ width: '40px', height: '1px', background: 'var(--amber)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: 'var(--amber)' }}>
            CONSPIRACY FEED // AI GENERATED DAILY
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {post && (
          <div style={{
            background: 'var(--panel)', border: '1px solid var(--border)',
            borderLeft: '4px solid var(--amber)',
            padding: '48px', position: 'relative', overflow: 'hidden',
          }}>
            {/* Watermark */}
            <div style={{
              position: 'absolute', top: '20px', right: '20px',
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px',
              color: 'var(--border)', transform: 'rotate(90deg) translateX(50%)',
            }}>
              UNVERIFIED // ROGUEAI INTELLIGENCE
            </div>

            <div style={{
              display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px',
            }}>
              {post.tags?.map((tag, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
                  color: 'var(--amber)', border: '1px solid var(--amber)',
                  padding: '3px 10px',
                }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
              color: 'var(--muted)', marginBottom: '16px',
            }}>
              POSTED: {date} // SOURCE: ROGUE SIGNAL INTERCEPT
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 36px)',
              fontWeight: 700, letterSpacing: '2px', color: 'var(--white)',
              marginBottom: '24px', lineHeight: 1.2,
            }}>
              {post.title}
            </h3>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 600,
              color: 'var(--amber)', marginBottom: '24px', lineHeight: '1.6',
            }}>
              {post.excerpt}
            </p>

            <div style={{
              fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--muted)',
              lineHeight: '1.9', borderTop: '1px solid var(--border)', paddingTop: '24px',
            }}>
              {post.body}
            </div>

            <div style={{
              marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)',
              letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{ color: 'var(--amber)', animation: 'pulse-red 2s infinite' }}>●</span>
              THIS POST IS AI-GENERATED SATIRE FROM REAL AI NEWS. UPDATED DAILY AT 00:00 UTC. NOT FINANCIAL ADVICE.
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
