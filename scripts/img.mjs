// Converts founder photos into the WebP files /gallery expects, and prints
// the GalleryItem fields for each one so nothing has to be measured by hand.
//
//   node scripts/img.mjs marketing/assets/huaqiangbei
//
// sharp is used as a transitive Next.js dependency rather than a new package.
// If a future npm install ever drops it, `npm i -D sharp` restores this script
// and nothing in the app changes.

import { mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const LONGEST_EDGE = 1600
const MAX_BYTES = 300 * 1024
// Tried in order until one lands under the budget. Starting lower than 82
// wastes quality on photos that would have fit anyway.
const QUALITY_STEPS = [82, 70, 60, 50]
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'])

const sourceDir = process.argv[2]
const outDir = process.argv[3] ?? 'public/gallery'

if (!sourceDir) {
  console.error('usage: node scripts/img.mjs <source-dir> [out-dir]')
  process.exit(1)
}

// The `src` field printed for each item is the out path made relative to
// public/, because that is what the browser requests. An out-dir outside
// public/ would still write the files but print a src that resolves to
// nothing, so refuse it rather than hand back paths that 404 at runtime.
const publicDir = path.resolve('public')
if (!path.resolve(outDir).startsWith(publicDir + path.sep)) {
  console.error(
    `out-dir must live inside public/ (got ${outDir}) — the gallery serves these files over HTTP.`,
  )
  process.exit(1)
}

await mkdir(outDir, { recursive: true })

const entries = (await readdir(sourceDir)).filter((f) =>
  SOURCE_EXT.has(path.extname(f).toLowerCase()),
)

if (entries.length === 0) {
  console.error(`No images found in ${sourceDir}`)
  process.exit(1)
}

for (const file of entries.sort()) {
  const source = path.join(sourceDir, file)
  // Source names follow marketing/assets/README.md:
  //   huaqiangbei-portrait-01-SBC-2026-08-001-consented.jpg
  // Both the `-consented` flag and the consent ID are stripped out of the
  // published filename — the ID is opaque, but there is no reason to put a
  // consent token in a public URL when it belongs in the ledger. The ID is
  // handed back as consentRef so it does not have to be retyped; if the flag
  // is present without one, consentRef is left blank deliberately, and the
  // build will reject the item until a real ledger ID is pasted in.
  const stem = path.basename(file, path.extname(file))
  const consented = stem.endsWith('-consented')
  const flagged = consented ? stem.slice(0, -'-consented'.length) : stem
  const consentId = flagged.match(/-(SBC-\d{4}-\d{2}-\d{3})$/)?.[1] ?? ''
  const id = consentId
    ? flagged.slice(0, -(consentId.length + 1))
    : flagged
  const outPath = path.join(outDir, `${id}.webp`)

  // Never add .withMetadata() here. sharp drops EXIF by default, and .rotate()
  // consumes the orientation tag — that default is what keeps GPS coordinates
  // out of every published photo. Re-enabling it for copyright fields would
  // silently republish the shoot locations too.
  const pipeline = sharp(source)
    .rotate()
    .resize({
      width: LONGEST_EDGE,
      height: LONGEST_EDGE,
      fit: 'inside',
      withoutEnlargement: true,
    })

  let buffer
  let quality
  for (quality of QUALITY_STEPS) {
    buffer = await pipeline.clone().webp({ quality }).toBuffer()
    if (buffer.length <= MAX_BYTES) break
  }

  await writeFile(outPath, buffer)

  // A second, landscape JPEG purely for og:image. The WebP above is the right
  // format for the page and the wrong one for a share card: X and LinkedIn do
  // not reliably render WebP, and these photos are mostly 3:4 portrait, which
  // is outside the aspect range a large-summary card accepts — so a shared link
  // previews cropped or with no image at all. 1200x630 JPEG is what every
  // scraper handles. Cover-cropped from the centre; the crop is acceptable
  // because this file is never shown on the site, only in other people's UIs.
  const ogDir = path.join(outDir, 'og')
  await mkdir(ogDir, { recursive: true })
  const ogBuffer = await sharp(source)
    .rotate()
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer()
  await writeFile(path.join(ogDir, `${id}.jpg`), ogBuffer)

  const { width, height } = await sharp(buffer).metadata()
  const kb = Math.round(buffer.length / 1024)
  const overBudget = buffer.length > MAX_BYTES ? '  ⚠ OVER 300 KB — recrop' : ''

  console.log(`\n${outPath}  ${kb} KB  q${quality}${overBudget}`)
  console.log(
    [
      '  {',
      `    id: '${id}',`,
      "    kind: 'image',",
      `    src: '/${path.relative('public', outPath)}',`,
      `    width: ${width},`,
      `    height: ${height},`,
      "    alt: '',       // describe the shot — required",
      "    title: '',",
      "    location: '',  // LocationId",
      "    themes: [],    // at least one",
      // The source filename is NOT the consent record and must never become
      // one: filenames reach the published page, and a name in a filename is
      // personal data. The `-consented` suffix is only a flag saying "a record
      // exists in the private ledger" — paste that ledger's opaque ID here.
      consented
        ? `    people: 'consented',\n    consentRef: '${consentId}', // ${
            consentId
              ? 'from the filename — confirm it matches a ledger row'
              : 'SBC-YYYY-MM-NNN from the private ledger — see marketing/assets/CONSENT.md'
          }`
        : "    people: 'none',",
      '  },',
    ].join('\n'),
  )
}

console.log(
  `\n${entries.length} image(s) written to ${outDir}. Paste the blocks above into src/content/gallery.ts and fill the empty fields.`,
)
