// ── Схемы для экрана вступления ───────────────────────────────────────────────

/** Сто частиц воздуха: 78 азота, 21 кислорода и одна — всё остальное */
export function AirGrid() {
  const cells = [
    ...Array.from({ length: 78 }, () => ({ color: '#90CAF9', label: 'азот' })),
    ...Array.from({ length: 21 }, () => ({ color: '#EF5350', label: 'кислород' })),
    { color: '#FFCA28', label: 'аргон и другие' },
  ]
  return (
    <div style={{ maxWidth: 520 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 5 }}>
        {cells.map((c, i) => (
          <div key={i} className="kids-pop" style={{
            aspectRatio: '1', borderRadius: '50%', background: c.color,
            animationDelay: `${i * 0.012}s`, boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.15)',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 12, fontSize: 18, color: '#37474F' }}>
        <span><b style={{ color: '#1E88E5' }}>●</b> азот — 78</span>
        <span><b style={{ color: '#E53935' }}>●</b> кислород — 21</span>
        <span><b style={{ color: '#F9A825' }}>●</b> аргон и другие — 1</span>
      </div>
    </div>
  )
}

/** Цвета капустного индикатора от кислой среды к щелочной */
export function PhScale() {
  const steps = [
    { color: '#E91E63', label: 'лимон, уксус' },
    { color: '#F06292', label: 'кефир, яблоко' },
    { color: '#7E57C2', label: 'вода' },
    { color: '#26A69A', label: 'сода' },
    { color: '#43A047', label: 'мыло' },
    { color: '#FDD835', label: 'очень сильные щёлочи' },
  ]
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', borderRadius: 16, overflow: 'hidden', height: 64 }}>
        {steps.map((s) => <div key={s.color} style={{ flex: 1, background: s.color }} />)}
      </div>
      <div style={{ display: 'flex', fontSize: 15, color: '#455A64', marginTop: 6 }}>
        {steps.map((s) => <div key={s.color} style={{ flex: 1, textAlign: 'center', padding: '0 2px' }}>{s.label}</div>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700, marginTop: 8 }}>
        <span style={{ color: '#E91E63' }}>← кислая</span>
        <span style={{ color: '#7E57C2' }}>нейтральная</span>
        <span style={{ color: '#2E7D32' }}>щелочная →</span>
      </div>
    </div>
  )
}
