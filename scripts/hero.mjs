// Cuts one photo into the three shapes a hero box actually takes, because a
// single landscape file cannot serve all of them. Measured with a browser:
//
//   phone   390x450..960   ratio 0.43-0.87   -> portrait
//   desktop 1512x468..912  ratio 1.7-3.2     -> landscape
//   panel   708x727        ratio 0.97        -> square (login/signup side)
//
// Feeding the landscape file to a phone makes object-cover match the box's
// height, which throws away most of the width and magnifies what is left.
// That is what made every hero look soft on mobile — shape, not pixel count.
//
//   node scripts/hero.mjs marketing/assets/shenzhen/skyline-blue-towers-night.jpg
//   node scripts/hero.mjs <src> --sp-anchor=0.35 --wide-anchor=0.5 --no-panel
//
// Anchors are the vertical centre of the crop as a fraction of the source
// height (0 = top, 1 = bottom); horizontal is always centred. Output goes to
// public/hero/<stem>-{wide,sp,panel}.webp.
//
// Quality is chosen per file by walking down until it fits the byte budget,
// rather than fixed, because a night skyline and a lit food stall compress
// nothing alike. The phone budget is the tighter one on purpose: it is the
// LCP image on mobile data, where most of our traffic lands.

import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

// Sizes are set by the widest box each shape has to cover, measured in a
// browser, times the device pixel ratio — not by eye. Oversizing costs mobile
// data on the LCP image for pixels no screen can show.
const VARIANTS = {
  wide:  { w: 3400, h: 1600, budget: 300 }, // 1512 CSS @2x = 3024 wide; tallest PC box needs 1390
  // Same crop as `wide`, for laptops at 1x and the tablet range. Both live in
  // one srcset, so they must share a shape — mixing in the old 2000x900 file
  // would shift the framing as the window resized.
  widesm:{ w: 1800, h:  847, budget: 120 },
  sp:    { w: 1320, h: 2030, budget: 150 }, // 430 CSS @3x = 1290 wide; tallest phone box needs 1809
  // The login/signup side panel is hidden below lg, so this file never reaches
  // a phone. Its budget is loose on purpose — no mobile data rides on it.
  panel: { w: 1600, h: 1600, budget: 320 },
}
// Floor, not just a range: a dense frame (the night-market stall has detail in
// every pixel and no flat areas) will happily keep shrinking past the point it
// looks acceptable. Better to exceed the budget and say so than to ship mush.
const QUALITY_STEPS = [82, 76, 70, 64, 58]

const [src, ...flags] = process.argv.slice(2)
if (!src) {
  console.error('usage: node scripts/hero.mjs <source-image> [--sp-anchor=N] [--wide-anchor=N] [--panel-anchor=N] [--only=a,b]')
  process.exit(1)
}
const flag = (k, d) => {
  const f = flags.find((x) => x.startsWith(`--${k}=`))
  return f ? f.slice(k.length + 3) : d
}
const only = flag('only', '').split(',').filter(Boolean)
const stem = path.basename(src, path.extname(src))

const meta = await sharp(src).metadata()
// .rotate() applies the EXIF orientation tag, and for tags 5-8 that swaps the
// axes — skyline-blue-towers-night.jpg is tag 6, i.e. a portrait frame stored
// as 5632x4224. Crop maths must run on the post-rotation shape or extract()
// walks off the edge of the image.
const rotated = meta.orientation >= 5 && meta.orientation <= 8
const srcW = rotated ? meta.height : meta.width
const srcH = rotated ? meta.width : meta.height
console.log(`${stem}: source ${meta.width}x${meta.height}` +
  (rotated ? ` -> ${srcW}x${srcH} after EXIF orientation ${meta.orientation}` : ''))

for (const [name, v] of Object.entries(VARIANTS)) {
  if (only.length && !only.includes(name)) continue
  if (flags.includes(`--no-${name}`)) continue

  const anchor = Number(flag(`${name}-anchor`, 0.5))
  const target = v.w / v.h

  // Largest rectangle of the target shape that fits inside the source.
  let cw = srcW
  let ch = Math.round(cw / target)
  if (ch > srcH) { ch = srcH; cw = Math.round(ch * target) }

  const left = Math.round((srcW - cw) / 2)
  // anchor is where the crop's centre sits; clamp so it stays in frame
  const top = Math.max(0, Math.min(srcH - ch, Math.round(srcH * anchor - ch / 2)))

  // Never upscale. night-market-skewers-stall.jpg is 3072 wide, so a 3400px
  // wide variant would invent 10% of its pixels and cost bytes for the
  // privilege. Cap the output at what the crop actually holds.
  const outW = Math.min(v.w, cw)
  const outH = Math.round(outW / target)
  if (outW < v.w) console.log(`  ${name.padEnd(5)} capped to ${outW}x${outH} — source has only ${cw}px across this crop`)

  let out = null, used = null
  for (const q of QUALITY_STEPS) {
    const buf = await sharp(src).rotate()
      .extract({ left, top, width: cw, height: ch })
      .resize(outW, outH)
      // No .withMetadata(): sharp drops EXIF by default and .rotate() consumes
      // the orientation tag. That default is what keeps GPS out of published
      // photos — see the same note in scripts/img.mjs.
      .webp({ quality: q }).toBuffer()
    out = buf; used = q
    if (buf.length <= v.budget * 1024) break
  }

  const dest = `public/hero/${stem}-${name}.webp`
  await writeFile(dest, out)
  const kb = Math.round(out.length / 1024)
  const over = kb > v.budget ? `  OVER BUDGET (${v.budget}kB) at the q${QUALITY_STEPS.at(-1)} floor` : ''
  console.log(`  ${name.padEnd(5)} ${outW}x${outH}  crop ${cw}x${ch}+${left}+${top}  q${used}  ${kb}kB${over}`)
}
