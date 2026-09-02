import { useState, useCallback, useEffect } from 'react'
import {
  TestTube, TubeState, createTube, fmtId,
  DEFAULT_GAS_FILL, DEFAULT_GAS_STROKE,
} from './components/TestTube'
import { Burner, BurnerState, createBurner } from './components/Burner'
import { GroupsPalette } from './components/GroupsPalette'
import { CommonPalette } from './components/CommonPalette'
import { FlameColorsPalette } from './components/FlameColorsPalette'
import { SolidsPalette } from './components/SolidsPalette'
import { matchReactions, getReactionDescription, getPrecipitateLabel } from './reactions'

const FONT = "'Montserrat', system-ui, sans-serif"

let nextId = 1
const genId = (prefix: string) => `${prefix}${nextId++}`

/**
 * Подбирает высоту пробирки под высоту окна: занимаем максимум доступного
 * места, но не вылезаем за экран на ноутбуках. Из высоты окна вычитается
 * всё, что занято постоянно — панель результата, столешница, подпись
 * состава, номер пробирки и отступы.
 */
const CHROME_H = 158 /* панель */ + 14 /* столешница */ + 44 /* отступ сверху */
                + 38 /* подпись */ + 28 /* номер */ + 18 /* поля слота */ + 20 /* запас */

function computeTubeHeight(): number {
  return Math.max(260, Math.min(520, window.innerHeight - CHROME_H))
}

export default function App() {
  const [tubes, setTubes] = useState<TubeState[]>(() => [createTube(genId('t'))])
  const [burners, setBurners] = useState<BurnerState[]>([])
  const [selectedTubeId, setSelectedTubeId] = useState<string | null>(null)
  const [selectedBurnerId, setSelectedBurnerId] = useState<string | null>(null)
  const [tubeH, setTubeH] = useState(computeTubeHeight)

  // Пересчитываем размер посуды при изменении размера окна
  useEffect(() => {
    const onResize = () => setTubeH(computeTubeHeight())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const selectedTube = tubes.find((t) => t.id === selectedTubeId) ?? null
  const selectedBurner = burners.find((b) => b.id === selectedBurnerId) ?? null

  // ── Пробирки ──────────────────────────────────────────────────────────────

  /** Пересчитывает состояние пробирки по её содержимому через движок реакций. */
  const applyReactions = (tube: TubeState, contents: string[]): TubeState => {
    const effects = matchReactions(contents)
    const gas = effects.gasInfo
    return {
      ...tube,
      contents,
      liquidColor: effects.liquidColor ?? tube.liquidColor,
      hasPrecipitate: effects.precipitate !== undefined,
      precipitateColor: effects.precipitate?.color ?? tube.precipitateColor,
      gasActive: effects.gas ?? false,
      gasFill: gas?.fill ?? DEFAULT_GAS_FILL,
      gasStroke: gas?.stroke ?? DEFAULT_GAS_STROKE,
      gasLabel: gas?.label ?? '',
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
            style={{ display: 'flex', alignItems: 'flex-end', gap: 6, padding: '44px 24px 0' }}
          >
            {tubes.map((tube, i) => (
              <TestTube
                key={tube.id}
                tube={tube}
                index={i}
                selected={tube.id === selectedTubeId}
                onSelect={() => selectTube(tube.id)}
                height={tubeH}
              />
            ))}
            {burners.map((burner, i) => (
              <Burner
                key={burner.id}
                burner={burner}
                index={i}
                selected={burner.id === selectedBurnerId}
                onSelect={() => selectBurner(burner.id)}
                height={Math.round(tubeH * 0.86)}
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
          minHeight: 158, maxHeight: 244, overflowY: 'auto', flexShrink: 0,
          background: 'white', borderTop: '1px solid #E0E0E0',
          boxShadow: '0 -3px 14px rgba(0,0,0,0.05)',
          padding: '18px 28px 22px',
        }}>
          {selectedTube ? (
            <ResultPanel tube={selectedTube} />
          ) : selectedBurner ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, color: '#455A64', fontSize: 18 }}>
              {selectedBurner.metalLabel ? (
                <>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: selectedBurner.flameColor,
                    border: '1px solid rgba(0,0,0,0.18)', display: 'inline-block', flexShrink: 0,
                  }} />
                  Окрашивание пламени: <b>{selectedBurner.metalLabel}</b>
                </>
              ) : (
                <span style={{ color: '#90A4AE', fontSize: 16 }}>
                  Горелка выбрана. Выберите ион в палитре справа, чтобы окрасить пламя.
                </span>
              )}
            </div>
          ) : (
            <div style={{ color: '#B0BEC5', fontSize: 16 }}>
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
  const {
    contents, reactionDesc, hasPrecipitate, precipitateColor,
    gasActive, gasFill, gasStroke, gasLabel,
  } = tube

  if (contents.length === 0) {
    return (
      <div style={{ color: '#B0BEC5', fontSize: 16 }}>
        Пробирка пуста. Добавьте реагенты из палитр слева.
      </div>
    )
  }

  // Движок склеивает несколько одновременных реакций через « · »
  const equations = reactionDesc ? reactionDesc.split('  ·  ') : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Состав */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#90A4AE', letterSpacing: 0.8 }}>
          СОСТАВ
        </span>
        <span
          style={{ fontSize: 19, fontWeight: 700, color: '#37474F' }}
          dangerouslySetInnerHTML={{ __html: contents.map(fmtId).join(' + ') }}
        />
      </div>

      {/* Уравнения реакций */}
      {equations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {equations.map((eq, i) => (
            <div key={i} style={{
              background: '#E8F5E9', borderLeft: '5px solid #66BB6A', borderRadius: 8,
              padding: '13px 18px', fontSize: 18, fontWeight: 600, color: '#1B5E20',
              lineHeight: 1.45,
            }}>
              {eq}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: '#FAFAFA', borderLeft: '5px solid #E0E0E0', borderRadius: 8,
          padding: '13px 18px', fontSize: 16, color: '#9E9E9E',
        }}>
          Видимых признаков реакции нет.
        </div>
      )}

      {/* Наблюдения */}
      {(hasPrecipitate || gasActive) && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {hasPrecipitate && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: '#FAFAFA', borderRadius: 22, padding: '8px 18px',
              fontSize: 15, color: '#455A64', border: '1px solid #ECEFF1',
            }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%', background: precipitateColor,
                border: '1px solid rgba(0,0,0,0.18)', flexShrink: 0,
              }} />
              {getPrecipitateLabel(precipitateColor)}
            </span>
          )}
          {gasActive && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 9,
              background: '#FAFAFA', borderRadius: 22, padding: '8px 18px',
              fontSize: 15, color: '#455A64', border: '1px solid #ECEFF1',
            }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%',
                background: gasFill, border: `1.5px solid ${gasStroke}`,
                flexShrink: 0,
              }} />
              ↑ {gasLabel || 'выделение газа'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
