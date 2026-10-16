import { event } from '../config/event'
import { ActionLink } from './ActionLink'

export function WhatsAppButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <ActionLink href={event.links.whatsappAnnouncements}>Join announcements</ActionLink>
      <ActionLink href={event.links.whatsappDoubts} variant="secondary">
        Join doubts group
      </ActionLink>
    </div>
  )
}
