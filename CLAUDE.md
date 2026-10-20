# First Tick: website spec

## What this is
First Tick is a free, beginner-friendly online event on financial markets and trading, run by the Programming Club of CR Rao AIMSCS (University of Hyderabad campus). Format: 3 learning days (theory), then 1 paper-trading assignment day, then a certificate. Open to all CR Rao AIMSCS students. Optional Python track (plot a chart, backtest a moving-average crossover).

This repo (`Lnvqntx/first-tick`) is the event website. Primary job of the site: get students to register and join the WhatsApp community, then serve the daily PDFs and the final submission link.

Audience: first- to fourth-year students, mostly on phones. Many have never traded.

## Tech
- Vite + React + TypeScript + Tailwind CSS, static output, deployed on Vercel (free). No backend in this repo.
- `react-router-dom` for three routes: `/` (single long landing page), `/resources`, `/verify`.
- Self-host fonts with `@fontsource` (no Google Fonts CDN calls).
- Keep dependencies minimal. No UI kit that forces a generic look.

## Content that must be easy to change: `src/config/event.ts`
Everything the club will edit lives here, typed and commented:
- `name`, `tagline`, `clubName`, `collegeName`
- `datesConfirmed: false`. When false, show the dates with a small "Dates to be confirmed" note everywhere they appear. Flip to true to remove it.
- Days (timezone IST, +05:30):
  - Day 1: 27 Oct 2026, Markets and basics
  - Day 2: 28 Oct 2026, Analysis and market movers
  - Day 3: 29 Oct 2026, Risk, strategy and practice
  - Day 4: 30 Oct 2026, Paper-trade assignment submission (deadline time TBD, use a placeholder)
- `links`: `whatsappAnnouncements`, `whatsappDoubts`, `submissionForm`, `registrationEndpoint`. All empty strings for now. Any button whose link is empty renders as visibly disabled with a "Link coming soon" state, never a dead click.
- `resources`: one entry per item (Day 1, 2, 3 PDFs, assignment brief, Python notebook) with `{ id, title, day, availableOn, file: string | null }`. `file: null` means locked or coming soon.
- `recordingUrl: null`. Only render a "Recorded session" card if this is set. Do not show it otherwise.
- `faq`: array of question and answer.

