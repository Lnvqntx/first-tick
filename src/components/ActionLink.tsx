import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'quiet'

const base: Record<Variant, string> = {
  primary:
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[3px] px-5 py-2.5 text-sm font-medium transition-colors',
  secondary:
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[3px] px-5 py-2.5 text-sm font-medium transition-colors',
  quiet: 'inline-flex min-h-[32px] flex-wrap items-baseline gap-x-2 py-1 text-sm transition-colors',
}

const variants: Record<Variant, string> = {
  primary: 'btn-gold',
  secondary: 'border border-text/25 bg-ink/40 text-text backdrop-blur-sm hover:border-gold/70 hover:shadow-glow-soft',
  quiet: 'text-text underline decoration-line underline-offset-4 hover:decoration-gold',
}

const disabledStyle = {
  primary: 'flex-col !items-start !gap-0 border border-dashed border-gold-deep/60 text-text/70',
  secondary: 'flex-col !items-start !gap-0 border border-dashed border-line text-text/70',
  quiet: 'text-muted',
}

interface Props {
  /** Internal path ('/resources', '/#register') or external URL. Empty = coming soon. */
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
  /** Text shown in place of the link when href is empty. */
  comingSoonLabel?: string
  /** Use for files to trigger a download. */
  download?: boolean
}

/**
 * A link styled as a button. If `href` is empty it renders a visibly
 * disabled, non-clickable element with a "Link coming soon" note,
 * so there is never a dead click.
 */
export function ActionLink({
  href,
  children,
  variant = 'primary',
  className = '',
  comingSoonLabel = 'Link coming soon',
  download,
}: Props) {
  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        className={`${base[variant]} ${disabledStyle[variant]} cursor-not-allowed ${className}`}
      >
        <span>{children}</span>
        <span className="font-mono text-xs font-normal text-muted">
          {variant === 'quiet' ? `· ${comingSoonLabel}` : comingSoonLabel}
        </span>
      </span>
    )
  }

  const cls = `${base[variant]} ${variants[variant]} ${className}`
  const isInternal = href.startsWith('/') && !download && !href.endsWith('.pdf') && !href.endsWith('.ipynb')

  if (isInternal) {
    return (
      <Link to={href} className={cls}>
        {children}
      </Link>
    )
  }
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      className={cls}
      download={download || undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
