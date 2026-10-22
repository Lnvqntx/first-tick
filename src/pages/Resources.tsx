import { useRef, useState, type KeyboardEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { event, type ResourceItem, type ResourceTab } from '../config/event'
import { ActionLink } from '../components/ActionLink'
import { DatesNote } from '../components/DatesNote'
import { formatLong, formatShort, formatTime } from '../lib/dates'
import { usePageTitle } from '../lib/usePageTitle'

const TABS: { id: ResourceTab; label: string }[] = [
  { id: 'day-1', label: 'Day 1' },
  { id: 'day-2', label: 'Day 2' },
  { id: 'day-3', label: 'Day 3' },
  { id: 'assignment', label: 'Assignment' },
  { id: 'python', label: 'Python track' },
]

export default function Resources() {
  usePageTitle('Resources')
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab') as ResourceTab | null
  const active: ResourceTab = TABS.some((t) => t.id === requested) ? requested! : 'day-1'
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (id: ResourceTab) => setParams({ tab: id }, { replace: true })

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    if (next >= 0) {
      e.preventDefault()
      select(TABS[next].id)
      tabRefs.current[next]?.focus()
    }
  }

  const items = event.resources.filter((r) => r.tab === active)

  return (
    <div className="page-x py-14 sm:py-20">
      <h1 className="text-h2">Resources</h1>
      <p className="mt-4 max-w-prose text-lead text-muted">
        Notes for each day, the assignment brief and the optional Python notebook. Each one appears here on the
        morning of its day.
      </p>
      <div className="mt-3">
        <DatesNote />
      </div>

      {event.recordingUrl && (
        <div className="glow-edge mt-10 flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="font-sans text-base font-medium tracking-normal">Recorded session</h2>
            <p className="mt-1 text-sm text-muted">Missed it live? Watch the recording.</p>
          </div>
          <ActionLink href={event.recordingUrl} variant="secondary">
            Watch recording
          </ActionLink>
        </div>
      )}

      <div
        role="tablist"
        aria-label="Resource sections"
        className="-mx-4 mt-12 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {TABS.map((t, i) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`glow-edge shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
                selected ? 'border-gold bg-gold/10 text-text' : 'border-line text-muted hover:text-text'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} tabIndex={0} className="pt-10">
        <div className="space-y-10">
          {items.map((item) => (
            <ResourceCard key={item.id} item={item} />
          ))}
        </div>
        {active === 'assignment' && <AssignmentNotes />}
      </div>
    </div>
  )
}

function ResourceCard({ item }: { item: ResourceItem }) {
  const [viewing, setViewing] = useState(false)
  const unlocked = item.file !== null
  const isPdf = item.file?.toLowerCase().endsWith('.pdf') ?? false

  return (
    <article aria-labelledby={`${item.id}-title`} className="max-w-3xl">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id={`${item.id}-title`} className="text-h3">
          {item.title}
        </h2>
        <p className="font-mono text-xs">
          {unlocked ? (
            <span className="text-gold">Available</span>
          ) : (
            <span className="inline-flex items-center gap-2 text-muted">
              <LockIcon />
              Unlocks on {formatShort(item.availableOn)}
            </span>
          )}
        </p>
      </div>
      <p className="mt-2 max-w-prose text-muted">{item.description}</p>

      {unlocked ? (
        <>
          <div className="mt-5 flex flex-wrap gap-3">
            <ActionLink href={item.file!} download>
              Download
            </ActionLink>
            {isPdf && (
              <button
                type="button"
                onClick={() => setViewing((v) => !v)}
                aria-expanded={viewing}
                aria-controls={`${item.id}-viewer`}
                className="glow-edge inline-flex min-h-[44px] items-center rounded-full border border-line px-6 text-sm font-medium text-text transition-colors hover:border-gold/70"
              >
                {viewing ? 'Hide preview' : 'View here'}
              </button>
            )}
          </div>
          {isPdf && viewing && (
            <div id={`${item.id}-viewer`} className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
              <object data={item.file!} type="application/pdf" className="block h-[75vh] min-h-[420px] w-full" aria-label={item.title}>
                <div className="p-6 text-sm text-muted">
                  Your browser cannot show the PDF here.{' '}
                  <a href={item.file!} download className="link-underline text-text">
                    Download it instead
                  </a>
                  .
                </div>
              </object>
            </div>
          )}
        </>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-line px-5 py-4 text-sm text-muted">
          This file is not out yet. It will appear here on {formatLong(item.availableOn)}, around{' '}
          {formatTime(item.availableOn)} {event.timezoneLabel}, and the link will be shared in the WhatsApp community.
        </div>
      )}
    </article>
  )
}

function AssignmentNotes() {
  const format = [
    'An annotated price chart of the instrument you chose',
    'Your entry, stop-loss and target prices',
    'The risk-reward ratio of the trade',
    'Your position size, and how you worked it out',
    'A short justification (a few sentences) for the trade',
  ]
  return (
    <div className="mt-14 grid gap-10 border-t border-line pt-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-16">
      <div className="max-w-prose">
        <h2 className="text-h3">Submission format</h2>
        <p className="mt-3 text-muted">Submit one PDF with:</p>
        <ul className="mt-3 space-y-2 text-muted">
          {format.map((f) => (
            <li key={f} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.75em] h-px w-2.5 shrink-0 bg-muted" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          This is a paper trade. Do not place a real order. Submissions are judged on process and risk management,
          not on whether the trade made money.
        </p>
      </div>
      <div>
        <h2 className="text-h3">Submit</h2>
        <p className="mt-3 font-mono text-xs text-muted">
          Deadline: {formatLong(event.submissionDeadline)}, {formatTime(event.submissionDeadline)} {event.timezoneLabel}
          {!event.submissionDeadlineConfirmed && ' (time to be confirmed)'}
        </p>
        <div className="mt-5">
          <ActionLink href={event.links.submissionForm}>Open submission form</ActionLink>
        </div>
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
      <rect x="1" y="5.5" width="9" height="6" rx="1" />
      <path d="M3 5.5V3.5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}