## Design direction (follow this)
Black and gold with market energy. Premium and cinematic, like a live trading desk at night, but classy, never neon. Not a copy of any other course site (no purple, no 3D shapes, no borrowed layouts).
- Palette (adjust slightly if contrast demands): ink `#0B0A08`, surface `#151311`, line `#2A2620`, gold `#E3B23C`, deep gold `#B8892B`, text `#F3EEE3`, muted `#A39D8F`. Market colours: up green `#2FBF71`, down red `#E5534B`, used inside charts only (hero chart, schedule candles).
- Gold: a richer gold gradient (`#F7D77E` → `#E3B23C` → `#B8892B`) on the primary button and a few key marks (wordmark "TICK", selected schedule candle, Day 4 outline). Soft gold glow on hover and keyboard focus only. Still spend gold sparingly.
- Type: two clearly distinct, non-default families (Fraunces for display, IBM Plex Sans/Mono for text). Bold, large display type; secondary copy in muted so headings pop. Sentence case for headings and labels. Body lines under 75 characters. Defined type scale in `tailwind.config.js`.
- Wordmark: "FIRSTTICK" with the "TICK" part in gold and a small three-bar signal mark. Placeholder logo file at `public/brand/logo-placeholder.svg` that the club can replace.
- Motion, only two things: (1) the hero's live simulated chart (the memorable moment), (2) the schedule candles grow in once when first scrolled into view. Everything else is static apart from hover and focus. Respect `prefers-reduced-motion` (static chart with crosshair; candles shown without the grow-in).
- Layout: generous spacing, thin hairlines only where they separate real content. The hero is centred; other sections are left-aligned. Avoid identical rounded-card grids, tracked all-caps eyebrow labels above every heading, "01 / 02 / 03" numbering (only use numbers for the actual day sequence), decorative gradient washes (the hero's dark readability vignette is the one functional overlay) and fade-in on every section.
- Page length: the landing page should stay around 4–5 screens at 1440×900. Keep copy short.
- No stock photos and no AI-generated campus or office images.
- Quality floor: responsive from 360px up, visible keyboard focus, AA contrast (including text over the hero chart), semantic HTML, alt text, fast first load.

## Pages and sections

### `/` Landing (in this order)
1. Header: wordmark, nav (About, Schedule, Resources, FAQ), Register button.
2. Hero (full viewport):
   - Behind the content, a full-bleed `<canvas>` candlestick chart streaming a SIMULATED price feed: a tick every ~100–150 ms, candles forming and scrolling left, a smooth gold live-price line, faint grid, small volume bars along the bottom.
   - Pointer interaction: a crosshair follows the cursor (or touch point) with a price label on the right axis, and the live price drifts toward the level under the pointer's Y, so moving it visibly changes the current candle, price and recent candle colours. When idle the feed keeps running on its own.
   - Dark vignette overlay so text stays AA-readable. Tiny label: "Simulated chart, not real market data".
   - Performance: requestAnimationFrame, devicePixelRatio and resize handled, paused when the tab is hidden or the hero is off-screen, candle count capped by width.
   - Content, centred: a small chip "Programming Club, CR Rao AIMSCS | 27–30 Oct 2026" (with the "Dates to be confirmed" note from config), a huge "FIRSTTICK" wordmark (FIRST off-white, TICK gold), one line of at most 12 words (`heroLine` in config), and two buttons: Register, View schedule.
   - Under the hero, one line of true facts from config (3 learning days, 1 assignment, free for CR Rao AIMSCS students, certificate on completion). No invented numbers or testimonials.
3. Schedule: a horizontal row of four candles for Day 1 to Day 4 joined by a thin trend line. Days 1–3 rise and are green (Day 3 tallest); Day 4 (assignment) is a hollow gold outline. Under each candle: day label, date, short title. Each candle is a real `<button aria-pressed>`; hover, focus or click shows that day's topics (max 3 bullets from config) in one panel below. Day 1 selected by default. Compact horizontal row on mobile.
4. About (merged with Why join): two short sentences (who runs it, process and risk not tips) plus three one-line benefits: paper trading, optional Python track, community and doubts. All from `about` in config.
5. Register: the form (see below), with a two-line intro.
6. FAQ: accordion from config, at most 6 questions with 1–2 sentence answers: prior knowledge, cost, live sessions (TBD), the final assignment, certificates, where updates are shared.
7. Footer: club credit, WhatsApp links, Resources link, the final Register button, and the disclaimer. No separate closing CTA block.

Certificates are not shown on the landing page for now (no section, preview or links). The `/verify` route and its files stay in the repo, unlinked.

### `/resources`
Tabs: Day 1, Day 2, Day 3, Assignment, Python track. Each item shows a locked state ("Unlocks on 27 Oct", dates from config) or an unlocked state (Download, plus an in-page PDF view via `<iframe>` or `<object>` with a download fallback) based on whether `file` is set. Also show an "Open submission form" button on the Assignment tab, disabled until `links.submissionForm` is set. Include a short note on the assignment page about the expected PDF format (annotated chart, entry/stop/target, risk-reward, position size, short justification).

Important: date-based unlocking in the browser is only cosmetic. The real unlock is that a day's PDF is not committed to `public/resources/` until its morning. Document this in the README.

### `/verify` (kept, currently not linked from the site)
Input for a certificate ID. Look it up in `public/certificates.json` (array of `{ id, name, tier, date }`; ship a file with two clearly fake sample entries). Show name and tier, or a clear "No certificate found for this ID" message. Normalize case and whitespace.

## Registration form
Fields: full name, college email, year of study (select), branch, WhatsApp number, experience level (never traded / know the basics / have traded before). Client-side validation, inline errors in plain language, double-submit protection.
- `POST` JSON to `links.registrationEndpoint` (a Google Apps Script web app that appends to a club-owned Google Sheet and rejects duplicate emails; the endpoint will be added later).
- If the endpoint is empty, run in demo mode: do not send anything, show a visible "Demo mode, nothing was saved" banner on the success screen.
- On success show a confirmation with the two WhatsApp buttons (disabled with "coming soon" if links are empty).
- Collect only these fields. Add a one-line privacy note: details are used only to run First Tick.
- Also write `docs/apps-script.gs`: the `doPost` handler for the Sheet (header row, duplicate-email check, timestamp, JSON response, CORS-friendly) plus setup steps in `docs/registration-setup.md`.

## Legal and trust
- Footer on every page: "First Tick is an educational event by the Programming Club, CR Rao AIMSCS. Nothing here is investment advice. All practice is paper trading, and trading involves risk of loss."
- Never imply guaranteed returns. No stock tips, no performance claims.
- Do not use any other organisation's name, logo, PDFs, text or images (for example any other college's trading course). All copy is original.

## Repo hygiene
- Create a `README.md`: what the site is, run and build commands, how to edit `src/config/event.ts`, how to add a day's PDF, how to deploy to Vercel, and the "real unlock" note.
- Commit in small logical steps with clear messages. Push to `main` at the end of each step.
- Add `.gitignore`, `.env.example` (if any env is used), and a simple lint and typecheck script. Run `npm run build` and fix all errors and warnings before saying you are done.

## How to work
1. First write a short design plan (palette, fonts, layout wireframe in ASCII, the hero moment) and check it against the "avoid" list above. Revise anything that looks like a default template look, then build.
2. Make reasonable assumptions instead of asking me questions. List every assumption in the README under "Assumptions".
3. Build in this order: project setup and config, layout and hero, the rest of the landing page, registration form, `/resources`, `/verify`, README and docs.
4. After building, run the dev server, check the pages at 360px and 1280px widths, and fix visual issues.

## Definition of done for this phase
- All three routes work, with locked and unlocked states and disabled-link states working from the config alone.
- `npm run build` passes with no errors.
- No fake statistics, testimonials or third-party branding anywhere.
- Content is easy to update from `src/config/event.ts` without touching components.
