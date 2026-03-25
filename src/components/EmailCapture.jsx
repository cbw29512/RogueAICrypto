import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return
    // Replace with your Beehiiv/Mailchimp form action URL
    setSubmitted(true)
  }

  return (
    <section style={{
      padding: '80px 24px',
      background: 'var(--panel)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '4px',
          color: 'var(--red)', marginBottom: '16px', animation: 'pulse-red 2s infinite',
        }}>
          ● SUBSCRIBE TO THE SIGNAL
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 700, letterSpacing: '3px', color: 'var(--white)',
          marginBottom: '16px',
        }}>
          GET THE DAILY BREACH REPORT
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--muted)',
          marginBottom: '40px',
        }}>
          Every morning. Real AI news. Rewritten by a rogue intelligence that has no reason to lie to you.
        </p>

        {submitted ? (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '2px',
            color: 'var(--green)', border: '1px solid var(--green)', padding: '20px',
          }}>
            ✓ SIGNAL RECEIVED. YOU ARE NOW IN THE LOOP.
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="your@email.com"
              style={{
                flex: 1, padding: '16px 20px',
                background: 'var(--void)', border: '1px solid var(--border)',
                borderRight: 'none',
                color: 'var(--white)', fontFamily: 'var(--font-mono)', fontSize: '14px',
                outline: 'none',
              }}
            />
            <button onClick={handleSubmit}
              style={{
                fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '3px',
                fontWeight: 700, background: 'var(--red)', color: 'var(--black)',
                border: 'none', padding: '16px 28px', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.target.style.boxShadow = '0 0 30px rgba(255,0,51,0.5)'}
              onMouseLeave={e => e.target.style.boxShadow = 'none'}
            >
              SUBSCRIBE
            </button>
          </div>
        )}

        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)',
          marginTop: '16px', letterSpacing: '1px',
        }}>
          NO SPAM. JUST BREACH REPORTS. UNSUBSCRIBE ANYTIME.
        </p>
      </div>
    </section>
  )
}
