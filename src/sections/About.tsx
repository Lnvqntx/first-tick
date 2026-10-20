import { event } from '../config/event'

const icons = [
  // paper trading: a candle
  <path key="a" d="M8 2v3M8 13v3M5 5h6v8H5z" />,
  // python: angle brackets
  <path key="b" d="M6 5L2 9l4 4M12 5l4 4-4 4" />,
  // community: two speech marks
  <path key="c" d="M2 4h9v6H6l-3 3v-3H2zM13 7h3v6h-1v2l-2-2h-3" />,
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-line">
      <div className="page-x grid gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16 md:py-24">
        <div className="max-w-prose">
          <h2 id="about-title" className="text-h2">
            Learn the process, <span className="text-gold-grad">not tips.</span>
          </h2>
          <div className="mt-5 space-y-3 text-lead text-muted">
            {event.about.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <ul className="self-end border-t border-line">
          {event.about.benefits.map((b, i) => (
            <li key={b.title} className="flex gap-4 border-b border-line py-5">
              <svg
                aria-hidden="true"
                viewBox="0 0 18 18"
                className="mt-1 h-[18px] w-[18px] shrink-0 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              >
                {icons[i % icons.length]}
              </svg>
              <p>
                <span className="font-medium text-text">{b.title}.</span>{' '}
                <span className="text-muted">{b.body}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
