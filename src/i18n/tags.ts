// Display label for a profile tag — a language, hobby, trait or city. The
// stored value stays the English tag (it is what profiles hold and what the
// /browse filter matches on); only the text on screen is translated, and
// anything outside the known list — free text someone typed on their profile —
// is shown as written. An entry that only restates the key (every English one)
// also keeps the value as written, so English chips keep whatever casing the
// profile used.
//
// `names` is one of the t.browse.*Names maps. Pure and request-free, so it is
// safe on both sides of a client boundary.
export function tagLabel(names: Record<string, string>, value: string): string {
  const key = value.trim().toLowerCase()
  // Own properties only: a profile tag of "constructor" must not resolve to
  // Object's constructor.
  const label = Object.hasOwn(names, key) ? names[key] : undefined
  return label && label.toLowerCase() !== key ? label : value
}
