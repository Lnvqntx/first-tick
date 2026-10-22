import { useRef } from 'react'
import { event } from '../config/event'
import { ActionLink } from '../components/ActionLink'
import { DatesNote } from '../components/DatesNote'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { Marquee } from '../components/Marquee'
import { LiveChartBackground } from '../components/LiveChartBackground'
import { eventRange } from '../lib/dates'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  return (
    <>
      <section
        ref={heroRef}
        aria-labelledby="hero-title"
        className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-ink"
      >
        {/* Slow-drifting colour glows behind the (transparent) chart canvas. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="hero-glow hero-glow--gold" />
          <span className="hero-glow hero-glow--emerald" />
          <span className="hero-glow hero-glow--magenta" />
        </div>
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
          {/* Gold bloom behind the wordmark */}
          <span aria-hidden="true" className="wordmark-bloom" />
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

          <h1 id="hero-title" className="wordmark-glow relative mt-7 whitespace-nowrap text-display uppercase">
            <span className="text-text">First</span>
            <span className="sr-only"> </span>
            <span className="text-gold-grad">Tick</span>
          </h1>

          <p className="relative mt-5 max-w-[34ch] text-lead text-text/85 sm:text-[1.4rem]">{event.heroLine}</p>

          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <ActionLink href={event.links.registrationForm} className="min-w-[10.5rem]">
              Register now
            </ActionLink>
            <ActionLink
              href={event.links.whatsappCommunity}
              variant="secondary"
              icon={<WhatsAppIcon />}
              className="min-w-[10.5rem]"
            >
              Join WhatsApp
            </ActionLink>
          </div>
        </div>

        <p className="absolute bottom-3 left-4 z-10 font-mono text-[0.6875rem] text-muted sm:left-6 lg:left-10">
          Simulated chart, not real market data
        </p>
      </section>

      <Marquee primary={event.marquee.primary} secondary={event.marquee.secondary} />
    </>
  )
}
