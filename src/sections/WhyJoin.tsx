const lead = {
  title: 'A structured path for complete beginners',
  body: 'Three days that build on each other: what a market is, then how to read it, then how to manage risk. You never have to guess what to learn next.',
}

const points = [
  {
    title: 'Learn safely with paper trading',
    body: 'You practise with simulated money only. Mistakes cost nothing, and they are where most of the learning happens.',
  },
  {
    title: 'An optional Python track',
    body: 'If you code, plot a real price chart and backtest a simple moving-average crossover. If you do not, skip it.',
  },
  {
    title: 'Community and doubt support',
    body: 'A WhatsApp community for announcements and a separate doubts group, answered by club members.',
  },
]

export function WhyJoin() {
  return (
    <section aria-labelledby="why-title" className="border-b border-line">
      <div className="page-x py-20 md:py-28">
        <h2 id="why-title" className="text-h2">
          Why join
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
          <div>
            <p className="font-display text-[clamp(1.6rem,1.6vw+1.1rem,2.25rem)] leading-[1.18] text-text">
              {lead.title}.
            </p>
            <p className="mt-5 max-w-[46ch] text-muted">{lead.body}</p>
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {points.map((p) => (
              <div key={p.title} className="grid gap-2 py-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8">
                <dt className="font-medium text-text">{p.title}</dt>
                <dd className="text-muted">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
