# APEC 2026 post — syndication copy

The same post as `src/content/posts/apec-2026-shenzhen.ts`, as plain Markdown for
pasting into Medium (or Substack, note, LinkedIn articles). Images are in `images/`,
exported as JPEG from the site's WebP files.

How to post it:

1. Paste `apec-2026-shenzhen.md` into a new Medium story. Upload the three images from
   `images/` where the `![...]` lines are. The alt text is in the brackets; the italic
   line under an image is its caption. The third image is the advertising banner at
   the end (shared with the Shenzhen Bay post).
2. **Set the canonical URL** to `https://www.shenzhen-buddies.com/blog/apec-2026-shenzhen`
   (Medium: Story settings → Advanced settings → canonical link), so search engines
   credit the site, not Medium.
3. Links carry `utm_source=syndication&utm_medium=blog&utm_campaign=apec-2026-shenzhen`.
   Change `utm_source` to the platform name (`medium`, `substack`, `note`) before posting.
4. **The WhatsApp number is not in this file.** This repo is public, and the number lives
   only in the `WHATSAPP_NUMBER` env var. The contact block at the end has the
   placeholder `[WhatsApp number]`; replace it when pasting. The one-liner that does
   both substitutions and copies the result to the clipboard:

   ```sh
   sed -e 's/utm_source=syndication/utm_source=medium/g' \
       -e "s/\[WhatsApp number\]/$(grep '^WHATSAPP_NUMBER=' .env.local | cut -d= -f2-)/" \
       marketing/output/apec-2026-shenzhen-blog/apec-2026-shenzhen.md | pbcopy
   ```

5. This post decays fast. Every rule in it is dated "as of 3 November 2026" and the site
   post carries `lastChecked: '2026-11'`. When the police publish the road closures for
   18–19 November, update the site post first, then this copy, then edit the Medium story
   (Medium keeps the canonical link on edit).

Translations (Japanese, Simplified and Traditional Chinese) live on the site at
`/ja/blog/…`, `/zh-Hans/blog/…` and `/zh-Hant/blog/…`.

## Photo credits

Two photos are not ours and are used under their Creative Commons licences. Keep
the italic "Photo:" line under each one when pasting; the credit, the licence
link and the "resized" note are what the licence asks for.

- `01-shenzhen-international-exchange-center.jpg`: Lhzss8, CC BY-SA 4.0, via
  Wikimedia Commons (file page linked in the Markdown).
- `02-apec-2014-beijing-leaders.jpg`: Kremlin.ru, CC BY 4.0, via Wikimedia Commons.
- `03` and `04` are the founders' own photos. Neither appears in any other post.
