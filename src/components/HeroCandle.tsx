import { useEffect, useState } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'

/**
 * The one moving thing on the site: a single candlestick that forms
 * tick by tick, once, on load. The ticks are a fixed script (no random
 * data) and the animation never loops. With reduced motion the final
 * candle is shown immediately.
 */

const OPEN = 100
// Scripted price path: dips first, finds a low, then rallies to close up.
const TICKS = [100, 99.2, 99.8, 98.6, 97.4, 98.3, 99.7, 101.4, 100.6, 102.8, 104.6, 103.5, 104.0]
const SEG_MS = 190

const HIGH = Math.max(...TICKS)
const LOW = Math.min(...TICKS)
const CLOSE = TICKS[TICKS.length - 1]

// Chart geometry (viewBox units)
const W = 280
const H = 300
const TOP = 14
const BOTTOM = 290
const P_MAX = 105
const P_MIN = 96
const y = (p: number) => TOP + ((P_MAX - p) / (P_MAX - P_MIN)) * (BOTTOM - TOP)

const CX = 190 // the forming candle
const BODY_W = 30

// Static earlier candles for context, drawn in hairline colour.
const GHOSTS = [
  { x: 40, o: 98.9, c: 97.9, h: 99.6, l: 96.9 },
  { x: 78, o: 97.9, c: 99.4, h: 99.9, l: 97.5 },
  { x: 116, o: 99.4, c: 98.5, h: 100.5, l: 98.1 },
  { x: 154, o: 98.5, c: 100.0, h: 100.4, l: 97.9 },
]

const GRID = [96, 98, 100, 102, 104]

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

interface Frame {
  price: number
  high: number
  low: number
  done: boolean
}

const FINAL: Frame = { price: CLOSE, high: HIGH, low: LOW, done: true }
const START: Frame = { price: OPEN, high: OPEN, low: OPEN, done: false }

export function HeroCandle() {
  const reduced = useReducedMotion()
  const [frame, setFrame] = useState<Frame>(reduced ? FINAL : START)

  useEffect(() => {
    if (reduced) {
      setFrame(FINAL)
      return
    }
    let raf = 0
    let start: number | null = null
    const delay = 450
    const total = (TICKS.length - 1) * SEG_MS

    const step = (now: number) => {
      if (start === null) start = now
      const elapsed = now - start - delay
      if (elapsed < 0) {
        raf = requestAnimationFrame(step)
        return
      }
      if (elapsed >= total) {
        setFrame(FINAL)
        return
      }
      const seg = Math.floor(elapsed / SEG_MS)
      const t = easeInOut((elapsed - seg * SEG_MS) / SEG_MS)
      const price = TICKS[seg] + (TICKS[seg + 1] - TICKS[seg]) * t
      const seen = TICKS.slice(0, seg + 1).concat(price)
      setFrame({ price, high: Math.max(...seen), low: Math.min(...seen), done: false })
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const up = frame.price >= OPEN
  const bodyTop = y(Math.max(frame.price, OPEN))
  const bodyH = Math.max(1.5, Math.abs(y(frame.price) - y(OPEN)))
  const colour = up ? '#E3B23C' : '#D9705A'
  const priceY = y(frame.price)

  return (
    <figure className="w-full max-w-[300px] md:max-w-[340px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full max-w-[300px] md:max-w-[340px]"
        role="img"
        aria-label={`A single candlestick: opens at ${OPEN.toFixed(2)}, dips to ${LOW.toFixed(2)}, rises to ${HIGH.toFixed(2)} and closes at ${CLOSE.toFixed(2)}.`}
      >
        {/* grid */}
        {GRID.map((p) => (
          <g key={p}>
            <line x1="0" x2={W - 44} y1={y(p)} y2={y(p)} stroke="#2A2620" strokeWidth="1" strokeDasharray="2 5" />
            <text x={W} y={y(p) + 4} textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="#6F6A5F">
              {p.toFixed(0)}
            </text>
          </g>
        ))}

        {/* earlier candles */}
        {GHOSTS.map((g) => (
          <g key={g.x} stroke="#3A352D" fill={g.c >= g.o ? 'none' : '#2A2620'} strokeWidth="1.5">
            <line x1={g.x} x2={g.x} y1={y(g.h)} y2={y(g.l)} />
            <rect x={g.x - 10} width="20" y={y(Math.max(g.o, g.c))} height={Math.abs(y(g.o) - y(g.c))} />
          </g>
        ))}

        {/* open marker */}
        <line x1={CX - BODY_W / 2 - 10} x2={CX - BODY_W / 2 - 2} y1={y(OPEN)} y2={y(OPEN)} stroke="#A39D8F" strokeWidth="1.5" />

        {/* forming candle */}
        <line x1={CX} x2={CX} y1={y(frame.high)} y2={y(frame.low)} stroke={colour} strokeWidth="2" />
        <rect
          x={CX - BODY_W / 2}
          width={BODY_W}
          y={bodyTop}
          height={bodyH}
          fill={frame.done ? colour : 'none'}
          stroke={colour}
          strokeWidth="2"
        />

        {/* live price line + tag */}
        <line x1={CX + BODY_W / 2 + 4} x2={W - 44} y1={priceY} y2={priceY} stroke={colour} strokeWidth="1" opacity="0.7" />
        <rect x={W - 42} y={priceY - 9} width="42" height="18" rx="2" fill={colour} />
        <text
          x={W - 21}
          y={priceY + 4}
          textAnchor="middle"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="10.5"
          fontWeight="500"
          fill="#0B0A08"
        >
          {frame.price.toFixed(1)}
        </text>
      </svg>
      <figcaption className="mt-3 font-mono text-xs text-muted">
        {frame.done ? 'Closed. One candle, four prices: open, high, low, close.' : 'Forming…'}
      </figcaption>
    </figure>
  )
}
