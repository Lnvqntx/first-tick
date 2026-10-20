import { event } from '../config/event'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-b border-line">
      <div className="page-x grid gap-10 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16 md:py-24">
        <h2 id="faq-title" className="text-h2">
          Questions
        </h2>
        <div className="border-t border-line">
          {event.faq.slice(0, 6).map((item) => (
            <details key={item.question} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lead text-text transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="relative mt-[0.55em] h-3 w-3 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-3 after:w-px after:bg-current group-open:after:hidden"
                />
              </summary>
              <p className="max-w-prose pb-6 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
