import { Link } from 'react-router-dom'
import { event } from '../config/event'
import { Wordmark } from './Wordmark'
import { ActionLink } from './ActionLink'
import { WhatsAppIcon } from './WhatsAppIcon'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page-x flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Wordmark />
          <p className="max-w-[44ch] text-sm text-muted">
            Run by the {event.clubName}, {event.collegeName}, {event.campus}.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <ActionLink
            href={event.links.whatsappCommunity}
            variant="quiet"
            comingSoonLabel="coming soon"
            icon={<WhatsAppIcon className="h-4 w-4 text-gold" />}
          >
            WhatsApp community
          </ActionLink>
          <Link to="/resources" className="link-underline text-sm">
            Resources
          </Link>
          <ActionLink href={event.links.registrationForm}>Register now</ActionLink>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="page-x py-5 text-xs text-muted sm:text-sm">
          <span className="block max-w-prose">
            First Tick is an educational event by the {event.clubName}, {event.collegeName}. Nothing here is
            investment advice. All practice is paper trading, and trading involves risk of loss.
          </span>
        </p>
      </div>
    </footer>
  )
}
