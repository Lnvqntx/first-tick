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

---

# Revision 2: vibrant and short

Goal: more energy, about 4–5 screens at 1440×900 (was about 9).

## Palette changes
| Token | Value | Use |
|---|---|---|
| gold gradient | `linear-gradient(135deg, #F7D77E, #E3B23C 45%, #B8892B)` | primary button, wordmark "TICK", selected schedule candle, Day 4 outline |
| gold glow | `0 0 0 1px rgb(227 178 60 / .45), 0 10px 30px -8px rgb(227 178 60 / .55)` | hover and keyboard focus on buttons and candles only |
| up | `#2FBF71` | rising candles (hero chart, schedule Days 1–3) |
| down | `#E5534B` | falling candles (hero chart only), form errors |

Gold stays scarce: one gradient button per view, one gold word, one gold
line in the chart. Green and red appear only inside charts, where they
mean what they mean on a real chart.

## Type changes
- Hero wordmark: Fraunces 650, `clamp(4.5rem, 15vw, 12rem)`, tight
  tracking, uppercase "FIRSTTICK" (TICK in gradient gold).
- h2: up a step (`clamp(2.25rem, 3vw + 1.25rem, 3.5rem)`), weight 500.
- Body: unchanged size; secondary copy stays muted so headings carry the
  contrast.

## New page order and wireframe (1440×900)
```
screen 1  ┌─────────────────────────────────────────────────────────────┐
          │ header                                                      │
          │░░ live canvas chart, full bleed, vignette over the centre ░░│
          │              [ Programming Club, CR Rao AIMSCS | 27–30 Oct ]│
          │                    F I R S T T I C K                        │
          │      A free three-day beginner programme on markets…        │
          │                 [Register]  [View schedule]                 │
          │ Simulated chart, not real market data          (corner tag) │
          ├─────────────────────────────────────────────────────────────┤
          │ 3 learning days · 1 assignment · free · certificate (1 line)│
screen 2  ├─────────────────────────────────────────────────────────────┤
          │ Schedule                                                    │
          │      ┃            ┃          ┃         ┆                    │
          │   ▇▇ ┃      ▇▇▇▇  ┃   ▇▇▇▇▇▇ ┃     ┌┐  ┆ ← thin trend line  │
          │ Day 1        Day 2       Day 3      Day 4 (hollow gold)     │
          │ ┌ panel: selected day's date, title, 3 bullets ───────────┐ │
screen 3  ├─────────────────────────────────────────────────────────────┤
          │ About: heading + 2 sentences  │ 3 one-line benefits         │
          ├─────────────────────────────────────────────────────────────┤
screen 4  │ Register: 2-line intro        │ form                        │
          ├─────────────────────────────────────────────────────────────┤
          │ FAQ (6, accordion)                                          │
screen 5  │ footer: Register button, WhatsApp, disclaimer               │
          └─────────────────────────────────────────────────────────────┘
```

## Hero: live chart
- `<canvas>` behind the content, simulated ticks every ~120 ms, ~10
  ticks per candle, candles scroll left smoothly; gold smoothed price
  line; dashed last-price line with a tag on the right axis; faint grid;
  volume bars along the bottom.
- Pointer (mouse or touch) sets a target price from its Y position; the
  price drifts toward it, so the current candle and recent candle colours
  follow the hand. Idle: a slow random walk around a wandering anchor.
  The price scale is fixed (so the cursor-to-price mapping never runs
  away) and only re-centres slowly.
- rAF loop, DPR capped at 2, ResizeObserver, paused via
  IntersectionObserver and `visibilitychange`, candle count capped by
  width. Reduced motion: one static chart, crosshair redraws on pointer
  move only.
- Readability: a radial dark vignette centred on the text plus a top and
  bottom fade into ink. Candles are drawn at reduced opacity. Text sits
  on ≥ 85% ink, so AA holds.
- Label: "Simulated chart, not real market data".

## Schedule: horizontal candles
Four real `<button aria-pressed>` candles in a row, rising Day 1→3 (green),
Day 4 a hollow gold outline; a thin SVG trend line joins the closes.
Hover, focus or click selects a day; one panel below shows date, title
and up to 3 topics. Day 1 selected by default. Candles grow once when
the section first scrolls into view (skipped for reduced motion).

## Removed
Certificates section and preview, the closing CTA block, the "Built by
students" box, long About and Why-join copy. `/verify` stays but is not
linked.

## Check against the "avoid" list
- **Identical rounded-card grids:** none. Benefits are a hairline list,
  the schedule is a chart, and the form is the only panel.
- **Eyebrow labels:** none. The hero chip is real information (who and
  when), not a decorative label.
- **01/02/03 numbering:** only Day 1–4.
- **Gradient washes:** the hero vignette is a dark overlay that keeps text
  readable over the canvas, not decoration. The gold gradient is limited
  to the button, wordmark and selected candle. No background washes
  anywhere else.
- **Fade-in on every section:** no. Only two motions on the site: the hero
  feed (the one memorable moment) and a single grow-in of the schedule
  candles. Everything else is static apart from hover and focus.
- **Copying other course sites:** the horizontal candles are drawn as
  literal market candles with a trend line, in our black, gold and
  market-green palette. No purple, no 3D, no borrowed layout.
- **Neon risk:** glow only on hover and focus, low spread, gold only;
  green and red only inside charts.

Revision after the check: the first idea was a gradient-filled section
background behind the schedule. That is a decorative wash, so it was
dropped; the schedule sits on plain ink.
