import assert from 'node:assert/strict'
import { createTube } from '../src/components/TestTube'
import { REAGENT_MAP, SERVICE_TOKENS } from '../src/reactions'
import { reagentNames } from '../src/reagentNames'
import { BenchState, loadBench, saveBench } from '../src/sandbox'
import { withReactions } from '../src/tube'

const reagents = Object.keys(REAGENT_MAP).filter(id => !SERVICE_TOKENS.has(id)).sort()
assert.deepEqual(Object.keys(reagentNames).sort(), reagents)

let stored = ''
Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
  setItem: (_key: string, value: string) => { stored = value },
  getItem: () => stored,
} })
const tube = withReactions({ ...createTube('t1'), name: 'Контроль', material: 'ptfe' }, ['CuSO4', 'NaOH'])
const bench: BenchState = { tubes: [tube], burners: [], selectedTubeId: 't1', selectedBurnerId: null, recent: ['NaOH'] }
saveBench(bench)
const copied = loadBench()
assert.equal(copied?.tubes[0].name, 'Контроль')
assert.equal(copied?.tubes[0].material, 'ptfe')
assert.equal(copied?.tubes[0].reactionDesc, tube.reactionDesc)
assert.equal(copied?.tubes[0].hasPrecipitate, true)
assert.equal(copied?.selectedTubeId, 't1')
assert.deepEqual(copied?.recent, ['NaOH'])
const valid = JSON.parse(stored)
for (const broken of ['{', 'null', JSON.stringify({ ...valid, version: 0 }),
  JSON.stringify({ ...valid, tubes: [valid.tubes[0], valid.tubes[0]] }),
  JSON.stringify({ ...valid, tubes: [{ ...valid.tubes[0], contents: ['constructor'] }] })]) {
  stored = broken
  assert.equal(loadBench(), null)
}
saveBench({ ...bench, tubes: [], selectedTubeId: null })
assert.deepEqual(loadBench()?.tubes, [])
Object.defineProperty(globalThis, 'sessionStorage', { get() { throw Error('unavailable') } })
assert.doesNotThrow(() => saveBench(bench))
assert.equal(loadBench(), null)
console.log('Песочница: каталог, состояние проб, пустой стол и восстановление проверены.')
