// One hero photo, cut to the shape the box actually is.
//
// Every hero on the site used to be a single 2000x900 landscape file. Measured
// in a browser, the boxes are nothing like that shape: 390x450..960 on a phone
// (ratio 0.43-0.87) against 1512x468..912 on a desktop (1.7-3.2). object-cover
// resolves the mismatch by scaling until the image covers the box, so on a
// phone it matched the box's height and discarded most of the width — a narrow
// vertical strip magnified two to three times. That was the blur, not the
// pixel count.
//
// Variants come from scripts/hero.mjs and must be regenerated together:
//   -sp      1320x2030  portrait, served below 768px
//   -wide    3400x1600  landscape for retina desktops
//   -widesm  1800x847   same crop, for 1x laptops and tablets
//   -panel   1600x1600  near-square, for the login/signup side panel
//
// `shape="panel"` is a plain <img>: that panel is hidden below lg, so it never
// reaches a phone and needs no portrait cut.

type Props = {
  /** Basename inside /public/hero, with no suffix or extension. */
  name: string
  alt: string
  className?: string
  shape?: 'hero' | 'panel'
}

export function HeroImage({ name, alt, className, shape = 'hero' }: Props) {
  const base = `/hero/${name}`

  if (shape === 'panel') {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`${base}-panel.webp`} alt={alt} className={className} />
  }

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={`${base}-sp.webp`} />
      <img
        src={`${base}-widesm.webp`}
        srcSet={`${base}-widesm.webp 1800w, ${base}-wide.webp 3400w`}
        sizes="100vw"
        alt={alt}
        className={className}
      />
    </picture>
  )
}
