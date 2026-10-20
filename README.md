# First Tick website

The website for **First Tick**, a free beginner event on financial markets
and trading run by the Programming Club, CR Rao AIMSCS (University of
Hyderabad campus): three learning days, a paper-trading assignment and a
certificate.

The site's jobs: get students to register and join the WhatsApp
community, serve the daily PDFs, link the final submission form, and let
anyone verify a certificate ID.

- `/` landing page: live-chart hero, schedule, about, registration, FAQ
- `/resources` daily notes, assignment brief, Python notebook
- `/verify` certificate ID lookup (kept but not linked from the site for now)

Stack: Vite, React, TypeScript, Tailwind CSS, `react-router-dom`. Static
output, no backend. Fonts are self-hosted with `@fontsource` (Fraunces and
IBM Plex). Design notes are in [`docs/design-plan.md`](docs/design-plan.md).

## Run and build

Requires Node 18 or newer.

```bash
npm install
npm run dev        # local dev server at http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the built site locally
npm run lint       # ESLint, fails on any warning
npm run typecheck  # TypeScript only
```

Always run `npm run build` before pushing. If it fails, the deploy fails.

## Editing content: `src/config/event.ts`

Everything the club changes lives in **one file**,
[`src/config/event.ts`](src/config/event.ts). Every field is commented.
You should never need to edit a component.

| What | Field | Notes |
|---|---|---|
| Names | `name`, `tagline`, `clubName`, `collegeName` | |
| Hero | `heroLine`, `facts[]` | One line under the wordmark (max 12 words); the facts row under the hero (`short` labels are used on phones). |
| About | `about.intro[]`, `about.benefits[]` | Two short sentences and three one-line benefits. |
| Date status | `datesConfirmed` | `false` shows "Dates to be confirmed" everywhere dates appear. Set `true` when final. |
| Days | `days[]` | Date (ISO with `+05:30`), short title (under the schedule candle), up to 3 topics (shown when the day is selected). |
| Submission deadline | `submissionDeadline`, `submissionDeadlineConfirmed` | Placeholder `23:59` until decided. |
| Links | `links.whatsappAnnouncements`, `links.whatsappDoubts`, `links.submissionForm`, `links.registrationEndpoint` | Empty `''` = button shows disabled with "Link coming soon". |
| Files | `resources[]` | `file: null` = locked. See below. |
| Recording | `recordingUrl` | `null` hides the "Recorded session" card. Set a URL to show it on `/resources`. |
| FAQ | `faq[]` | `{ question, answer }`. At most 6 are shown. The live-sessions answer is a placeholder. |

Other files you may replace:

- `public/brand/logo-placeholder.svg`: the three-bar mark next to the
  wordmark. Replace with the club logo (same file name, square works best).
- `public/brand/favicon.svg`: browser tab icon.
- `public/certificates.json`: certificate list for `/verify` (see below).

## Adding a day's PDF

1. Put the file in `public/resources/`, e.g. `public/resources/day-1.pdf`.
   Use lowercase names without spaces.
2. In `src/config/event.ts`, find that resource and set
   `file: '/resources/day-1.pdf'`.
3. `npm run build`, commit, push. Vercel redeploys in about a minute.

The item switches from "Unlocks on 27 Oct" to **Download** and **View
here** (in-page PDF viewer with a download fallback). The Python notebook
works the same way (e.g. `/resources/first-tick-python.ipynb`); it gets a
download button but no in-page viewer.

### The real unlock

> **Date-based locking in the browser is only cosmetic.** Anything inside
> `public/` is publicly downloadable as soon as it is deployed, whatever
> the page says. The real unlock is that **a day's PDF is not committed to
> `public/resources/` until the morning of that day**. Do not push Day 2 or
> Day 3 notes, or the assignment brief, early.

The site does not compare the current date with `availableOn` at all; an
item is unlocked only when its `file` is set. `availableOn` is just the
date shown on the locked card.

## Certificates and `/verify`

The landing page does not link the verify page for
now; the route still works at `/verify` if you open it directly.

`public/certificates.json` is an array:

```json
[{ "id": "FT26-0001", "name": "Full Name", "tier": "Completion", "date": "2026-10-30" }]
```

