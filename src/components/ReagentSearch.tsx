import { useState } from 'react'
import { REAGENT_MAP } from '../reactions'
import { reagentNames } from '../reagentNames'

function normalize(value: string) {
  return value.normalize('NFKC').toLowerCase().replace(/ё/g, 'е').replace(/йод/g, 'иод').replace(/\s+/g, '')
}
const reagents = Object.keys(reagentNames).map(id => ({
  id, formula: normalize(REAGENT_MAP[id].label), name: normalize(reagentNames[id]),
}))

export interface SearchProps {
  recent: string[]
  blocked: boolean
  onPick: (id: string) => void
}

export function ReagentSearch({ recent, blocked, onPick }: SearchProps) {
  const [query, setQuery] = useState('')
  const key = normalize(query)
  const matches = key ? reagents.filter(r => r.formula.includes(key) || r.name.includes(key))
    .sort((a, b) => Number(b.formula === key) - Number(a.formula === key)).map(r => r.id) : recent
  return <div className="reagent-search">
    <input type="search" aria-label="Поиск реагента" placeholder="Формула или название" value={query} onChange={e => setQuery(e.target.value)} />
    {matches.length > 0 && <div className="reagent-matches" aria-label={key ? 'Найденные реагенты' : 'Недавние реагенты'}>
      {!key && <small>Недавние</small>}
      {matches.map(id => <button key={id} disabled={blocked} onClick={() => onPick(id)}>
        <b>{REAGENT_MAP[id].label}</b> {reagentNames[id]}
      </button>)}
    </div>}
    {key && !matches.length && <p role="status">Такого реагента на столе нет.</p>}
  </div>
}
