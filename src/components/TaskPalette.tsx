import { REAGENT_MAP } from '../reactions'

const FONT = "'Montserrat', system-ui, sans-serif"

interface Props {
  /** Только разрешённые задачей реагенты: полная палитра превращает задачу в перебор */
  reagents: string[]
  tubeSelected: boolean
  /** Реактивы кончились — приливать всё ещё можно, но уже в минус по бюджету */
  overBudget: boolean
  onReagentClick: (id: string) => void
  onClearTube: () => void
  /** 'panel' — окно справа от стола (десктоп), 'sheet' — внутри шторки (телефон) */
  layout?: 'panel' | 'sheet'
}

/**
 * Палитра режима заданий. Палитры песочницы здесь не переиспользуются
 * намеренно: там реагент ищут по группам среди 140 штук, здесь их 4–6 и
 * весь смысл — в том, что список короткий и выбор осмысленный.
 */
export function TaskPalette({
  reagents, tubeSelected, overBudget, onReagentClick, onClearTube, layout = 'panel',
}: Props) {
  const heat = reagents.includes('heat')
  const list = reagents.filter((id) => id !== 'heat')
  const sheet = layout === 'sheet'

  return (
    <div style={sheet ? {
      fontFamily: FONT, userSelect: 'none', display: 'flex', flexDirection: 'column',
    } : {
      position: 'fixed', right: 16, top: 16, width: 208,
      background: 'white', borderRadius: 12, zIndex: 500,
      boxShadow: '0 2px 24px rgba(0,0,0,0.15)', fontFamily: FONT,
      display: 'flex', flexDirection: 'column', userSelect: 'none',
      maxHeight: 'calc(100vh - 32px)',
    }}>
      <div style={{
        padding: sheet ? '0 0 8px' : '11px 13px 8px', borderBottom: '1px solid #f0f0f0',
        fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 0.5,
      }}>
        ДОСТУПНЫЕ РЕАГЕНТЫ
      </div>

      <div style={{
        padding: sheet ? '9px 0' : '9px 10px',
        display: sheet ? 'grid' : 'flex',
        gridTemplateColumns: sheet ? 'repeat(auto-fill, minmax(96px, 1fr))' : undefined,
        flexDirection: sheet ? undefined : 'column',
        gap: sheet ? 6 : 4,
        overflowY: sheet ? undefined : 'auto',
      }}>
        {list.map((id) => {
          const r = REAGENT_MAP[id]
          if (!r) return null
          return (
            <button
              key={id}
              disabled={!tubeSelected}
              onClick={() => onReagentClick(id)}
              title={tubeSelected ? `Прилить ${r.label}` : 'Сначала выберите пробирку'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                justifyContent: sheet ? 'center' : undefined,
                // На телефоне кнопка должна быть не меньше пальца
                minHeight: sheet ? 44 : undefined,
                border: '1.5px solid #e8e8e8', borderRadius: 7, padding: '7px 10px',
                background: tubeSelected ? 'white' : '#fafafa',
                cursor: tubeSelected ? 'pointer' : 'not-allowed',
                fontSize: 13, fontWeight: 500, fontFamily: FONT,
                textAlign: sheet ? 'center' : 'left',
                color: tubeSelected ? '#333' : '#bbb',
              }}
              onMouseEnter={(e) => { if (tubeSelected) e.currentTarget.style.background = '#f0f7ff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = tubeSelected ? 'white' : '#fafafa' }}
            >
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                background: r.color, border: '1px solid #ccc', flexShrink: 0,
              }} />
              {r.label}
            </button>
          )
        })}

        {heat && (
          <button
            disabled={!tubeSelected}
            onClick={() => onReagentClick('heat')}
            style={{
              marginTop: 2, padding: sheet ? '13px 0' : '9px 0', border: 'none', borderRadius: 8,
              gridColumn: sheet ? '1 / -1' : undefined,
              background: tubeSelected ? 'linear-gradient(135deg, #FF5722, #FF8F00)' : '#F5F5F5',
              color: tubeSelected ? '#fff' : '#ccc', fontSize: 13, fontWeight: 700,
              fontFamily: FONT, cursor: tubeSelected ? 'pointer' : 'not-allowed',
            }}
          >
            🔥 Прокалить
          </button>
        )}

        {list.length === 0 && !heat && (
          <p style={{
            margin: 0, fontSize: 11, color: '#bbb', lineHeight: 1.4,
            gridColumn: sheet ? '1 / -1' : undefined,
          }}>
            В этой задаче реагенты не нужны — ответ виден по окраске пламени.
          </p>
        )}
      </div>

      <div style={{ padding: sheet ? '0 0 4px' : '0 10px 11px' }}>
        <div style={{ borderTop: '1px solid #f0f0f0', marginBottom: 8 }} />
        <button
          disabled={!tubeSelected}
          onClick={onClearTube}
          title="Взять свежую порцию образца"
          style={{
            width: '100%', minHeight: sheet ? 44 : undefined,
            border: '1.5px solid #FFCCBC', borderRadius: 7, padding: '7px 10px',
            background: tubeSelected ? '#FFF3E0' : '#fafafa',
            cursor: tubeSelected ? 'pointer' : 'not-allowed',
            fontSize: 12, fontWeight: 600, fontFamily: FONT,
            color: tubeSelected ? '#BF360C' : '#ccc',
          }}
        >
          Свежая порция
        </button>
        {overBudget && (
          <p style={{ margin: '8px 0 0', fontSize: 10.5, color: '#E64A19', lineHeight: 1.4 }}>
            Реактивы израсходованы. Приливать можно, но задача будет засчитана
            на одну звезду.
          </p>
        )}
      </div>
    </div>
  )
}
