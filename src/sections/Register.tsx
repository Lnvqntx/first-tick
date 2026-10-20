import { event } from '../config/event'
import { RegisterForm } from '../components/RegisterForm'
import { formatShort } from '../lib/dates'

export function Register() {
  return (
    <section id="register" aria-labelledby="register-title" className="border-b border-line">
      <div className="page-x grid gap-10 py-16 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16 md:py-24">
        <div className="max-w-prose">
          <h2 id="register-title" className="text-h2">
            Register
          </h2>
          <p className="mt-5 text-lead text-muted">
            Free for every {event.collegeName} student. After you register, join the WhatsApp community.
          </p>
          <p className="mt-2 text-lead text-muted">
            Day 1 notes go live on {formatShort(event.days[0].date)}.
          </p>
        </div>
        <RegisterForm />
      </div>
    </section>
  )
}
