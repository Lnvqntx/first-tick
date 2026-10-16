import { usePageTitle } from '../lib/usePageTitle'
import { ActionLink } from '../components/ActionLink'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <section className="page-x py-24 sm:py-32">
      <p className="mono-label">404</p>
      <h1 className="mt-3 text-h2">This page is not on the chart.</h1>
      <p className="mt-4 max-w-prose text-muted">The link may be old or mistyped.</p>
      <div className="mt-8">
        <ActionLink href="/">Back to First Tick</ActionLink>
      </div>
    </section>
  )
}
