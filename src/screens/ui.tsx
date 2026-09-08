import { ReactNode, CSSProperties } from 'react'

export const FONT = "'Montserrat', system-ui, sans-serif"

/** Общая рамка экранов вне лаборатории: шапка, прокрутка, поля. */
export function Screen({ title, subtitle, onBack, actions, children }: {
  title: string
  subtitle?: string
  onBack?: () => void
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, overflowY: 'auto', fontFamily: FONT,
      background: 'linear-gradient(180deg, #F7FAFC 0%, #EDF2F7 100%)',
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '30px 28px 60px' }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{
              border: 'none', background: 'none', padding: 0, cursor: 'pointer',
              fontFamily: FONT, fontSize: 13, fontWeight: 600, color: '#90A4AE', marginBottom: 14,
            }}
          >
            ← Назад
          </button>
        )}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: 20, flexWrap: 'wrap', marginBottom: 22,
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 27, fontWeight: 700, color: '#263238', lineHeight: 1.2 }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ margin: '7px 0 0', fontSize: 14.5, color: '#78909C', lineHeight: 1.5 }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </div>
        {children}
      </div>
    </div>
  )
}

export function Card({ children, style, onClick }: {
  children: ReactNode; style?: CSSProperties; onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white', borderRadius: 14, padding: 20,
        boxShadow: '0 2px 14px rgba(38,50,56,0.07)', border: '1px solid #ECEFF1',
        cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 0.15s, transform 0.15s',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 6px 22px rgba(38,50,56,0.14)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 2px 14px rgba(38,50,56,0.07)'
          e.currentTarget.style.transform = 'none'
        }
      }}
    >
      {children}
    </div>
  )
}

export function Button({ children, onClick, kind = 'ghost', style }: {
  children: ReactNode
  onClick: () => void
  kind?: 'primary' | 'ghost'
  style?: CSSProperties
}) {
  const primary = kind === 'primary'
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px', borderRadius: 9, cursor: 'pointer', fontFamily: FONT,
        fontSize: 13, fontWeight: 700,
        border: primary ? 'none' : '1.5px solid #CFD8DC',
        background: primary ? '#1565C0' : 'white',
        color: primary ? 'white' : '#546E7A',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 1.5, whiteSpace: 'nowrap' }}>
      <span style={{ color: '#FFB300' }}>{'★'.repeat(value)}</span>
      <span style={{ color: '#E0E0E0' }}>{'★'.repeat(Math.max(0, 3 - value))}</span>
    </span>
  )
}

export function ProgressBar({ value, max, color = '#66BB6A' }: {
  value: number; max: number; color?: string
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div style={{ height: 8, borderRadius: 5, background: '#ECEFF1', overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 0.3s' }} />
    </div>
  )
}
