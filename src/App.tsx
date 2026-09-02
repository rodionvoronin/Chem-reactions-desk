import { useState, useCallback } from 'react'
import { TestTube, TubeState, createTube, fmtId } from './components/TestTube'
import { Burner, BurnerState, createBurner } from './components/Burner'
import { GroupsPalette } from './components/GroupsPalette'
import { CommonPalette } from './components/CommonPalette'
import { FlameColorsPalette } from './components/FlameColorsPalette'
import { SolidsPalette } from './components/SolidsPalette'
import { matchReactions, getReactionDescription, getPrecipitateLabel } from './reactions'

const FONT = "'Montserrat', system-ui, sans-serif"

let nextId = 1
const genId = (prefix: string) => `${prefix}${nextId++}`

export default function App() {
  const [tubes, setTubes] = useState<TubeState[]>(() => [createTube(genId('t'))])
  const [burners, setBurners] = useState<BurnerState[]>([])
  const [selectedTubeId, setSelectedTubeId] = useState<string | null>(null)
  const [selectedBurnerId, setSelectedBurnerId] = useState<string | null>(null)

  const selectedTube = tubes.find((t) => t.id === selectedTubeId) ?? null
  const selectedBurner = burners.find((b) => b.id === selectedBurnerId) ?? null

  // ── Пробирки ──────────────────────────────────────────────────────────────

  /** Пересчитывает состояние пробирки по её содержимому через движок реакций. */
  const applyReactions = (tube: TubeState, contents: string[]): TubeState => {
    const effects = matchReactions(contents)
    return {
      ...tube,
      contents,
      liquidColor: effects.liquidColor ?? tube.liquidColor,
      hasPrecipitate: effects.precipitate !== undefined,
      precipitateColor: effects.precipitate?.color ?? tube.precipitateColor,
      gasActive: effects.gas ?? false,
      reactionDesc: getReactionDescription(contents) ?? '',
    }
  }

  const handleReagentClick = useCallback((reagentId: string) => {
    setTubes((prev) =>
      prev.map((t) =>
        t.id === selectedTubeId ? applyReactions(t, [...t.contents, reagentId]) : t
      )
    )
  }, [selectedTubeId])

  const handleAddTube = useCallback(() => {
    const tube = createTube(genId('t'))
    setTubes((prev) => [...prev, tube])
    setSelectedTubeId(tube.id)
    setSelectedBurnerId(null)
  }, [])

  const handleClearTube = useCallback(() => {
    setTubes((prev) =>
      prev.map((t) => (t.id === selectedTubeId ? { ...createTube(t.id), isDry: t.isDry } : t))
    )
  }, [selectedTubeId])

  const handleRemoveTube = useCallback(() => {
    setTubes((prev) => prev.filter((t) => t.id !== selectedTubeId))
    setSelectedTubeId(null)
  }, [selectedTubeId])

  const handleToggleDry = useCallback(() => {
    setTubes((prev) =>
      prev.map((t) => (t.id === selectedTubeId ? { ...t, isDry: !t.isDry } : t))
    )
  }, [selectedTubeId])

  const selectTube = useCallback((id: string) => {
    setSelectedTubeId(id)
    setSelectedBurnerId(null)
  }, [])

  // ── Горелки ───────────────────────────────────────────────────────────────

  const handleAddBurner = useCallback(() => {
    const burner = createBurner(genId('b'))
    setBurners((prev) => [...prev, burner])
    setSelectedBurnerId(burner.id)
    setSelectedTubeId(null)
  }, [])

  const handleSetFlame = useCallback((color: string, label: string, metalId: string) => {
    setBurners((prev) =>
      prev.map((b) =>
        b.id === selectedBurnerId ? { ...b, flameColor: color, metalLabel: label, metalId } : b
      )
    )
  }, [selectedBurnerId])

  const handleClearFlame = useCallback(() => {
    setBurners((prev) =>
      prev.map((b) =>
        b.id === selectedBurnerId ? { ...b, flameColor: '', metalLabel: '', metalId: '' } : b
      )
    )
  }, [selectedBurnerId])

  const handleRemoveBurner = useCallback(() => {
    setBurners((prev) => prev.filter((b) => b.id !== selectedBurnerId))
    setSelectedBurnerId(null)
  }, [selectedBurnerId])

  const selectBurner = useCallback((id: string) => {
    setSelectedBurnerId(id)
    setSelectedTubeId(null)
  }, [])

  // ── Разметка ──────────────────────────────────────────────────────────────

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(180deg, #F7FAFC 0%, #EDF2F7 100%)',
      fontFamily: FONT, overflow: 'hidden',
    }}>
      {/* ── Рабочая зона ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        paddingLeft: 224, paddingRight: 280,
      }}>
        {/* Лабораторный стол */}
        <div
          onClick={() => { setSelectedTubeId(null); setSelectedBurnerId(null) }}
          style={{
            flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            overflowX: 'auto', overflowY: 'hidden', paddingBottom: 8, minHeight: 0,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'flex-end', gap: 4, padding: '80px 24px 0' }}
          >
            {tubes.map((tube, i) => (
              <TestTube
                key={tube.id}
                tube={tube}
                index={i}
                selected={tube.id === selectedTubeId}
                onSelect={() => selectTube(tube.id)}
              />
            ))}
            {burners.map((burner, i) => (
              <Burner
                key={burner.id}
                burner={burner}
                index={i}
                selected={burner.id === selectedBurnerId}
                onSelect={() => selectBurner(burner.id)}
              />
            ))}
            {tubes.length === 0 && burners.length === 0 && (
              <div style={{
                padding: '60px 40px', color: '#B0BEC5', fontSize: 14,
                textAlign: 'center', lineHeight: 1.6,
              }}>
                Стол пуст.<br />Добавьте пробирку или горелку.
              </div>
            )}
          </div>
        </div>

        {/* Столешница */}
        <div style={{
          height: 14, background: 'linear-gradient(180deg, #CFD8DC, #B0BEC5)',
          borderRadius: '4px 4px 0 0', boxShadow: '0 -2px 10px rgba(0,0,0,0.06)', flexShrink: 0,
        }} />

        {/* ── Панель результата ── */}
        <div style={{
          minHeight: 132, maxHeight: 190, overflowY: 'auto', flexShrink: 0,
          background: 'white', borderTop: '1px solid #E0E0E0',
          padding: '14px 24px 18px',
        }}>
          {selectedTube ? (
            <ResultPanel tube={selectedTube} />
          ) : selectedBurner ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#546E7A', fontSize: 14 }}>
              {selectedBurner.metalLabel ? (
                <>
                  <span style={{
                    width: 14, height: 14, borderRadius: '50%',
                    background: selectedBurner.flameColor,
                    border: '1px solid rgba(0,0,0,0.18)', display: 'inline-block',
                  }} />
                  Окрашивание пламени: <b>{selectedBurner.metalLabel}</b>
                </>
              ) : (
                <span style={{ color: '#90A4AE' }}>
                  Горелка выбрана. Выберите ион в палитре справа, чтобы окрасить пламя.
                </span>
              )}
            </div>
          ) : (
            <div style={{ color: '#B0BEC5', fontSize: 14 }}>
              Выберите пробирку или горелку, чтобы увидеть результат.
            </div>
          )}
        </div>
      </div>

      {/* ── Палитры ── */}
      <CommonPalette
        onReagentClick={handleReagentClick}
        tubeSelected={!!selectedTube}
      />

      <GroupsPalette
        onReagentClick={handleReagentClick}
        onAddTube={handleAddTube}
        onClearTube={handleClearTube}
        onRemoveTube={handleRemoveTube}
        tubeSelected={!!selectedTube}
      />

      <SolidsPalette
        onReagentClick={handleReagentClick}
        tubeSelected={!!selectedTube}
        isDry={selectedTube?.isDry ?? false}
        onToggleDry={handleToggleDry}
      />

      <FlameColorsPalette
        burnerSelected={!!selectedBurner}
        currentMetalId={selectedBurner?.metalId ?? ''}
        onAddBurner={handleAddBurner}
        onSetFlame={handleSetFlame}
        onClearFlame={handleClearFlame}
        onRemoveBurner={handleRemoveBurner}
      />
    </div>
  )
}

