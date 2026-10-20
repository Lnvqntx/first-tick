/**
 * Simulated live candlestick chart drawn on a <canvas>.
 *
 * Not market data: prices come from a random walk. When a pointer is over
 * the hero, the price drifts toward the level under it, so the visitor can
 * "move the market". The price scale is fixed (it only re-centres slowly),
 * so the pointer-to-price mapping can never run away.
 */

interface Candle {
  o: number
  h: number
  l: number
  c: number
  v: number
}

const COLORS = {
  ink: '#0B0A08',
  grid: 'rgba(154, 148, 134, 0.09)',
  axis: 'rgba(163, 157, 143, 0.75)',
  up: '#2FBF71',
  down: '#E5534B',
  gold: '#E3B23C',
  crosshair: 'rgba(243, 238, 227, 0.45)',
  tagBg: '#151311',
}

const TICK_MS = 120
const TICKS_PER_CANDLE = 9
const SCALE_HALF = 7 // visible price range is mid ± SCALE_HALF
const AXIS_W = 58
const MONO = '"IBM Plex Mono", ui-monospace, monospace'

function gauss(): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export class LiveChart {
  private ctx: CanvasRenderingContext2D
  private candles: Candle[] = []
  private price = 100
  private anchor = 100
  private mid = 100
  private tick = 0
  private tickAcc = 0
  private lastTime = 0
  private raf = 0
  private running = false
  private visible = true
  private onScreen = true
  private w = 0
  private h = 0
  private dpr = 1
  private spacing = 14
  private maxCandles = 120
  private pointer: { x: number; y: number } | null = null
  private touchTimer = 0
  private cleanup: (() => void)[] = []

  constructor(
    private canvas: HTMLCanvasElement,
    /** Element that receives pointer events (the hero section). */
    private target: HTMLElement,
    private reducedMotion: boolean,
  ) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2D canvas not supported')
    this.ctx = ctx
    this.resize()
    this.seed()
    this.bind()
    if (reducedMotion) this.draw(0)
    else this.start()
  }

  destroy() {
    this.stop()
    window.clearTimeout(this.touchTimer)
    this.cleanup.forEach((fn) => fn())
  }

  /* ---------------- lifecycle ---------------- */

  private start() {
    if (this.running || this.reducedMotion || !this.visible || !this.onScreen) return
    this.running = true
    this.lastTime = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  private stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  private frame = (now: number) => {
    if (!this.running) return
    // Cap dt so a long pause never replays hundreds of ticks at once.
    const dt = Math.min(now - this.lastTime, 250)
    this.lastTime = now
    this.tickAcc += dt
    while (this.tickAcc >= TICK_MS) {
      this.tickAcc -= TICK_MS
      this.step()
    }
    this.draw(this.tickAcc / TICK_MS)
    this.raf = requestAnimationFrame(this.frame)
  }

  private bind() {
    const ro = new ResizeObserver(() => {
      this.resize()
      if (!this.running) this.draw(0)
    })
    ro.observe(this.canvas)
    this.cleanup.push(() => ro.disconnect())

    const io = new IntersectionObserver(([entry]) => {
      this.onScreen = entry.isIntersecting
      if (this.onScreen) this.start()
      else this.stop()
    })
    io.observe(this.canvas)
    this.cleanup.push(() => io.disconnect())

    const onVis = () => {
      this.visible = document.visibilityState === 'visible'
      if (this.visible) this.start()
      else this.stop()
    }
    document.addEventListener('visibilitychange', onVis)
    this.cleanup.push(() => document.removeEventListener('visibilitychange', onVis))

    const onMove = (e: PointerEvent) => {
      const r = this.canvas.getBoundingClientRect()
      this.pointer = { x: e.clientX - r.left, y: e.clientY - r.top }
      if (e.pointerType !== 'mouse') {
        // Touch: keep the crosshair briefly after the finger lifts or scrolls.
        window.clearTimeout(this.touchTimer)
        this.touchTimer = window.setTimeout(() => this.clearPointer(), 1600)
      }
      if (!this.running) this.draw(0)
    }
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') this.clearPointer()
    }
    const t = this.target
    t.addEventListener('pointermove', onMove, { passive: true })
    t.addEventListener('pointerdown', onMove, { passive: true })
    t.addEventListener('pointerleave', onLeave)
    this.cleanup.push(() => {
      t.removeEventListener('pointermove', onMove)
      t.removeEventListener('pointerdown', onMove)
      t.removeEventListener('pointerleave', onLeave)
    })
  }

  private clearPointer() {
    this.pointer = null
    if (!this.running) this.draw(0)
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect()
    this.dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.w = Math.max(1, rect.width)
    this.h = Math.max(1, rect.height)
    this.canvas.width = Math.round(this.w * this.dpr)
    this.canvas.height = Math.round(this.h * this.dpr)
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    this.spacing = this.w < 640 ? 11 : 14
    this.maxCandles = Math.ceil((this.w - AXIS_W) / this.spacing) + 3
    if (this.candles.length < this.maxCandles) this.seed()
  }

  /* ---------------- simulation ---------------- */

  /** Fill the chart with history so it is never empty. */
  private seed() {
    const needed = this.maxCandles - this.candles.length
    if (needed <= 0) return
    const saved = { price: this.price, tick: this.tick, candles: this.candles }
    this.candles = []
    this.price = 100
    this.tick = 0
    this.candles.push({ o: 100, h: 100, l: 100, c: 100, v: 0 })
    while (this.candles.length < needed) this.step()
    this.candles = this.candles.concat(saved.candles.length ? saved.candles.slice(0) : [])
    if (saved.candles.length) {
      this.price = saved.price
      this.tick = saved.tick
    }
  }

  private priceAtY(y: number): number {
    const { top, bottom } = this.plot()
    const t = (y - top) / (bottom - top)
    return this.mid + SCALE_HALF - t * 2 * SCALE_HALF
  }

  private yAtPrice(p: number): number {
    const { top, bottom } = this.plot()
    return top + ((this.mid + SCALE_HALF - p) / (2 * SCALE_HALF)) * (bottom - top)
  }

  private plot() {
    return { top: this.h * 0.08, bottom: this.h * 0.8, volTop: this.h * 0.86, volBottom: this.h }
  }

  private step() {
    const lo = this.mid - SCALE_HALF * 0.92
    const hi = this.mid + SCALE_HALF * 0.92

    // Idle anchor: slow random walk pulled back toward the middle.
    this.anchor += gauss() * 0.22 + (this.mid - this.anchor) * 0.02
    this.anchor = Math.min(hi, Math.max(lo, this.anchor))

    let target = this.anchor
    let pull = 0.05
    let sigma = 0.2
    if (this.pointer) {
      target = Math.min(hi, Math.max(lo, this.priceAtY(this.pointer.y)))
      pull = 0.16
      sigma = 0.13
    }
    const prev = this.price
    this.price += (target - this.price) * pull + gauss() * sigma
    this.price = Math.min(hi, Math.max(lo, this.price))

    const c = this.candles[this.candles.length - 1]
    c.c = this.price
    c.h = Math.max(c.h, this.price)
    c.l = Math.min(c.l, this.price)
    c.v += Math.abs(this.price - prev) + Math.random() * 0.08

    // Re-centre the scale very slowly toward recent prices.
    this.mid += (this.price - this.mid) * 0.004

    this.tick++
    if (this.tick % TICKS_PER_CANDLE === 0) {
      this.candles.push({ o: this.price, h: this.price, l: this.price, c: this.price, v: 0 })
      const excess = this.candles.length - this.maxCandles
      if (excess > 0) this.candles.splice(0, excess)
    }
  }

  /* ---------------- drawing ---------------- */

  private draw(frac: number) {
    const { ctx, w, h, spacing } = this
    const { volTop, volBottom } = this.plot()
    const right = w - AXIS_W
    const progress = ((this.tick % TICKS_PER_CANDLE) + frac) / TICKS_PER_CANDLE
    const n = this.candles.length
    const xOf = (i: number) => right - spacing * 0.8 - (n - 1 - i) * spacing - progress * spacing

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = COLORS.ink
    ctx.fillRect(0, 0, w, h)

    // Horizontal grid + right axis labels
    ctx.font = `11px ${MONO}`
    ctx.textBaseline = 'middle'
    ctx.lineWidth = 1
    const stepP = 2
    const first = Math.ceil((this.mid - SCALE_HALF) / stepP) * stepP
    for (let p = first; p <= this.mid + SCALE_HALF; p += stepP) {
      const y = Math.round(this.yAtPrice(p)) + 0.5
      ctx.strokeStyle = COLORS.grid
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(right, y)
      ctx.stroke()
      ctx.fillStyle = COLORS.axis
      ctx.fillText(p.toFixed(2), right + 8, y)
    }
    // Vertical grid moves with the candles
    for (let i = n - 1; i >= 0; i -= 8) {
      const x = Math.round(xOf(i)) + 0.5
      ctx.strokeStyle = COLORS.grid
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, volBottom)
      ctx.stroke()
    }

    // Volume
    const maxV = this.candles.reduce((m, c) => Math.max(m, c.v), 0.001)
    const bodyW = Math.max(3, Math.round(spacing * 0.62))
    for (let i = 0; i < n; i++) {
      const c = this.candles[i]
      const x = xOf(i)
      const vh = (c.v / maxV) * (volBottom - volTop)
      ctx.fillStyle = c.c >= c.o ? 'rgba(47, 191, 113, 0.22)' : 'rgba(229, 83, 75, 0.22)'
      ctx.fillRect(Math.round(x - bodyW / 2), volBottom - vh, bodyW, vh)
    }

    // Candles: newer candles slightly brighter
    for (let i = 0; i < n; i++) {
      const c = this.candles[i]
      const x = Math.round(xOf(i)) + 0.5
      if (x < -spacing || x > right) continue
      const up = c.c >= c.o
      ctx.globalAlpha = 0.45 + 0.45 * (i / n)
      ctx.strokeStyle = ctx.fillStyle = up ? COLORS.up : COLORS.down
      ctx.beginPath()
      ctx.moveTo(x, this.yAtPrice(c.h))
      ctx.lineTo(x, this.yAtPrice(c.l))
      ctx.stroke()
      const y1 = this.yAtPrice(Math.max(c.o, c.c))
      const bh = Math.max(1, this.yAtPrice(Math.min(c.o, c.c)) - y1)
      ctx.fillRect(Math.round(x - bodyW / 2), y1, bodyW, bh)
    }
    ctx.globalAlpha = 1

    // Smoothed gold price line through closes
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = COLORS.gold
    ctx.lineWidth = 1.6
    ctx.shadowColor = 'rgba(227, 178, 60, 0.55)'
    ctx.shadowBlur = 8
    let px = xOf(0)
    let py = this.yAtPrice(this.candles[0].c)
    ctx.moveTo(px, py)
    for (let i = 1; i < n; i++) {
      const x = xOf(i)
      const y = this.yAtPrice(this.candles[i].c)
      ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2)
      px = x
      py = y
    }
    ctx.lineTo(px, py)
    ctx.stroke()
    ctx.restore()

    // Last price: dashed line + tag
    const ly = this.yAtPrice(this.price)
    const lastUp = this.price >= this.candles[n - 1].o
    ctx.setLineDash([3, 4])
    ctx.strokeStyle = 'rgba(227, 178, 60, 0.6)'
    ctx.beginPath()
    ctx.moveTo(px, Math.round(ly) + 0.5)
    ctx.lineTo(right, Math.round(ly) + 0.5)
    ctx.stroke()
    ctx.setLineDash([])
    this.tag(right, ly, this.price.toFixed(2), lastUp ? COLORS.up : COLORS.down, COLORS.ink)

    // Crosshair
    if (this.pointer && this.pointer.y >= 0 && this.pointer.y <= h) {
      const cx = Math.round(this.pointer.x) + 0.5
      const cy = Math.round(this.pointer.y) + 0.5
      ctx.setLineDash([4, 4])
      ctx.strokeStyle = COLORS.crosshair
      ctx.beginPath()
      ctx.moveTo(0, cy)
      ctx.lineTo(right, cy)
      if (cx < right) {
        ctx.moveTo(cx, 0)
        ctx.lineTo(cx, h)
      }
      ctx.stroke()
      ctx.setLineDash([])
      this.tag(right, cy, this.priceAtY(this.pointer.y).toFixed(2), COLORS.tagBg, COLORS.gold, COLORS.gold)
    }
  }

  private tag(x: number, y: number, text: string, bg: string, fg: string, border?: string) {
    const { ctx } = this
    const hgt = 18
    ctx.fillStyle = bg
    ctx.fillRect(x + 2, y - hgt / 2, AXIS_W - 4, hgt)
    if (border) {
      ctx.strokeStyle = border
      ctx.strokeRect(x + 2.5, y - hgt / 2 + 0.5, AXIS_W - 5, hgt - 1)
    }
    ctx.fillStyle = fg
    ctx.font = `500 11px ${MONO}`
    ctx.fillText(text, x + 8, y + 0.5)
    ctx.font = `11px ${MONO}`
  }
}
