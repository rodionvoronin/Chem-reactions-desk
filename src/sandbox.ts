import { BurnerState } from './components/Burner'
import { createTube, TubeState } from './components/TestTube'
import { FLAME_METALS } from './components/FlameColorsPalette'
import { REAGENT_MAP, SERVICE_TOKENS } from './reactions'
import { withReactions } from './tube'

export interface BenchState {
  tubes: TubeState[]
  burners: BurnerState[]
  selectedTubeId: string | null
  selectedBurnerId: string | null
  recent: string[]
}
const KEY = 'chem-desk.sandbox.v1'
const known = (id: unknown): id is string => typeof id === 'string' && Object.prototype.hasOwnProperty.call(REAGENT_MAP, id)
export function saveBench(state: BenchState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({
      ...state, version: 1,
      tubes: state.tubes.map(({ id, contents, isDry, material, vessel, name, lastAction }) =>
        ({ id, contents, isDry, material: material ?? 'glass', vessel, name, lastAction })),
      burners: state.burners.map(({ id, metalId }) => ({ id, metalId })),
    }))
  } catch { /* При недоступном хранилище стол работает в памяти. */ }
}

export function loadBench(): BenchState | null {
  try {
    const raw = JSON.parse(sessionStorage.getItem(KEY) ?? 'null')
    if (raw?.version !== 1 || !Array.isArray(raw.tubes) || !Array.isArray(raw.burners)) return null
    const ids = new Set<string>()
    for (const item of [...raw.tubes, ...raw.burners]) {
      if (typeof item?.id !== 'string' || !/^[a-zA-Z0-9-]+$/.test(item.id) || ids.has(item.id)) return null
      ids.add(item.id)
    }
    const tubes: TubeState[] = []
    for (const t of raw.tubes) {
      if (!Array.isArray(t.contents) || !t.contents.every(known) || typeof t.isDry !== 'boolean') return null
      tubes.push(withReactions({
        ...createTube(t.id), isDry: t.isDry, material: t.material === 'ptfe' ? 'ptfe' : 'glass',
        vessel: t.vessel === 'heap' ? 'heap' : undefined,
        name: typeof t.name === 'string' ? t.name.slice(0, 32) : undefined,
        lastAction: typeof t.lastAction === 'string' ? t.lastAction : undefined,
      }, t.contents))
    }
    const burners = raw.burners.map((b: BurnerState) => {
      const metal = FLAME_METALS.find(m => m.id === b.metalId)
      return { id: b.id, metalId: metal?.id ?? '', flameColor: metal?.color ?? '',
        metalLabel: metal ? `${metal.name} (${metal.symbol})` : '' }
    })
    const selectedTubeId = tubes.find(t => t.id === raw.selectedTubeId)?.id ?? null
    return { tubes, burners, selectedTubeId,
      selectedBurnerId: selectedTubeId ? null : burners.find((b: BurnerState) => b.id === raw.selectedBurnerId)?.id ?? null,
      recent: Array.isArray(raw.recent) ? raw.recent.filter((id: unknown) => known(id) && !SERVICE_TOKENS.has(id)).slice(0, 5) : [],
    }
  } catch { return null }
}
