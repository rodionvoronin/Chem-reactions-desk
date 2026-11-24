import type { KeyboardEvent } from 'react'

/** Клавиатурный эквивалент щелчка по посуде на лабораторном столе. */
export function vesselControl(id: string, label: string, selected: boolean) {
  return {
    'data-vessel': id,
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    'aria-pressed': selected,
    onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      if (event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return
      event.preventDefault()
      if (!event.repeat) event.currentTarget.click()
    },
  }
}
