import { event } from '../config/event'
import { CertificateCard } from '../components/CertificateCard'

const icons = [
  // read the market: chart line
  <path key="r" d="M3 17l5-6 4 3 6-8M15 6h3v3" />,
  // plan the trade: target
  <g key="p">
    <circle cx="11" cy="11" r="7" />
    <circle cx="11" cy="11" r="3" />
  </g>,
  // manage the risk: shield
  <path key="m" d="M11 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z" />,
  // submit: paper plane
  <path key="s" d="M3 11l16-7-6 16-3-6zM10 14l9-10" />,
]

export function Challenge() {
  const ch = event.challenge
  return (
    <section id="challenge" aria-labelledby="challenge-title" className="border-b border-line">
      <div className="page-x py-16 md:py-20">
        <div data-reveal className="max-w-prose">
          <h2 id="challenge-title" className="text-h2">
            {ch.heading}
          </h2>
          <p className="mt-4 text-lead text-muted">{ch.intro}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-6">
          <article
            data-reveal
            aria-labelledby="challenge-card-title"
            className="glow-edge rounded-3xl border border-line bg-surface p-6 sm:p-8"
          >
            <h3 id="challenge-card-title" className="text-h3">
              Final trading challenge
            </h3>
            <ul className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {ch.items.map((item, i) => (
                <li key={item.title} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink text-gold">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 22 22"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {icons[i % icons.length]}
                    </svg>
                  </span>
                  <span>
                    <span className="block font-medium text-text">{item.title}</span>
                    <span className="block text-sm text-muted">{item.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <div data-reveal>
            <CertificateCard />
          </div>
        </div>
      </div>
    </section>
  )
}
