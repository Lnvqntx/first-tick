import { event } from '../config/event'
import { DatesNote } from '../components/DatesNote'
import { formatLong, formatTime } from '../lib/dates'

export function Schedule() {
  return (
    <section id="schedule" aria-labelledby="schedule-title" className="border-b border-line">
      <div className="page-x py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="schedule-title" className="text-h2">
            Schedule
          </h2>
          <p className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
            <span>All times {event.timezoneLabel}</span>
            <DatesNote />
          </p>
        </div>

        <ol className="mt-12 md:mt-16">
          {event.days.map((d, i) => {
            const last = i === event.days.length - 1
            const assignment = d.kind === 'assignment'
            return (
              <li key={d.day} className="relative grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-5 md:grid-cols-[10rem_1.5rem_minmax(0,1fr)] md:gap-x-8">
                {/* date column (desktop) */}
                <div className="hidden pt-1 md:block">
                  <p className="font-mono text-sm text-gold">Day {d.day}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    <time dateTime={d.date.slice(0, 10)}>{formatLong(d.date)}</time>
                  </p>
                </div>

                {/* rail */}
                <div className="relative flex justify-center" aria-hidden="true">
                  {!last && <span className="absolute bottom-0 top-3 w-px bg-line" />}
                  {assignment ? (
                    <span className="relative mt-[0.45rem] h-3 w-3 rotate-45 border border-gold bg-ink" />
                  ) : (
                    <span className="relative mt-[0.45rem] h-3 w-3 rounded-full border border-gold bg-gold" />
                  )}
                </div>

                <div className={last ? 'pb-0' : 'pb-12 md:pb-14'}>
                  <p className="font-mono text-sm md:hidden">
                    <span className="text-gold">Day {d.day}</span>
                    <span className="text-muted">
                      {' '}
                      · <time dateTime={d.date.slice(0, 10)}>{formatLong(d.date)}</time>
                    </span>
                  </p>
                  <h3 className="mt-1 text-h3 md:mt-0">{d.title}</h3>
                  <ul className="mt-4 max-w-prose space-y-1.5 text-muted">
                    {d.topics.map((t) => (
                      <li key={t} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.75em] h-px w-2.5 shrink-0 bg-line" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                  {assignment && (
                    <p className="mt-4 font-mono text-xs text-muted">
                      Deadline: {formatLong(event.submissionDeadline)}, {formatTime(event.submissionDeadline)}{' '}
                      {event.timezoneLabel}
                      {!event.submissionDeadlineConfirmed && ' (time to be confirmed)'}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
