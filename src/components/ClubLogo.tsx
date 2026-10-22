import { event } from '../config/event'

/** The Programming Club seal. Pass `decorative` when a visible text label sits next to it. */
export function ClubLogo({ size = 28, className = '', decorative = false }: { size?: number; className?: string; decorative?: boolean }) {
  return (
    <img
      src={event.clubLogo.src}
      alt={decorative ? '' : event.clubLogo.alt}
      width={size}
      height={size}
      decoding="async"
      className={`logo-seal shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
