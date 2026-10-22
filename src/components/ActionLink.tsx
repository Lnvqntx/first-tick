import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'quiet'

const pill =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-[box-shadow,border-color,filter]'

const base: Record<Variant, string> = {
  primary: pill,
  secondary: pill,
  quiet: 'inline-flex min-h-[32px] flex-wrap items-center gap-x-2 py-1 text-sm transition-colors',
}

const variants: Record<Variant, string> = {
  primary: 'btn-gold glow-edge',
  secondary: 'glow-edge border border-text/25 bg-ink/50 text-text backdrop-blur-sm hover:border-gold/70 hover:shadow-glow-soft',
  quiet: 'text-text underline decoration-line underline-offset-4 hover:decoration-gold',
}

const disabledStyle: Record<Variant, string> = {
  primary: 'flex-col !gap-0 !py-1.5 leading-tight border border-dashed border-gold-deep/70 text-text/75',
  secondary: 'flex-col !gap-0 !py-1.5 leading-tight border border-dashed border-text/25 text-text/75',
  quiet: 'text-muted',
}

interface Props {
  /** Internal path ('/resources', '/#faq') or external URL. Empty = coming soon. */
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
  /** Optional leading icon. */
  icon?: ReactNode
  /** Text shown in place of the link when href is empty. */
  comingSoonLabel?: string
  /** Use for files to trigger a download. */
  download?: boolean
}

/**
 * A link styled as a pill button. External links open in a new tab.
 * If `href` is empty it renders a visibly disabled, non-clickable element
 * with a "Link coming soon" note, so there is never a dead click.
 */
export function ActionLink({
  href,
  children,
  variant = 'primary',
  className = '',
  icon,
  comingSoonLabel = 'Link coming soon',
  download,
}: Props) {
  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        className={`${base[variant]} ${disabledStyle[variant]} ${variant === 'quiet' ? '' : 'glow-edge'} cursor-not-allowed ${className}`}
      >
        <span className="inline-flex items-center gap-2">
          {icon}
          {children}
        </span>
        <span className="font-mono text-[0.6875rem] font-normal text-muted">
          {variant === 'quiet' ? `· ${comingSoonLabel}` : comingSoonLabel}
        </span>
      </span>
    )
  }

  const cls = `${base[variant]} ${variants[variant]} ${className}`
  const content = (
    <>
      {icon}
      {children}
    </>
  )
  const isInternal = href.startsWith('/') && !download && !/\.(pdf|ipynb)$/i.test(href)

  if (isInternal) {
    return (
      <Link to={href} className={cls}>
        {content}
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
      {content}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
