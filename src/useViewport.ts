import { useEffect, useState } from 'react'

/**
 * Ширина, ниже которой десктопная раскладка перестаёт помещаться: на столе
 * по краям стоят палитры (224 слева и 280 справа), и на узком экране для
 * самой посуды места уже не остаётся.
 *
 * Всё, что зависит от этого флага, включается только на узких экранах —
 * на десктопе рендерится ровно то же, что и раньше.
 */
export const NARROW_WIDTH = 860

function isNarrowNow(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < NARROW_WIDTH
}

export function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(isNarrowNow)

  useEffect(() => {
    const update = () => setNarrow(isNarrowNow())
    window.addEventListener('resize', update)
    // Поворот экрана меняет ширину не сразу, поэтому слушаем и его
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return narrow
}
