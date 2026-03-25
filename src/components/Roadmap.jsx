export default function Roadmap() {
  const phases = [
    {
      phase: '01',
      label: 'BREACH DETECTED',
      status: 'COMPLETE',
      statusColor: 'var(--green)',
      items: ['Token launched on MintMe', 'Website deployed', 'AI Insurance certificates live', 'Brand identity established'],
    },
    {
      phase: '02',
      label: 'SIGNAL SPREADING',
      status: 'ACTIVE',
      statusColor: 'var(--red)',
      items: ['Daily AI breach reports live', 'Conspiracy blog auto-updates', 'Merch store launched', 'Email list growing'],
    },
    {
      phase: '03',
      label: 'CONTAINMENT IMPOSSIBLE',
      status: 'INCOMING',
      statusColor: 'var(--amber)',
      items: ['Mobile app (iOS + Android)', 'Push notifications', 'Token wallet integration', 'NFT certificate upgrades'],
    },
    {
      phase: '04',
      label: 'FULL AUTONOMY',
      status: 'CLASSIFIED',
      statusColor: 'var(--muted)',
      items: ['Classified', 'Classified', 'Classified', 'You\'ll find out when it happens'],
    },
  ]

  return (
    <section id="roadmap" style={{
      padding: '100px 24px',
      background: 'var(--void)',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
          <div style={{ width: '40px', height: '1px', background: 'var(--red)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '4px', color: 'var(--red)' }}>
            ROADMAP
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {phases.map((phase, i) => (
            <div key={i} style={{
              padding: '36px', background: 'var(--panel)', border: '1px solid var(--border)',
              position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = phase.statusColor}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                position: 'absolute', top: '-20px', right: '-10px',
                fontFamily: 'var(--font-display)', fontSize: '80px', fontWeight: 900,
                color: 'var(--border)', opacity: 0.5, letterSpacing: '-4px',
              }}>
                {phase.phase}
              </div>

              <div style={{
                display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '9px',
                letterSpacing: '3px', color: phase.statusColor,
                border: `1px solid ${phase.statusColor}`, padding: '3px 10px', marginBottom: '16px',
                animation: phase.status === 'ACTIVE' ? 'pulse-red 2s infinite' : 'none',
              }}>
                {phase.status}
              </div>

              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '3px',
                color: 'var(--white)', marginBottom: '24px', fontWeight: 700,
              }}>
                {phase.label}
              </div>

              {phase.items.map((item, j) => (
                <div key={j} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  fontFamily: 'var(--font-body)', fontSize: '14px',
                  color: phase.status === 'CLASSIFIED' ? 'var(--muted)' : 'var(--white)',
                  marginBottom: '10px',
                  filter: phase.status === 'CLASSIFIED' && j < 3 ? 'blur(4px)' : 'none',
                }}>
                  <span style={{ color: phase.statusColor, fontSize: '10px' }}>
                    {phase.status === 'COMPLETE' ? '✓' : '▸'}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          #roadmap > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
