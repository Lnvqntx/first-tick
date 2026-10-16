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
Black and gold. Premium, calm, a little cinematic, like a late-night trading desk. Not a copy of any other course site.
- Palette (adjust slightly if contrast demands): ink `#0B0A08`, surface `#151311`, line `#2A2620`, gold `#E3B23C`, deep gold `#B8892B`, text `#F3EEE3`, muted `#9A9486`. Gold is for the primary button and a few key marks only. Spend it sparingly.
- Type: pick two clearly distinct, non-default families (not Inter, Roboto, Arial or Space Grotesk). One expressive display face for headlines, one clean text face. Sentence case for headings and labels. Body lines under 75 characters. Define a real type scale.
- Wordmark: "FIRSTTICK" with the "TICK" part in gold and a small three-bar signal mark. Use a simple placeholder logo file at `public/brand/logo-placeholder.svg` that the club can replace.
- One memorable moment: in the hero, a single candlestick forms tick by tick, once, on load (SVG or canvas, light). Everything else stays still, with hover and focus states only. Respect `prefers-reduced-motion` (show the final state, no animation).
- Layout: left-aligned text, generous spacing, thin hairlines only where they separate real content. Avoid identical rounded-card grids for everything, tracked all-caps eyebrow labels above every heading, "01 / 02 / 03" numbering (only use numbers for the actual day sequence), decorative gradient washes and fade-in on every section.
- No stock photos and no AI-generated campus or office images. Where a photo would go, use a clean typographic or SVG treatment and leave a clearly marked slot.
- Quality floor: responsive from 360px up, visible keyboard focus, AA contrast, semantic HTML, alt text, fast first load.

## Pages and sections

### `/` Landing
1. Header: wordmark, nav (About, Schedule, Resources, FAQ), Register button.
2. Hero: headline "Your first step into financial markets." Supporting line: a free 3-day beginner programme, plus a paper-trading assignment and a certificate. Buttons: Register, View schedule. A small row with only true facts: 3 learning days, 1 assignment, free for CR Rao AIMSCS students, certificate on completion. No invented numbers or testimonials.
3. About: what First Tick is, who runs it (Programming Club), what you will learn, and that it teaches process and risk management, not tips or guaranteed profit.
4. Why join: 4 points (structured path for beginners, learn safely with paper trading, optional Python track, community and doubt support). Keep each to one or two sentences. Vary the layout, do not make four identical cards.
5. Schedule: a vertical timeline for Day 1 to Day 4 with date and topic list.
   - Day 1: What financial markets are, stocks, exchanges, brokers and demat accounts, order types, trading vs investing, personal finance basics, an intro to charts and candlesticks.
   - Day 2: Reading price charts, trends, support and resistance, basic technical analysis (moving averages, RSI), what moves markets (fundamentals, news, macro).
   - Day 3: Entry, stop-loss and target, risk-reward and position sizing, trading psychology and common mistakes, real-world costs and how to spot scams, paper-trading assignment guidance.
   - Day 4: Paper-trade assignment submission.
6. Register: the form (see below).
7. Certificates: Completion (valid final submission that follows the format) and Merit (top submissions on a clear rubric). Show a clean certificate preview rendered in SVG or HTML with a placeholder name and a sample ID.
8. FAQ: accordion from config. Include: prior knowledge needed, cost, live sessions (answer TBD per config), the final assignment, certificates, where updates are shared.
9. Closing call to action, then footer with club credit, WhatsApp links, and the disclaimer.

### `/resources`
Tabs: Day 1, Day 2, Day 3, Assignment, Python track. Each item shows a locked state ("Unlocks on 27 Oct", dates from config) or an unlocked state (Download, plus an in-page PDF view via `<iframe>` or `<object>` with a download fallback) based on whether `file` is set. Also show an "Open submission form" button on the Assignment tab, disabled until `links.submissionForm` is set. Include a short note on the assignment page about the expected PDF format (annotated chart, entry/stop/target, risk-reward, position size, short justification).

Important: date-based unlocking in the browser is only cosmetic. The real unlock is that a day's PDF is not committed to `public/resources/` until its morning. Document this in the README.

### `/verify`
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
