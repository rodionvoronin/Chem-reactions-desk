import { ReactNode } from 'react'

const FONT = "'Montserrat', system-ui, sans-serif"

/** Высота полосы вкладок — на неё Lab делает отступ, чтобы панель не перекрывалась */
export const TAB_BAR_HEIGHT = 54

export interface SheetTab {
  id: string
  label: string
  icon?: string
}

interface Props {
  tabs: SheetTab[]
  /** Открытая вкладка; null — шторка свёрнута и виден только стол */
  active: string | null
  onSelect: (id: string | null) => void
  children: ReactNode
}

/**
 * Нижняя шторка с вкладками — замена плавающим палитрам на телефоне.
 * На десктопе не используется: там палитры остаются отдельными окнами,
 * которые можно двигать по столу.
 */
export function BottomSheet({ tabs, active, onSelect, children }: Props) {
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 700,
      fontFamily: FONT, userSelect: 'none',
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: 'white',
      boxShadow: '0 -3px 20px rgba(38,50,56,0.16)',
    }}>
      {active !== null && (
        <div style={{
          borderBottom: '1px solid #ECEFF1',
          maxHeight: '56vh', overflowY: 'auto', overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}>
          {/* Полоска-ручка: показывает, что шторку можно закрыть */}
          <div
            onClick={() => onSelect(null)}
            style={{
              display: 'flex', justifyContent: 'center', padding: '8px 0 4px',
              cursor: 'pointer', position: 'sticky', top: 0, background: 'white',
            }}
          >
            <div style={{ width: 38, height: 4, borderRadius: 3, background: '#CFD8DC' }} />
          </div>
          <div style={{ padding: '4px 12px 14px' }}>
            {children}
          </div>
        </div>
      )}

      <div style={{
        display: 'flex', height: TAB_BAR_HEIGHT, alignItems: 'stretch',
        overflowX: 'auto', borderTop: active === null ? '1px solid #ECEFF1' : 'none',
      }}>
        {tabs.map((tab) => {
          const open = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(open ? null : tab.id)}
              style={{
                flex: '1 0 auto', minWidth: 72, border: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 3, padding: '0 10px',
                cursor: 'pointer', fontFamily: FONT,
                color: open ? '#1565C0' : '#78909C',
                borderTop: `3px solid ${open ? '#1565C0' : 'transparent'}`,
                background: open ? '#E3F2FD' : 'none',
              }}
            >
              {tab.icon && <span style={{ fontSize: 15, lineHeight: 1 }}>{tab.icon}</span>}
              <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Кирпичики для содержимого вкладок ────────────────────────────────────────

export function SheetSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {title && (
        <div style={{
          fontSize: 9.5, fontWeight: 700, color: '#aaa',
          letterSpacing: 0.7, marginBottom: 6,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

/**
 * Сетка кнопок под палец: минимальная сторона 44 пикселя — ниже этого
 * по мобильным рекомендациям попасть уже тяжело.
 */
export function SheetGrid({ children, min = 84 }: { children: ReactNode; min?: number }) {
  return (
    <div style={{
      display: 'grid', gap: 6,
      gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
    }}>
      {children}
    </div>
  )
}

export function ReagentButton({ label, color, disabled, onClick }: {
  label: string
  color?: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        minHeight: 44, padding: '8px 10px',
        border: '1.5px solid #E0E0E0', borderRadius: 9,
        background: disabled ? '#FAFAFA' : 'white',
        color: disabled ? '#C5CAD0' : '#37474F',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FONT, fontSize: 13, fontWeight: 600,
        textAlign: 'center', lineHeight: 1.2,
      }}
    >
      {color && (
        <span style={{
          width: 11, height: 11, borderRadius: '50%', background: color,
          border: '1px solid rgba(0,0,0,0.18)', flexShrink: 0,
        }} />
      )}
      {label}
    </button>
  )
}

export function SheetAction({ label, tone = 'neutral', disabled, onClick }: {
  label: string
  tone?: 'neutral' | 'primary' | 'warning' | 'heat'
  disabled?: boolean
  onClick: () => void
}) {
  const palette = {
    neutral: { bg: 'white', border: '#CFD8DC', color: '#546E7A' },
    primary: { bg: '#E3F2FD', border: '#90CAF9', color: '#1565C0' },
    warning: { bg: '#FFF3E0', border: '#FFCCBC', color: '#BF360C' },
    heat:    { bg: 'linear-gradient(135deg, #FF5722, #FF8F00)', border: 'transparent', color: '#fff' },
  }[tone]

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        minHeight: 44, padding: '10px 12px', borderRadius: 9,
        border: `1.5px solid ${disabled ? '#EEEEEE' : palette.border}`,
        background: disabled ? '#FAFAFA' : palette.bg,
        color: disabled ? '#C5CAD0' : palette.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: FONT, fontSize: 13, fontWeight: 700,
      }}
    >
      {label}
    </button>
  )
}
