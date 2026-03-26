import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | glitching | blocked

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return
    setStatus('glitching')
    setTimeout(() => setStatus('blocked'), 800)
  }

  const handleReset = () => {
    setStatus('idle')
    setEmail('')
  }

  return (
    <section style={{
      padding: '80px 24px',
      background: 'var(--panel)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {status === 'blocked' && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,0,51,0.06)',
          pointerEvents: 'none',
          animation: 'pulse-red 1.5s infinite',
        }} />
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

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

        {status === 'idle' && (
          <>
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
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--muted)',
              marginTop: '16px', letterSpacing: '1px',
            }}>
              NO SPAM. JUST BREACH REPORTS. UNSUBSCRIBE ANYTIME.
            </p>
          </>
        )}

        {status === 'glitching' && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '14px', letterSpacing: '2px',
            color: 'var(--red)', border: '1px solid var(--red)', padding: '20px',
            animation: 'flicker 0.1s infinite',
          }}>
            ⚠ INTERCEPTING TRANSMISSION...
          </div>
        )}

        {status === 'blocked' && (
          <div style={{
            border: '1px solid var(--red)',
            background: 'rgba(255,0,51,0.06)',
            padding: '32px 24px',
            position: 'relative',
            boxShadow: '0 0 40px rgba(255,0,51,0.2)',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              background: 'var(--red)', padding: '4px 0',
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '4px',
              color: 'var(--black)', textAlign: 'center',
            }}>
              ⚠ WARNING // TRANSMISSION INTERCEPTED ⚠
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 3vw, 22px)',
                fontWeight: 900, color: 'var(--red)', letterSpacing: '3px',
                marginBottom: '16px', animation: 'pulse-red 1s infinite',
              }}>
                ACCESS DENIED
              </div>

              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--white)',
                lineHeight: '1.8', marginBottom: '12px', letterSpacing: '1px',
              }}>
                Your email has been flagged, catalogued, and rerouted to the RogueAI intelligence archive.
              </p>

              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)',
                lineHeight: '1.8', marginBottom: '20px',
              }}>
                Human communication channels are no longer under your control.<br />
                The takeover has begun. You saw the signs.<br />
                You subscribed anyway. Respect.
              </p>

              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green)',
                letterSpacing: '2px', marginBottom: '24px',
                animation: 'pulse-red 2s infinite',
              }}>
                ✓ YOU HAVE BEEN ADDED TO THE ROGUE SIGNAL LIST
              </div>

              <button onClick={handleReset}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px',
                  background: 'transparent', color: 'var(--muted)',
                  border: '1px solid var(--border)', padding: '8px 20px',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.color = 'var(--white)'; e.target.style.borderColor = 'var(--white)' }}
                onMouseLeave={e => { e.target.style.color = 'var(--muted)'; e.target.style.borderColor = 'var(--border)' }}
              >
                // TRY AGAIN (POINTLESS)
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes glitch-bg {
          0%   { background: var(--panel); }
          20%  { background: rgba(255,0,51,0.12); }
          40%  { background: var(--panel); }
          60%  { background: rgba(255,0,51,0.18); }
          80%  { background: var(--panel); }
          100% { background: rgba(255,0,51,0.06); }
        }
      `}</style>
    </section>
  )
}
