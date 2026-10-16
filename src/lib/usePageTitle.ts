import { useEffect } from 'react'
import { event } from '../config/event'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${event.name}` : `${event.name} · ${event.clubName}, ${event.collegeName}`
  }, [title])
}
