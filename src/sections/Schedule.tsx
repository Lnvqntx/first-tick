import { useEffect, useRef, useState } from 'react'
import { event } from '../config/event'
import { DatesNote } from '../components/DatesNote'
import { formatLong, formatShort, formatTime } from '../lib/dates'
import { useReducedMotion } from '../lib/useReducedMotion'

/**
 * Candle shapes, in % of the candle area measured from the bottom.
 * Learning days rise day by day; the assignment day is a smaller hollow
 * candle. Used in order, so it follows however many days are in config.
 */
const SHAPES = [
  { low: 6, open: 14, close: 36, high: 44 },
  { low: 26, open: 32, close: 56, high: 63 },
  { low: 44, open: 52, close: 88, high: 97 },
  { low: 60, open: 66, close: 82, high: 90 },
]

export function Schedule() {
  const [selected, setSelected] = useState(0)
  const reduced = useReducedMotion()
  const [revealed, setRevealed] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)

  // One grow-in when the row first scrolls into view.
  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    if (reduced || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  const days = event.days
  const shapes = days.map((_, i) => SHAPES[Math.min(i, SHAPES.length - 1)])
  const col = 100 / days.length
  const trend = shapes.map((s, i) => `${(i + 0.5) * col},${100 - s.close}`).join(' ')
  const day = days[selected]

  return (
    <section id="schedule" aria-labelledby="schedule-title" className="border-b border-line">
      <div className="page-x py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h2 id="schedule-title" className="text-h2">
            Schedule
          </h2>
          <p className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            <span>All times {event.timezoneLabel}</span>
            <DatesNote />
          </p>
        </div>

        <div ref={rowRef} className="relative mt-10 md:mt-14">
          {/* Trend line joining the closes */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className={`pointer-events-none absolute inset-x-0 top-0 h-36 w-full transition-opacity delay-500 duration-700 motion-reduce:transition-none sm:h-48 md:h-56 ${
              revealed ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <polyline
              points={trend}
              fill="none"
              stroke="#E3B23C"
              strokeOpacity="0.55"
              strokeWidth="1"
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
            {days.map((d, i) => {
              const s = shapes[i]
              const isSel = i === selected
              const assignment = d.kind === 'assignment'
              const grow = {
                transform: revealed ? 'scaleY(1)' : 'scaleY(0)',
                transitionDelay: `${i * 140}ms`,
              }
              return (
                <button
                  key={d.day}
                  type="button"
                  aria-pressed={isSel}
                  aria-controls="schedule-panel"
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
                  className="group flex flex-col items-center rounded-[4px] px-1 pb-3 text-center focus-visible:outline-offset-0"
                >
                  <span className="relative block h-36 w-full sm:h-48 md:h-56" aria-hidden="true">
                    {/* Centring wrapper: not scaled, so translate and scaleY never collide. */}
                    <span className="absolute inset-y-0 left-1/2 w-[34%] max-w-[3.25rem] -translate-x-1/2">
                      {/* wick */}
                      <span
                        className={`absolute left-[calc(50%-0.5px)] w-px origin-bottom transition-transform duration-700 ease-out motion-reduce:transition-none ${
                          assignment ? 'bg-gold' : 'bg-up'
                        }`}
                        style={{ bottom: `${s.low}%`, height: `${s.high - s.low}%`, ...grow }}
                      />
                      {/* body */}
                      <span
                        className={`absolute inset-x-0 origin-bottom rounded-[2px] transition-[transform,box-shadow] duration-700 ease-out motion-reduce:transition-none ${
                          assignment ? 'bg-gold-grad p-[2px]' : 'bg-gradient-to-b from-[#4BD98F] to-[#1F8F55]'
                        } ${isSel ? 'shadow-glow' : 'group-hover:shadow-glow-soft'}`}
                        style={{ bottom: `${s.open}%`, height: `${s.close - s.open}%`, ...grow }}
                      >
                        {assignment && <span className="block h-full w-full rounded-[1px] bg-ink" />}
                      </span>
                    </span>
                  </span>

                  <span className={`mt-3 font-mono text-xs sm:text-sm ${isSel ? 'text-gold' : 'text-text'}`}>
                    Day {d.day}
                  </span>
                  <span className="font-mono text-[0.6875rem] text-muted sm:text-xs">
                    <time dateTime={d.date.slice(0, 10)}>{formatShort(d.date)}</time>
                  </span>
                  <span
                    className={`mt-1 text-xs leading-snug sm:text-sm ${isSel ? 'text-text' : 'text-muted group-hover:text-text'}`}
                  >
                    {d.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div
          id="schedule-panel"
          aria-live="polite"
          className="mt-6 grid gap-4 border-t border-line pt-6 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10"
        >
          <div>
            <p className="font-mono text-xs text-gold">Day {day.day}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              <time dateTime={day.date.slice(0, 10)}>{formatLong(day.date)}</time>
            </p>
            <h3 className="mt-2 text-h3">{day.title}</h3>
          </div>
          <div>
            <ul className="space-y-2 text-muted">
              {day.topics.slice(0, 3).map((t) => (
                <li key={t} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 ${day.kind === 'assignment' ? 'border border-gold' : 'bg-up'}`}
                  />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            {day.kind === 'assignment' && (
              <p className="mt-3 font-mono text-xs text-muted">
                Deadline: {formatLong(event.submissionDeadline)}, {formatTime(event.submissionDeadline)}{' '}
                {event.timezoneLabel}
                {!event.submissionDeadlineConfirmed && ' (time to be confirmed)'}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
