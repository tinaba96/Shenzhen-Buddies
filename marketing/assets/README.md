# marketing/assets/ — Real Media Intake

Founder-provided photos and video live here. **The studio always checks this folder before designing** — real media beats placeholders, placeholders beat fabrication.

## How to add media (founder)

1. Drop files into a topic folder: `marketing/assets/<topic>/` (e.g. `huaqiangbei/`, `night-market/`, `guides/`, `skyline/`).
2. Use descriptive filenames: `huaqiangbei-aisle-night-01.jpg`, not `IMG_4821.jpg`. What's in the shot should be guessable from the name.
3. **Consent flag (required for people)**: any file showing an identifiable person must end in `-consented` before the extension — and must carry its consent ID, not a name: `huaqiangbei-portrait-01-SBC-2026-08-001-consented.jpg`. Files without the flag are treated as **background-only** — the studio will not feature the person. **The flag is a pointer, not the record.** The record lives in the private consent ledger; see `CONSENT.md` in this folder before you shoot anyone.
4. **Never put a person's name, WeChat ID, or phone number in a filename.** This folder sits in a public-ish repo, and `consentRef` is served to the browser in page source.
5. Prefer high resolution originals; the studio downsizes for embedding.

## How the studio uses this folder

- `art-director` embeds real shots as optimized base64 data URIs in post designs (each kept well under ~500KB).
- `motion-designer` references clips/stills by filename in storyboards and embeds key frames in previews.
- If nothing here fits the brief, the studio ships a placeholder frame + an exact **shoot note** telling the founder what to capture — that shot then comes back into this folder and upgrades the asset from blueprint to finished.

## Rules (from `marketing/brand-brief.md` §7)

- People appear only with consent. No exceptions, no "it's probably fine." **Consent means a logged record, not a remembered nod — `CONSENT.md`.**
- **Nobody who might be under 18, ever.** Not with a parent present, not in the background of a shot you like.
- No fabricated people, no misleading composites.
- Location/food shots should be real and recent — credibility is the product.
