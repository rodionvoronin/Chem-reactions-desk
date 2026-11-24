import type { TubeState } from './TestTube'
import { ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { REAGENT_MAP } from '../reactions'


export const TOOLBAR_HEIGHT = 52

interface Props {
  narrow: boolean
  name: string
  onRename: (name: string) => void
  onDuplicate: () => void
  onNew: () => void
  canUndo: boolean
  onUndo: () => void
  samples: TubeState[]
  selectedId: string | null
  renderResult: (tube: TubeState) => ReactNode
  onExit: () => void
  /** Подпись выбранного объекта: «Пробирка 2», «Горелка 1» или пусто */
  selectionLabel: string
  tubeSelected: boolean
  burnerSelected: boolean
  isDry: boolean
  onToggleDry: (dry: boolean) => void
  onHeat: () => void
  /** Оставить пробирку на воздухе: кислород окисляет содержимое */
  onAir: () => void
  /** Выбрана горка, а не пробирка: другой набор действий */
  heapSelected: boolean
  onAddHeap: () => void
  /** Капнуть воды на горку — запускает реакцию иода с металлами */
  onDrop: () => void
  /** Из чего сделана выбранная пробирка */
  material: 'glass' | 'ptfe'
  onSetMaterial: (material: 'glass' | 'ptfe') => void
  isolatable: string | null
  onIsolate: () => void
  onAddTube: () => void
  onAddBurner: () => void
  onClearTube: () => void
  onRemoveTube: () => void
  onClearFlame: () => void
  onRemoveBurner: () => void
  /** Сколько посуды отмечено; null — режим «Выбрать несколько» выключен */
  markedCount: number | null
  /** Сколько всего посуды на столе */
  totalCount: number
  onStartMarking: () => void
  onMarkAll: () => void
  onRemoveMarked: () => void
  onStopMarking: () => void
}

export function BenchToolbar(p: Props) {
  const [panel, setPanel] = useState<'tools' | 'compare' | null>(null)
  const [pair, setPair] = useState<string[]>([])
  const [name, setName] = useState('')
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const open = () => { setName(p.name); setPanel('tools') }
  const close = () => setPanel(null)
  useLayoutEffect(() => {
    if (!panel) return
    const node = dialog.current
    if (!node || node.open) return
    node.showModal()
    return () => { node.close(); trigger.current?.focus() }
  }, [panel])
  const perform = (action: () => void) => { action(); close() }
  const compare = () => {
    const first = p.samples.find(t => t.id === p.selectedId) ?? p.samples[0]
    const second = p.samples.find(t => t.id !== first.id)
    if (second) { setPair([first.id, second.id]); setPanel('compare') }
  }
  const sampleTitle = (t: TubeState) => `Пробирка ${p.samples.indexOf(t) + 1}${t.name ? ' · ' + t.name : ''}`
  const normalTube = p.tubeSelected && !p.heapSelected
  return <>
    <nav className={'bench-toolbar' + (p.narrow ? ' compact' : '')} aria-label="Управление столом">
      {p.markedCount !== null ? <>
        <span aria-live="polite">Выбрано {p.markedCount}</span>
        <button onClick={p.onMarkAll}>Выбрать всё</button>
        <button disabled={!p.markedCount} onClick={p.onRemoveMarked}>Убрать ({p.markedCount})</button>
        <button onClick={p.onStopMarking}>Готово</button>
      </> : <>
        <button onClick={p.onExit}>← В меню</button>
        <strong className="bench-target">{p.selectionLabel || 'Стол'}</strong>
        {!p.narrow && <>
          <button onClick={p.onAddTube}>+ Пробирка</button>
          {p.tubeSelected && <button onClick={p.onHeat}>{p.heapSelected ? 'Поджечь' : 'Нагреть'}</button>}
          {p.isolatable && <button onClick={p.onIsolate}>Выделить {REAGENT_MAP[p.isolatable]?.label}</button>}
        </>}
        <button ref={trigger} aria-haspopup="dialog" onClick={open}>Управление</button>
      </>}
    </nav>
    {panel && <dialog ref={dialog} aria-modal="true" className={'bench-dialog ' + (panel === 'compare' ? 'wide' : '')}
      aria-label={panel === 'compare' ? 'Сравнение проб' : 'Управление столом'}
      onCancel={e => { e.preventDefault(); close() }} onClick={e => { if (e.target === dialog.current) close() }}>
      <div className="bench-dialog-body">
        <header><h2>{panel === 'compare' ? 'Сравнение проб' : 'Управление столом'}</h2><button onClick={close} aria-label="Закрыть">×</button></header>
        {panel === 'tools' ? <>
          <section><h3>Посуда</h3><div className="bench-actions">
            <button onClick={() => perform(p.onAddTube)}>+ Пробирка</button>
            <button onClick={() => perform(p.onAddBurner)}>+ Горелка</button>
            <button onClick={() => perform(p.onAddHeap)}>+ Горка</button>
            {p.totalCount > 1 && <button onClick={() => perform(p.onStartMarking)}>Выбрать несколько</button>}
          </div></section>
          {p.selectionLabel && <section><h3>{p.selectionLabel}</h3>
            {normalTube && <form onSubmit={e => { e.preventDefault(); perform(() => p.onRename(name.trim())) }}>
              <label>Подпись пробы<input maxLength={32} value={name} onChange={e => setName(e.target.value)} placeholder="Например, Контроль" /></label>
              <button type="submit" disabled={name.trim() === p.name}>Сохранить подпись</button>
            </form>}
            <div className="bench-actions">
              {normalTube && <>
                <button aria-pressed={!p.isDry} onClick={() => p.onToggleDry(false)}>Раствор</button>
                <button aria-pressed={p.isDry} onClick={() => p.onToggleDry(true)}>Сухой</button>
                <button aria-pressed={p.material === 'glass'} onClick={() => p.onSetMaterial('glass')}>Стекло</button>
                <button aria-pressed={p.material === 'ptfe'} onClick={() => p.onSetMaterial('ptfe')}>Фторопласт</button>
                <button onClick={() => perform(p.onDuplicate)}>Дублировать пробирку</button>
              </>}
              {p.tubeSelected && <>
                <button onClick={() => perform(p.onHeat)}>{p.heapSelected ? 'Поджечь' : 'Нагреть'}</button>
                <button onClick={() => perform(p.onAir)}>На воздух</button>
                {p.heapSelected && <button onClick={() => perform(p.onDrop)}>Капля воды</button>}
                {p.isolatable && <button onClick={() => perform(p.onIsolate)}>Выделить {REAGENT_MAP[p.isolatable]?.label}</button>}
                <button onClick={() => perform(p.onClearTube)}>Очистить</button>
              </>}
              {p.burnerSelected && <button onClick={() => perform(p.onClearFlame)}>Погасить</button>}
              <button onClick={() => perform(p.burnerSelected ? p.onRemoveBurner : p.onRemoveTube)}>Убрать со стола</button>
            </div>
          </section>}
          <section><h3>Опыт</h3><div className="bench-actions">
            <button disabled={p.samples.length < 2} onClick={compare}>Сравнить две пробы</button>
            <button disabled={!p.canUndo} onClick={() => perform(p.onUndo)}>Отменить последнее действие</button>
            <button onClick={() => perform(p.onNew)}>Новый стол</button>
          </div></section>
        </> : <div className="bench-comparison">{pair.map((id, index) => {
          const tube = p.samples.find(t => t.id === id)
          return tube && <section key={index}>
            <label>Проба для сравнения {index + 1}
              <select value={id} onChange={e => setPair(pair.map((value, i) => i === index ? e.target.value : value))}>
                {p.samples.map(t => <option key={t.id} value={t.id} disabled={t.id === pair[1-index]}>{sampleTitle(t)}</option>)}
              </select>
            </label>
            <p>{tube.isDry ? 'Сухая среда' : 'Раствор'} · {tube.material === 'ptfe' ? 'Фторопласт' : 'Стекло'}</p>
            {p.renderResult(tube)}
          </section>
        })}</div>}
      </div>
    </dialog>}
  </>
}
