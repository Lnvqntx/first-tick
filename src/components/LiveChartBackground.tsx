import { useEffect, useRef, type RefObject } from 'react'
import { LiveChart } from '../lib/liveChart'
import { useReducedMotion } from '../lib/useReducedMotion'

/** Full-bleed simulated chart. Pointer events are read from `targetRef` (the hero). */
export function LiveChartBackground({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const target = targetRef.current
    if (!canvas || !target) return
    let chart: LiveChart | null = null
    try {
      chart = new LiveChart(canvas, target, reduced)
    } catch {
      // No canvas support: the hero still works on the plain background.
    }
    return () => chart?.destroy()
  }, [reduced, targetRef])

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
}
