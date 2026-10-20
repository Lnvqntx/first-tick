import { useRef } from 'react'
import { event } from '../config/event'
import { ActionLink } from '../components/ActionLink'
import { DatesNote } from '../components/DatesNote'
import { LiveChartBackground } from '../components/LiveChartBackground'
import { eventRange } from '../lib/dates'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  return (
    <>
      <section
        ref={heroRef}
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden"
      >
        <LiveChartBackground targetRef={heroRef} />

        {/* Readability overlay: darkest behind the text, chart visible at the edges. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 62% 52% at 50% 50%, rgb(11 10 8 / 0.93) 0%, rgb(11 10 8 / 0.82) 45%, rgb(11 10 8 / 0.35) 80%, rgb(11 10 8 / 0.2) 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent"
        />

        <div className="page-x relative z-10 flex flex-col items-center py-16 text-center">
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-2xl border sm:rounded-full border-text/15 bg-ink/70 px-4 py-1.5 font-mono text-xs text-text/90 backdrop-blur-sm">
            <span>
              {event.clubName}, {event.collegeName}
            </span>
            <span aria-hidden="true" className="hidden text-gold sm:inline">
              |
            </span>
            <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
              <span>{eventRange()}</span>
              <DatesNote />
            </span>
          </p>

          <h1 id="hero-title" className="mt-7 whitespace-nowrap text-display uppercase">
            <span className="text-text">First</span>
            <span className="sr-only"> </span>
            <span className="text-gold-grad">Tick</span>
          </h1>

          <p className="mt-5 max-w-[34ch] text-lead text-text/85 sm:text-[1.4rem]">{event.heroLine}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ActionLink href="/#register" className="min-w-[9rem]">
              Register
            </ActionLink>
            <ActionLink href="/#schedule" variant="secondary" className="min-w-[9rem]">
              View schedule
            </ActionLink>
          </div>
        </div>

        <p className="absolute bottom-3 left-4 z-10 font-mono text-[0.6875rem] text-muted sm:left-6 lg:left-10">
          Simulated chart, not real market data
        </p>
      </section>

      <div className="border-y border-line">
        <ul className="page-x flex items-center justify-center gap-x-2 overflow-hidden whitespace-nowrap py-3.5 font-mono text-[0.6875rem] text-text/90 sm:gap-x-3 sm:text-sm">
          {event.facts.map((f, i) => (
            <li key={f.label} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-gold">
                  ·
                </span>
              )}
              <span className="sm:hidden">{f.short}</span>
              <span className="hidden sm:inline">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
