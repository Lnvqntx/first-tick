# First Tick: design plan (Phase 1)

## Palette
| Token       | Hex       | Use |
|-------------|-----------|-----|
| ink         | `#0B0A08` | page background |
| surface     | `#151311` | raised panels (form, certificate, timeline rail) |
| line        | `#2A2620` | hairlines between real content only |
| gold        | `#E3B23C` | primary button, "TICK" in wordmark, the hero candle, focus ring |
| gold-deep   | `#B8892B` | pressed / hover state of gold, certificate seal |
| text        | `#F3EEE3` | body and headings (contrast on ink ≈ 17:1) |
| muted       | `#A39D8F` | secondary copy. Nudged up from `#9A9486` to keep AA on surface (≈ 7:1 on ink, ≈ 6.5:1 on surface) |
| loss        | `#C2563F` | only inside the candlestick drawing (bear wick hint) and form errors |

Gold budget: Register buttons, wordmark "TICK", the hero candle, day numbers on the timeline, focus ring. Nothing else.

## Type
- Display: **Fraunces** (variable serif, optical sizing, soft "WONK" off). Expressive, editorial, not a tech default. Headlines only.
- Text: **IBM Plex Sans** for body/UI, with **IBM Plex Mono** (same family) for dates, IDs, prices and the ticker-like fact row. Reads like a terminal without looking like a template.
- Self-hosted via `@fontsource`.
- Scale (1.25 minor third-ish, fluid at the top):
  - display: clamp(2.5rem, 6vw + 1rem, 5rem) / 1.02
  - h2: clamp(2rem, 3vw + 1rem, 3rem) / 1.1
  - h3: 1.5rem / 1.25
  - lead: 1.25rem / 1.55
  - body: 1.0625rem / 1.65
  - small: 0.875rem / 1.5
  - mono-label: 0.8125rem / 1.4
- Sentence case everywhere. Prose columns capped at `max-w-[62ch]`.

## Wireframe (desktop 1280, mobile stacks in the same order)
```
┌──────────────────────────────────────────────────────────────────┐
│ [|||] FIRSTTICK        About  Schedule  Resources  FAQ  [Register]│
├──────────────────────────────────────────────────────────────────┤
│                                                     │            │
│ Your first step                                     │   ┃        │
│ into financial markets.                             │  ┌┸┐       │
│                                                     │  │ │ ← candle│
│ A free 3-day beginner programme, then a             │  │ │  forms  │
│ paper-trading assignment and a certificate.         │  └┰┘  once  │
│                                                     │   ┃        │
│ [Register]  View schedule →                         │ 27–30 Oct  │
│                                                     │            │
│ 3 learning days · 1 assignment · free · certificate (mono row)   │
├──────────────────────────────────────────────────────────────────┤
│ About (two-column: big serif statement left, prose right)        │
├──────────────────────────────────────────────────────────────────┤
│ Why join: one large lead point + three short points in a list    │
│ with hairline separators (not 4 cards)                           │
├──────────────────────────────────────────────────────────────────┤
│ Schedule: vertical rail, gold day number, date in mono, topics   │
│ Day 1 ●── 27 Oct · Markets and basics                            │
│        │   topic, topic, topic                                   │
│ Day 2 ●── ...                                                    │
│ Day 4 ◆── submission (different marker: assignment, not lecture) │
├──────────────────────────────────────────────────────────────────┤
│ Register: left = what happens next; right = form on surface panel│
├──────────────────────────────────────────────────────────────────┤
│ Certificates: two tiers as text left, rendered certificate right │
├──────────────────────────────────────────────────────────────────┤
│ FAQ: native <details> accordion with hairlines                   │
├──────────────────────────────────────────────────────────────────┤
│ Closing line in display serif + Register                         │
│ Footer: club credit · WhatsApp links · disclaimer                │
└──────────────────────────────────────────────────────────────────┘
```

## The hero moment
One SVG candlestick, drawn once on load over ~2.4 s: a faint price grid,
then the open tick appears, the body grows up and down a few times like
live price action ("ticks"), the wick extends to the high and low it
touched, and it closes as a gold bull candle with a small "close" price
label in mono. Driven by a short `requestAnimationFrame` sequence of
predefined ticks (no random data, no loop). With
`prefers-reduced-motion: reduce`, the final candle renders immediately.
Nothing else on the site animates; only hover and focus states.

## Check against the "avoid" list
- Identical rounded-card grids: not used. Why join is a lead+list, schedule is a rail, certificates are a split. Only the form and certificate sit on a panel, with a 2px radius.
- Tracked all-caps eyebrows above every heading: none. Headings stand alone; at most a mono date line where it carries information.
- "01 / 02 / 03" numbering: only the schedule uses Day 1–4.
- Gradient washes: none. Flat ink, one surface tone.
- Fade-in on every section: none. Only the hero candle animates.
- Stock/AI photos: none. Photo slot for the club team in About is a marked SVG placeholder.
- Default fonts: Fraunces + IBM Plex, not Inter/Roboto/Arial/Space Grotesk.

Revision after the check: the first draft had the fact row as four small
boxed stats, which reads as a template "stats bar" and invites fake
numbers. Changed to a single mono line separated by middots.
