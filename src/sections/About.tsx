import { event } from '../config/event'

const learn = [
  'How markets, exchanges and brokers actually work',
  'How to read a price chart and a few core indicators',
  'How to plan a trade with an entry, a stop-loss and a target',
  'How to size a position so one bad trade stays small',
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-line">
      <div className="page-x grid gap-12 py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16 md:py-28">
        <div>
          <h2 id="about-title" className="max-w-[16ch] text-h2">
            A calm, structured start. Not a hot tip.
          </h2>
        </div>

        <div className="max-w-prose space-y-6 text-base text-muted md:pt-2">
          <p className="text-lead text-text">
            {event.name} is a short online programme for students who are curious about financial markets and
            have never known where to begin.
          </p>
          <p>
            It is run by the {event.clubName} of {event.collegeName}, {event.campus}, and is open to every{' '}
            {event.collegeName} student, from first year to fourth year. Each learning day comes with notes you can
            read on your phone, and the doubts group is there when something does not click.
          </p>
          <div>
            <h3 className="font-sans text-base font-medium tracking-normal text-text">What you will learn</h3>
            <ul className="mt-3 space-y-2">
              {learn.map((l) => (
                <li key={l} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-muted" />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="border-l-2 border-gold-deep pl-4 text-text">
            {event.name} teaches process and risk management. It does not give stock tips, and nobody can promise
            you a profit. All practice is paper trading, with no real money.
          </p>
        </div>
      </div>
    </section>
  )
}
