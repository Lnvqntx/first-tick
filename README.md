# First Tick website

The website for **First Tick**, a free beginner event on financial markets
and trading run by the Programming Club, CR Rao AIMSCS (University of
Hyderabad campus): three learning days, a paper-trading assignment and a
certificate.

The site's jobs: get students to register and join the WhatsApp
community, serve the daily PDFs, link the final submission form, and let
anyone verify a certificate ID.

- `/` landing page: live-chart hero, marquee bands, schedule, final challenge and certificate, three steps to join, FAQ
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
| Logo | `clubLogo` | Path and alt text for the club seal. See "Club logo" below. |
| Hero | `heroLine` | One line under the wordmark (max 12 words). |
| Bands | `marquee.primary[]`, `marquee.secondary[]` | The two scrolling bands under the hero. |
| Challenge | `challenge` | Heading, intro, the four challenge items and the certificate card text. |
| Join steps | `steps` | Copy for the three steps (the step 3 date comes from Day 1). |
| Date status | `datesConfirmed` | `false` shows "Dates to be confirmed" everywhere dates appear. Set `true` when final. |
| Days | `days[]` | Date (ISO with `+05:30`), short title (under the schedule candle), up to 3 topics (shown when the day is selected). |
| Submission deadline | `submissionDeadline`, `submissionDeadlineConfirmed` | Placeholder `23:59` until decided. |
| Links | `links.registrationForm`, `links.whatsappCommunity`, `links.submissionForm` | Full `https://` URLs; they open in a new tab. Empty `''` = button shows disabled with "Link coming soon". |
| Files | `resources[]` | `file: null` = locked. See below. |
| Recording | `recordingUrl` | `null` hides the "Recorded session" card. Set a URL to show it on `/resources`. |
| FAQ | `faq[]` | `{ question, answer }`. At most 6 are shown. The live-sessions answer is a placeholder. |

Other files you may replace:

- `public/brand/Programming_club_logo.png`: the club logo source (see below).
- `public/certificates.json`: certificate list for `/verify` (see below).

## Club logo

The header, footer, certificate card and favicons use files generated
from the club logo source, `public/brand/Programming_club_logo.png`:

- `logo.png`: the seal cropped to a transparent circle, 256×256
- `favicon-32.png`: the seal's inner disc only (the outer ring of text is
  unreadable at 32px)
- `apple-touch-icon.png`: the full seal on the site's dark colour

To change the logo, replace the source file (any background; png, jpg or
webp; named `Programming_club_logo` or `programming-club-logo`), run
`npm run logo`, check with `npm run dev`, and commit the generated files.
The script is `scripts/prepare-logo.mjs` (uses `sharp`).

The seal is black with white rings, so the site always draws a thin light
ring and a soft gold glow around it to keep it visible on the dark
background.

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

Students register through a Google Form owned by the club. Put its
link in `links.registrationForm`; every "Register now" and "Open form"
button uses it. There is no in-page form, so this repo stores no personal
data.

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
`.env.example`. (The form and WhatsApp links are public URLs by design.)

## Assumptions

Made while building without asking; change any of them freely.

- **Dates** are as in the spec (27–30 Oct 2026, IST) and still unconfirmed,
  so `datesConfirmed: false`.
- **Day 4 deadline** placeholder is 30 Oct 2026, 11:59 pm IST, marked
  "time to be confirmed".
- **Unlock times** for resources are shown as 8:00 am IST on their day.
  The assignment brief is shown as unlocking on Day 3 (29 Oct), because
  Day 3 covers assignment guidance. The Python notebook is shown as Day 2
  (28 Oct), after moving averages are introduced.
- **Live sessions**: not decided, so the FAQ answer says "To be announced".
- **Certificate ID format** in the samples is `FT26-…`. The
  real format is the club's choice; `/verify` matches whatever is in the
  JSON.
- **Merit rubric** is described as rewarding process, risk management and
  clarity rather than profit, to be published with the assignment brief.
- **No photos** are used anywhere (no stock or AI images).
- **Colour**: muted text was nudged from `#9A9486` to `#A39D8F` for
  comfortable AA contrast. Market green `#2FBF71` and red `#E5534B` are
  used in charts (hero, schedule, certificate seal); error text uses a lighter red `#EE6A62`.
- **Hero chart** is a random-walk simulation, labelled as such. The
  pointer pulls the price toward its height; the price scale is fixed
  around 100 so it can never run away. Tick ~120 ms, 9 ticks per candle.
- **Schedule candle heights** are design choices (rising Day 1 → Day 3,
  smaller hollow Day 4), not data.
- **Fonts**: Fraunces (display) and IBM Plex Sans / Plex Mono (text, dates,
  IDs). Plex Mono is the same family as Plex Sans.
- **Hosting**: Vercel, with the SPA rewrite in `vercel.json`.
- **One WhatsApp community** link replaces the separate announcements and
  doubts groups.
- **Header Register button** scrolls to "Three steps to your first tick"
  instead of opening the form directly, so the nav never shows a disabled
  button. The hero, step 1 and the footer link straight to the form.
- **Favicon** uses the seal's inner P/C disc rather than the full seal,
  because the outer text ring turns to noise at 32px.
- **Hero colour glows** include a faint magenta (at most 20% alpha, hero
  only) as the "touch of violet or magenta". No blue or purple elsewhere.
- **Challenge items** each get one short line of explanation under the
  four requested titles.
- **Certificate card** shows a generic `ID FT26-XXXX` chip to illustrate
  the verifiable ID; it does not link to `/verify` while that page is
  unlinked.
- **Scroll reveal**: 500ms per element with up to 280ms of stagger.

## Project layout

```
src/
  config/event.ts       all editable content
  components/           header, footer, pill buttons, live chart wrapper, marquee, certificate card, logo
  sections/             landing page sections in page order
  pages/                Home, Resources, Verify, NotFound
  lib/                  live chart engine, scroll reveal, cursor glow, dates, hooks
scripts/
  prepare-logo.mjs      crops the club seal and builds logo.png + favicons (npm run logo)
public/
  brand/                club logo (logo.png), favicons, logo source
  resources/            daily PDFs (commit each on its morning)
  certificates.json     data for /verify
docs/
  design-plan.md        palette, type, wireframe, hero moment
```

## Content rules

- Nothing on the site is investment advice. No tips, no return claims,
  no invented statistics or testimonials.
- Do not use any other organisation's name, logo, PDFs, text or images.
