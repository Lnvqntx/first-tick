import { useEffect } from 'react'

const STAGGER_MS = 70
const MAX_STAGGER = 4

/**
 * Reveals every `[data-reveal]` element once, as it scrolls into view.
 * Elements entering together are staggered in DOM order. Under reduced
 * motion nothing is hidden, so content is always visible.
 * Re-runs when `key` changes (the route), to pick up new elements.
 */
export function useScrollReveal(key: string) {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      root.classList.remove('reveal-ready')
      return
    }
    root.classList.add('reveal-ready')

    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        entering.forEach((el, i) => {
          el.style.setProperty('--reveal-delay', `${Math.min(i, MAX_STAGGER) * STAGGER_MS}ms`)
          el.classList.add('is-revealed')
          io.unobserve(el)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])
}
