import { Link } from 'react-router-dom'
import { event } from '../config/event'
import { Wordmark } from './Wordmark'
import { ActionLink } from './ActionLink'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="page-x grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-4">
          <Wordmark />
          <p className="max-w-[40ch] text-sm text-muted">
            Run by the {event.clubName}, {event.collegeName}, {event.campus}.
          </p>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-medium tracking-normal text-text">Community</h2>
          <ul className="space-y-1">
            <li>
              <ActionLink href={event.links.whatsappAnnouncements} variant="quiet" comingSoonLabel="coming soon">
                WhatsApp announcements
              </ActionLink>
            </li>
            <li>
              <ActionLink href={event.links.whatsappDoubts} variant="quiet" comingSoonLabel="coming soon">
                WhatsApp doubts group
              </ActionLink>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 font-sans text-sm font-medium tracking-normal text-text">Site</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link className="link-underline" to="/resources">Resources</Link>
            </li>
            <li>
              <Link className="link-underline" to="/verify">Verify a certificate</Link>
            </li>
            <li>
              <Link className="link-underline" to="/#register">Register</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="page-x py-6 text-sm text-muted">
          <span className="block max-w-prose">
            First Tick is an educational event by the {event.clubName}, {event.collegeName}. Nothing here is
            investment advice. All practice is paper trading, and trading involves risk of loss.
          </span>
        </p>
      </div>
    </footer>
  )
}
