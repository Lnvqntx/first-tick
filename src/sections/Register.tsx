import { event } from '../config/event'
import { RegisterForm } from '../components/RegisterForm'
import { formatShort } from '../lib/dates'
import { DatesNote } from '../components/DatesNote'

export function Register() {
  return (
    <section id="register" aria-labelledby="register-title" className="border-b border-line">
      <div className="page-x grid gap-12 py-20 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 md:py-28">
        <div className="max-w-prose">
          <h2 id="register-title" className="text-h2">
            Register
          </h2>
          <p className="mt-4 text-lead text-muted">
            It takes a minute and it is free for every {event.collegeName} student.
          </p>
          <div className="mt-10 space-y-5 border-t border-line pt-8 text-muted">
            <h3 className="font-sans text-base font-medium tracking-normal text-text">What happens next</h3>
            <p>Right after you register, you will see the links to the WhatsApp announcements and doubts groups.</p>
            <p>
              Day 1 notes go up on the morning of {formatShort(event.days[0].date)} on the Resources page, and the
              link is shared in the group. <DatesNote className="ml-1 align-middle" />
            </p>
            <p>No payment, no broker account and no real money are ever needed.</p>
          </div>
        </div>
        <RegisterForm />
      </div>
    </section>
  )
}
