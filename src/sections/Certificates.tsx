import { Link } from 'react-router-dom'
import { CertificatePreview } from '../components/CertificatePreview'

export function Certificates() {
  return (
    <section id="certificates" aria-labelledby="cert-title" className="border-b border-line">
      <div className="page-x grid items-start gap-12 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16 md:py-28">
        <div className="max-w-prose">
          <h2 id="cert-title" className="text-h2">
            Certificates
          </h2>
          <p className="mt-4 text-lead text-muted">Two tiers, both earned through the Day 4 assignment.</p>

          <dl className="mt-10 space-y-8">
            <div>
              <dt className="text-h3 font-display text-text">Completion</dt>
              <dd className="mt-2 text-muted">
                For every valid final submission that follows the required format: annotated chart, entry, stop-loss,
                target, risk-reward, position size and a short justification.
              </dd>
            </div>
            <div className="border-t border-line pt-8">
              <dt className="flex items-center gap-3 text-h3 font-display text-text">
                Merit
                <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-gold" />
              </dt>
              <dd className="mt-2 text-muted">
                For the top submissions, judged on a clear rubric published with the assignment brief. The rubric
                rewards a sound process, sensible risk and clear reasoning, not whether the trade made money.
              </dd>
            </div>
          </dl>

          <p className="mt-10 text-sm text-muted">
            Every certificate has an ID that anyone can check on the{' '}
            <Link to="/verify" className="link-underline text-text">
              verify page
            </Link>
            .
          </p>
        </div>

        <CertificatePreview />
      </div>
    </section>
  )
}
