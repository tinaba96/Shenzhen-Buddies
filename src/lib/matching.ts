export type ProfileForMatching = {
  role: 'guide' | 'tourist'
  city: string
  hobbies: string[]
  languages: string[]
  personality_traits: string[]
}

export type MatchScore = {
  total: number
  sharedHobbies: string[]
  sharedLanguages: string[]
  sharedTraits: string[]
  sameCity: boolean
  complementaryRole: boolean
}

const LANGUAGE_WEIGHT = 3
const HOBBY_WEIGHT = 2
const TRAIT_WEIGHT = 1
const SAME_CITY_BONUS = 5
const COMPLEMENTARY_ROLE_BONUS = 3

function overlap(a: string[] | null | undefined, b: string[] | null | undefined): string[] {
  if (!a || !b) return []
  const norm = (s: string) => s.trim().toLowerCase()
  const setB = new Set(b.map(norm))
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of a) {
    const key = norm(item)
    if (setB.has(key) && !seen.has(key)) {
      seen.add(key)
      out.push(item)
    }
  }
  return out
}

export function scoreMatch(
  me: ProfileForMatching | null,
  other: ProfileForMatching,
): MatchScore {
  if (!me) {
    return {
      total: 0,
      sharedHobbies: [],
      sharedLanguages: [],
      sharedTraits: [],
      sameCity: false,
      complementaryRole: false,
    }
  }
  const sharedLanguages = overlap(me.languages, other.languages)
  const sharedHobbies = overlap(me.hobbies, other.hobbies)
  const sharedTraits = overlap(me.personality_traits, other.personality_traits)
  const sameCity =
    !!me.city &&
    !!other.city &&
    me.city.trim().toLowerCase() === other.city.trim().toLowerCase()
  const complementaryRole = me.role !== other.role

  const total =
    sharedLanguages.length * LANGUAGE_WEIGHT +
    sharedHobbies.length * HOBBY_WEIGHT +
    sharedTraits.length * TRAIT_WEIGHT +
    (sameCity ? SAME_CITY_BONUS : 0) +
    (complementaryRole ? COMPLEMENTARY_ROLE_BONUS : 0)

  return {
    total,
    sharedHobbies,
    sharedLanguages,
    sharedTraits,
    sameCity,
    complementaryRole,
  }
}
