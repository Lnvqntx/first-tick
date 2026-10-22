import { Link } from 'react-router-dom'
import { ClubLogo } from './ClubLogo'

/** Club seal + FIRSTTICK wordmark, linking home. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 rounded-full ${className}`} aria-label="First Tick, home">
      <ClubLogo size={30} decorative />
      <span aria-hidden="true" className="font-mono text-[0.95rem] font-medium tracking-[0.08em] text-text">
        FIRST<span className="text-gold">TICK</span>
      </span>
    </Link>
  )
}
