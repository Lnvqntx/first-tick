import { event } from '../config/event'
import { ActionLink } from '../components/ActionLink'
import { DatesNote } from '../components/DatesNote'
import { HeroCandle } from '../components/HeroCandle'
import { eventRange } from '../lib/dates'

const facts = ['3 learning days', '1 assignment', `Free for ${event.collegeName} students`, 'Certificate on completion']

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="page-x grid items-center gap-12 pb-14 pt-14 sm:pt-20 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-16 md:pb-20 lg:pt-24">
        <div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
            <span>
              {event.clubName}, {event.collegeName}
            </span>
            <span className="text-text">{eventRange()}</span>
            <DatesNote />
          </p>
          <h1 id="hero-title" className="mt-6 max-w-[14ch] text-display">
            Your first step into financial markets.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lead text-muted">
            <span className="text-text">{event.name}</span> is a free three-day beginner programme, followed by a
            paper-trading assignment and a certificate. No real money, no tips, just how markets work and how to
            manage risk.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ActionLink href="/#register">Register, it's free</ActionLink>
            <ActionLink href="/#schedule" variant="secondary">
              View schedule
            </ActionLink>
          </div>
        </div>

        <div className="flex justify-start md:justify-end">
          <HeroCandle />
        </div>
      </div>

      <div className="border-t border-line">
        <ul className="page-x grid grid-cols-2 gap-x-4 gap-y-2 py-4 font-mono text-xs text-text/90 sm:flex sm:flex-wrap sm:gap-x-3 sm:text-sm">
          {facts.map((f, i) => (
            <li key={f} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="hidden text-muted sm:inline">
                  ·
                </span>
              )}
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