`tier` is `"Completion"` or `"Merit"`. Lookups ignore case and spaces. The
file ships with two clearly fake sample entries
(`FT26-SAMPLE-0001`, `FT26-SAMPLE-0002`); **delete them** when adding real
certificates. Note that the whole file is public, so anyone can download
the list of names and IDs. Keep it to name, tier, date and ID.

## Registration

The form posts JSON to `links.registrationEndpoint`, a Google Apps Script
web app writing to a club-owned Google Sheet and rejecting duplicate
emails. Script: [`docs/apps-script.gs`](docs/apps-script.gs). Step-by-step
setup: [`docs/registration-setup.md`](docs/registration-setup.md).

With an empty endpoint the form runs in **demo mode**: it validates, sends
nothing, and shows "Demo mode, nothing was saved" on the success screen.

## Deploying to Vercel (free)

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project**, import the
   repo. Vercel detects Vite: build command `npm run build`, output
   directory `dist`. No environment variables are needed.
3. Deploy. Every push to `main` redeploys automatically.

`vercel.json` rewrites unknown paths to `index.html` so `/resources` and
`/verify` work on refresh, while real files (PDFs, JSON) are served as-is.

## Environment variables

None. All settings are in `src/config/event.ts`, so there is no
`.env.example`. (The registration endpoint is a public URL by design.)

## Assumptions

Made while building Phase 1 without asking; change any of them freely.

- **Dates** are as in the spec (27–30 Oct 2026, IST) and still unconfirmed,
  so `datesConfirmed: false`.
- **Day 4 deadline** placeholder is 30 Oct 2026, 11:59 pm IST, marked
  "time to be confirmed".
- **Unlock times** for resources are shown as 8:00 am IST on their day.
  The assignment brief is shown as unlocking on Day 3 (29 Oct), because
  Day 3 covers assignment guidance. The Python notebook is shown as Day 2
  (28 Oct), after moving averages are introduced.
- **Live sessions**: not decided, so the FAQ answer says "To be announced".
- **Year of study** options: 1st to 4th year, plus "Other" for anyone
  outside that range (e.g. PG or 5th-year integrated students).
- **College email**: any valid email format is accepted. The college email
  domain is not enforced because it was not specified. Add a domain check
  in `src/lib/registration.ts` (`validate`) if needed.
- **WhatsApp number**: must be a 10-digit Indian mobile number (starting
  6–9); `+91` or a leading `0` is accepted and stripped.
- **Experience levels** are stored as `never`, `basics`, `traded`.
- **Certificate ID format** in the samples is `FT26-…`. The
  real format is the club's choice; `/verify` matches whatever is in the
  JSON.
- **Merit rubric** is described as rewarding process, risk management and
  clarity rather than profit, to be published with the assignment brief.
- **No photos** are used anywhere (no stock or AI images).
- **Logo**: a placeholder three-bar mark in `public/brand/`.
- **Colour**: muted text was nudged from `#9A9486` to `#A39D8F` for
  comfortable AA contrast. Market green `#2FBF71` and red `#E5534B` are
  used only inside charts; form errors use a lighter red `#EE6A62`.
- **Hero chart** is a random-walk simulation, labelled as such. The
  pointer pulls the price toward its height; the price scale is fixed
  around 100 so it can never run away. Tick ~120 ms, 9 ticks per candle.
- **Schedule candle heights** are design choices (rising Day 1 → Day 3,
  smaller hollow Day 4), not data.
- **Fonts**: Fraunces (display) and IBM Plex Sans / Plex Mono (text, dates,
  IDs). Plex Mono is the same family as Plex Sans.
- **Hosting**: Vercel, with the SPA rewrite in `vercel.json`.
- **Doubts group** is a separate WhatsApp group from announcements.

## Project layout

```
src/
  config/event.ts       all editable content
  components/           header, footer, buttons, live chart canvas wrapper, form
  sections/             landing page sections in page order
  pages/                Home, Resources, Verify, NotFound
  lib/                  live chart engine (liveChart.ts), date formatting, registration logic, hooks
public/
  brand/                logo placeholder, favicon
  resources/            daily PDFs (commit each on its morning)
  certificates.json     data for /verify
docs/
  design-plan.md        palette, type, wireframe, hero moment
  apps-script.gs        registration handler for Google Sheets
  registration-setup.md how to deploy it
```

## Content rules

- Nothing on the site is investment advice. No tips, no return claims,
  no invented statistics or testimonials.
- Do not use any other organisation's name, logo, PDFs, text or images.
