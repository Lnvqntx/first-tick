import type { ReactNode } from 'react'
import { event } from '../config/event'
import { ActionLink } from '../components/ActionLink'
import { DatesNote } from '../components/DatesNote'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { formatLong, formatShort } from '../lib/dates'

function Step({ n, title, body, children }: { n: number; title: string; body: string; children: ReactNode }) {
  return (
    <li data-reveal className="glow-edge flex flex-col rounded-3xl border border-line bg-surface p-6 sm:p-7">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 font-display text-xl font-semibold text-gold"
      >
        {n}
      </span>
      <h3 className="mt-5 text-h3">
        <span className="sr-only">Step {n}: </span>
        {title}
      </h3>
      <p className="mt-2 flex-1 text-muted">{body}</p>
      <div className="mt-6">{children}</div>
    </li>
  )
}

export function Steps() {
  const s = event.steps
  const day1 = event.days[0].date
  return (
    <section id="join" aria-labelledby="join-title" className="border-b border-line">
      <div className="page-x py-16 md:py-20">
        <h2 id="join-title" data-reveal className="text-h2">
          {s.heading}
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
          <Step n={1} title={s.register.title} body={s.register.body}>
            <ActionLink href={event.links.registrationForm}>Open form</ActionLink>
          </Step>
          <Step n={2} title={s.whatsapp.title} body={s.whatsapp.body}>
            <ActionLink href={event.links.whatsappCommunity} variant="secondary" icon={<WhatsAppIcon />}>
              Join WhatsApp
            </ActionLink>
          </Step>
          <Step n={3} title={`Show up on ${formatShort(day1)}`} body={s.showUp.body}>
            <span className="glow-edge inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-gold/40 bg-ink px-4 py-2 font-mono text-xs text-text">
              <time dateTime={day1.slice(0, 10)}>{formatLong(day1)}</time>
              <DatesNote />
            </span>
          </Step>
        </ol>
      </div>
    </section>
  )
}
