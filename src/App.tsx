import { useRef, useState, useCallback } from 'react'
import { Editor, Tldraw, createShapeId, DefaultColorStyle, DefaultSizeStyle } from 'tldraw'
import { TestTubeShapeUtil, TestTubeShape, TEST_TUBE_TYPE } from './shapes/TestTubeShapeUtil'
import { BurnerShapeUtil, BurnerShape, BURNER_TYPE } from './shapes/BurnerShapeUtil'
import { GroupsPalette } from './components/GroupsPalette'
import { CommonPalette } from './components/CommonPalette'
import { FlameColorsPalette } from './components/FlameColorsPalette'
import { SolidsPalette } from './components/SolidsPalette'
import { matchReactions, getReactionDescription } from './reactions'

const SHAPE_UTILS = [TestTubeShapeUtil, BurnerShapeUtil]

export default function App() {
  const editorRef = useRef<Editor | null>(null)
  const [tubeSelected, setTubeSelected] = useState(false)
  const [tubeDry, setTubeDry] = useState(false)
  const [burnerSelected, setBurnerSelected] = useState(false)
  const [currentMetalId, setCurrentMetalId] = useState('')
  const [penColor, setPenColor] = useState('black')
  const [penSize, setPenSize] = useState('m')

  const handleMount = useCallback((editor: Editor) => {
    editorRef.current = editor

    editor.createShape<TestTubeShape>({
      id: createShapeId(),
      type: TEST_TUBE_TYPE,
      x: 340,
      y: 130,
    })

    editor.on('change', () => {
      const selected = editor.getSelectedShapes()
      const tube = selected.find((s): s is TestTubeShape => s.type === TEST_TUBE_TYPE)
      setTubeSelected(!!tube)
      setTubeDry(tube?.props.isDry ?? false)

      const burner = selected.find((s): s is BurnerShape => s.type === BURNER_TYPE)
      setBurnerSelected(!!burner)
      setCurrentMetalId(burner?.props.metalId ?? '')
    })
  }, [])

  // ── Пробирка ──────────────────────────────────────────────────────────────

  const getSelectedTube = (): TestTubeShape | undefined => {
    const editor = editorRef.current
    if (!editor) return undefined
    return editor.getSelectedShapes().find((s): s is TestTubeShape => s.type === TEST_TUBE_TYPE)
  }

  const handleReagentClick = useCallback((reagentId: string) => {
    const editor = editorRef.current
    const tube = getSelectedTube()
    if (!editor || !tube) return

    const newContents = [...tube.props.contents, reagentId]
    const effects = matchReactions(newContents)
    const desc = getReactionDescription(newContents) ?? ''

    editor.updateShape<TestTubeShape>({
      id: tube.id,
      type: TEST_TUBE_TYPE,
      props: {
        contents: newContents,
        liquidColor: effects.liquidColor ?? tube.props.liquidColor,
        hasPrecipitate: effects.precipitate !== undefined,
        precipitateColor: effects.precipitate?.color ?? tube.props.precipitateColor,
        gasActive: effects.gas ?? tube.props.gasActive,
        reactionDesc: desc,
      },
    })
  }, [])

  const handleAddTube = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return

    const id = createShapeId()
    const center = editor.getViewportPageBounds().center
    editor.createShape<TestTubeShape>({
      id,
      type: TEST_TUBE_TYPE,
      x: center.x - 40 + (Math.random() - 0.5) * 220,
      y: center.y - 110 + (Math.random() - 0.5) * 160,
    })
    editor.select(id)
  }, [])

  const handleToggleDry = useCallback(() => {
    const editor = editorRef.current
    const tube = getSelectedTube()
    if (!editor || !tube) return

    editor.updateShape<TestTubeShape>({
      id: tube.id,
      type: TEST_TUBE_TYPE,
      props: { isDry: !tube.props.isDry },
    })
    setTubeDry(!tube.props.isDry)
  }, [])

  const handleClearTube = useCallback(() => {
    const editor = editorRef.current
    const tube = getSelectedTube()
    if (!editor || !tube) return

    editor.updateShape<TestTubeShape>({
      id: tube.id,
      type: TEST_TUBE_TYPE,
      props: {
        contents: [],
        liquidColor: 'rgba(200, 230, 255, 0.20)',
        hasPrecipitate: false,
        precipitateColor: '#1565C0',
        gasActive: false,
        reactionDesc: '',
      },
    })
  }, [])

  // ── Горелка ───────────────────────────────────────────────────────────────

  const handleAddBurner = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return

    const id = createShapeId()
    const center = editor.getViewportPageBounds().center
    editor.createShape<BurnerShape>({
      id,
      type: BURNER_TYPE,
      x: center.x - 44 + (Math.random() - 0.5) * 200,
      y: center.y - 95 + (Math.random() - 0.5) * 120,
    })
    editor.select(id)
  }, [])

  const handleSetFlame = useCallback((color: string, label: string, metalId: string) => {
    const editor = editorRef.current
    if (!editor) return
    const burner = editor.getSelectedShapes().find((s): s is BurnerShape => s.type === BURNER_TYPE)
    if (!burner) return

    editor.updateShape<BurnerShape>({
      id: burner.id,
      type: BURNER_TYPE,
      props: { flameColor: color, metalLabel: label, metalId },
    })
    setCurrentMetalId(metalId)
  }, [])

  const handleClearFlame = useCallback(() => {
    const editor = editorRef.current
    if (!editor) return
    const burner = editor.getSelectedShapes().find((s): s is BurnerShape => s.type === BURNER_TYPE)
    if (!burner) return

    editor.updateShape<BurnerShape>({
      id: burner.id,
      type: BURNER_TYPE,
      props: { flameColor: '', metalLabel: '', metalId: '' },
    })
    setCurrentMetalId('')
  }, [])

  // ── Карандаш ─────────────────────────────────────────────────────────────

  const handlePenColor = useCallback((color: string) => {
    const editor = editorRef.current
    if (!editor) return
    setPenColor(color)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.setStyleForNextShapes(DefaultColorStyle, color as any)
    editor.setCurrentTool('draw')
  }, [])

  const handlePenSize = useCallback((size: string) => {
    const editor = editorRef.current
    if (!editor) return
    setPenSize(size)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.setStyleForNextShapes(DefaultSizeStyle, size as any)
    editor.setCurrentTool('draw')
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw shapeUtils={SHAPE_UTILS} onMount={handleMount} />

      <CommonPalette
        onReagentClick={handleReagentClick}
        tubeSelected={tubeSelected}
        onPenColor={handlePenColor}
        onPenSize={handlePenSize}
        penColor={penColor}
        penSize={penSize}
      />

      <GroupsPalette
        onReagentClick={handleReagentClick}
        onAddTube={handleAddTube}
        onClearTube={handleClearTube}
        tubeSelected={tubeSelected}
      />

      <SolidsPalette
        onReagentClick={handleReagentClick}
        tubeSelected={tubeSelected}
        isDry={tubeDry}
        onToggleDry={handleToggleDry}
      />

      <FlameColorsPalette
        burnerSelected={burnerSelected}
        currentMetalId={currentMetalId}
        onAddBurner={handleAddBurner}
        onSetFlame={handleSetFlame}
        onClearFlame={handleClearFlame}
      />
    </div>
  )
}