// ── Панель результата реакции ─────────────────────────────────────────────────

function ResultPanel({ tube }: { tube: TubeState }) {
  const { contents, reactionDesc, hasPrecipitate, precipitateColor, gasActive } = tube

  if (contents.length === 0) {
    return (
      <div style={{ color: '#B0BEC5', fontSize: 14 }}>
        Пробирка пуста. Добавьте реагенты из палитр слева.
      </div>
    )
  }

  // Движок склеивает несколько одновременных реакций через « · »
  const equations = reactionDesc ? reactionDesc.split('  ·  ') : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Состав */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#90A4AE', letterSpacing: 0.6 }}>
          СОСТАВ
        </span>
        <span
          style={{ fontSize: 15, fontWeight: 700, color: '#37474F' }}
          dangerouslySetInnerHTML={{ __html: contents.map(fmtId).join(' + ') }}
        />
      </div>

      {/* Уравнения реакций */}
      {equations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {equations.map((eq, i) => (
            <div key={i} style={{
              background: '#E8F5E9', borderLeft: '3px solid #66BB6A', borderRadius: 6,
              padding: '9px 14px', fontSize: 14, fontWeight: 600, color: '#2E7D32',
            }}>
              {eq}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: '#FAFAFA', borderLeft: '3px solid #E0E0E0', borderRadius: 6,
          padding: '9px 14px', fontSize: 13, color: '#9E9E9E',
        }}>
          Видимых признаков реакции нет.
        </div>
      )}

      {/* Наблюдения */}
      {(hasPrecipitate || gasActive) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {hasPrecipitate && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#FAFAFA', borderRadius: 20, padding: '5px 14px',
              fontSize: 13, color: '#555', border: '1px solid #ECEFF1',
            }}>
              <span style={{
                width: 11, height: 11, borderRadius: '50%', background: precipitateColor,
                border: '1px solid rgba(0,0,0,0.18)', flexShrink: 0,
              }} />
              {getPrecipitateLabel(precipitateColor)}
            </span>
          )}
          {gasActive && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#E3F2FD', borderRadius: 20, padding: '5px 14px',
              fontSize: 13, color: '#1565C0', border: '1px solid #BBDEFB',
            }}>
              ↑ выделение газа
            </span>
          )}
        </div>
      )}
    </div>
  )
}
