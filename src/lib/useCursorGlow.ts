import { useEffect } from 'react'

const MAX_TILT = 4 // degrees
const MAX_SHIFT = 3 // px

/**
 * Cursor-reactive outlines for every `.glow-edge` element on the page.
 *
 * One delegated pointermove listener (rAF-throttled) sets CSS variables on
 * the element under the pointer:
 *   --gx/--gy  pointer position inside the element (drives the border highlight)
 *   --rx/--ry  tilt toward the pointer (max 4deg, or `data-tilt` to override)
 *   --tx/--ty  a few px of shift toward the pointer
 * CSS turns these into transform + opacity only. Leaving the element clears
 * them and the CSS transition eases it back. Off for touch and reduced motion.
 */
export function useCursorGlow() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return

    let active: HTMLElement | null = null
    let raf = 0
    let last: PointerEvent | null = null

    const reset = (el: HTMLElement) => {
      el.classList.remove('is-glowing')
      for (const v of ['--rx', '--ry', '--tx', '--ty']) el.style.removeProperty(v)
    }

    const apply = () => {
      raf = 0
      if (!last) return
      const target = (last.target as Element | null)?.closest?.<HTMLElement>('.glow-edge') ?? null
      if (target !== active) {
        if (active) reset(active)
        active = target
      }
      if (!active) return
      const r = active.getBoundingClientRect()
      const x = last.clientX - r.left
      const y = last.clientY - r.top
      // -1..1 from the centre
      const nx = Math.max(-1, Math.min(1, (x / r.width) * 2 - 1))
      const ny = Math.max(-1, Math.min(1, (y / r.height) * 2 - 1))
      const tilt = Number(active.dataset.tilt ?? MAX_TILT)
      const s = active.style
      s.setProperty('--gx', `${x}px`)
      s.setProperty('--gy', `${y}px`)
      s.setProperty('--rx', `${(nx * tilt).toFixed(2)}deg`)
      s.setProperty('--ry', `${(-ny * tilt).toFixed(2)}deg`)
      s.setProperty('--tx', `${(nx * MAX_SHIFT).toFixed(2)}px`)
      s.setProperty('--ty', `${(ny * MAX_SHIFT).toFixed(2)}px`)
      active.classList.add('is-glowing')
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      last = e
      if (!raf) raf = requestAnimationFrame(apply)
    }
    const onLeaveWindow = () => {
      if (active) reset(active)
      active = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      if (active) reset(active)
    }
  }, [])
}
