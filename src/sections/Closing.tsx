import { event } from '../config/event'
import { ActionLink } from '../components/ActionLink'
import { DatesNote } from '../components/DatesNote'
import { formatShort } from '../lib/dates'

export function Closing() {
  return (
    <section aria-labelledby="closing-title">
      <div className="page-x py-24 md:py-32">
        <h2 id="closing-title" className="max-w-[18ch] text-h2">
          Day 1 starts {formatShort(event.days[0].date)}. Bring curiosity, not capital.
        </h2>
        <div className="mt-4">
          <DatesNote />
        </div>
        <div className="mt-9 flex flex-wrap gap-3">
          <ActionLink href="/#register">Register for {event.name}</ActionLink>
          <ActionLink href={event.links.whatsappAnnouncements} variant="secondary">
            Join the WhatsApp community
          </ActionLink>
        </div>
      </div>
    </section>
  )
}
