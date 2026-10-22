/**
 * Prepares the club logo for the site.
 *
 *   npm run logo
 *
 * Reads the club logo from public/brand/ (programming-club-logo.png or
 * Programming_club_logo.png; png, jpg or webp; the circular seal on any
 * background), crops it to the circle on a transparent background, and
 * writes:
 *   public/brand/logo.png              256×256, used in header, footer, certificate
 *   public/brand/favicon-32.png        browser tab icon
 *   public/brand/apple-touch-icon.png  180×180 home-screen icon
 *
 * Options: --in <file>  --out-dir <dir>   (defaults above)
 */
import sharp from 'sharp'
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const opt = (name, fallback) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : fallback
}
// Accepts programming-club-logo.png, Programming_club_logo.png, .jpg, .webp …
const findSource = () => {
  const dir = 'public/brand'
  const hit = existsSync(dir) && readdirSync(dir).find((f) => /^programming[-_ ]?club[-_ ]?logo\.(png|jpe?g|webp)$/i.test(f))
  return hit ? join(dir, hit) : join(dir, 'programming-club-logo.png')
}
const input = opt('--in', findSource())
const outDir = opt('--out-dir', 'public/brand')

if (!existsSync(input)) {
  console.error(`Logo not found: ${input}\nAdd the club logo there, then run "npm run logo" again.`)
  process.exit(1)
}
mkdirSync(outDir, { recursive: true })

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info
const px = (x, y) => {
  const i = (y * W + x) * C
  return [data[i], data[i + 1], data[i + 2], data[i + 3]]
}

// Background = average of the four corners.
const corners = [px(0, 0), px(W - 1, 0), px(0, H - 1), px(W - 1, H - 1)]
const bg = [0, 1, 2, 3].map((k) => corners.reduce((s, c) => s + c[k], 0) / 4)
const bgTransparent = bg[3] < 16
const bgLum = (bg[0] + bg[1] + bg[2]) / 3
console.log(
  `Input ${input}, ${W}×${H}. Background: ${bgTransparent ? 'transparent' : `rgb(${bg.slice(0, 3).map(Math.round).join(', ')})`}` +
    (bgTransparent ? '' : bgLum > 160 ? ' (light)' : ' (dark)'),
)

// Bounding box of everything that differs from the background = the seal.
const differs = (p) =>
  bgTransparent ? p[3] > 24 : Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) > 60
let minX = W, minY = H, maxX = -1, maxY = -1
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (differs(px(x, y))) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
}
if (maxX < 0) {
  console.error('Could not find the seal: the image looks empty.')
  process.exit(1)
}

// Square crop centred on the seal.
const cx = (minX + maxX) / 2
const cy = (minY + maxY) / 2
const size = Math.ceil(Math.max(maxX - minX, maxY - minY)) + 2
const left = Math.max(0, Math.round(cx - size / 2))
const top = Math.max(0, Math.round(cy - size / 2))
const side = Math.min(size, W - left, H - top)
console.log(`Seal found at ${left},${top}, ${side}px square.`)

// Circular mask removes whatever background is left in the corners.
const OUT = 256 // largest on-page use is 40px; 256 covers 2–3x screens
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OUT}" height="${OUT}"><circle cx="${OUT / 2}" cy="${OUT / 2}" r="${OUT / 2 - 1}" fill="#fff"/></svg>`,
)
const logo = await sharp(input)
  .ensureAlpha()
  .extract({ left, top, width: side, height: side })
  .resize(OUT, OUT, { kernel: 'lanczos3' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png({ compressionLevel: 9 })
  .toBuffer()

// Palette PNG: the seal is black and white, so this keeps it small without visible loss.
await sharp(logo).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(join(outDir, 'logo.png'))
// At 32px the outer text ring turns to noise, so the favicon uses the seal's
// inner disc only (the centre FAVICON_CORE of the diameter), re-masked to a circle.
const FAVICON_CORE = 0.66
const coreSide = Math.round(OUT * FAVICON_CORE)
const coreOff = Math.round((OUT - coreSide) / 2)
const smallMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="31.5" fill="#fff"/></svg>`,
)
await sharp(
  await sharp(logo)
    .extract({ left: coreOff, top: coreOff, width: coreSide, height: coreSide })
    .resize(64, 64, { kernel: 'lanczos3' })
    .composite([{ input: smallMask, blend: 'dest-in' }])
    .png()
    .toBuffer(),
)
  .resize(32, 32)
  .png()
  .toFile(join(outDir, 'favicon-32.png'))
// Home-screen icon: seal on the site's ink colour (iOS shows transparency as black anyway).
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#0B0A08' } })
  .composite([{ input: await sharp(logo).resize(160, 160).toBuffer(), left: 10, top: 10 }])
  .png()
  .toFile(join(outDir, 'apple-touch-icon.png'))

console.log(`Wrote logo.png, favicon-32.png and apple-touch-icon.png to ${outDir}/`)
