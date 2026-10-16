import { Link } from 'react-router-dom'

/** FIRSTTICK wordmark. The mark comes from public/brand/logo-placeholder.svg so the club can swap it. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="First Tick, home">
      <img src="/brand/logo-placeholder.svg" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
      <span aria-hidden="true" className="font-mono text-[0.95rem] font-medium tracking-[0.08em] text-text">
        FIRST<span className="text-gold">TICK</span>
      </span>
    </Link>
  )
}
