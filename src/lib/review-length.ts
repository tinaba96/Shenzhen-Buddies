// Length rule for a written tour review, shared by the post-tour page
// (/guide/review/[id]) and the open review page (/review).

export const MIN_REVIEW_WORDS = 5
export const MAX_REVIEW_WORDS = 50
// Chinese and Japanese are written without spaces, so splitting on whitespace
// counts a whole sentence as one word and rejects every review. Text in those
// scripts is measured in characters instead, with limits sized to say about
// as much as 5–50 English words. The pages' hint (t.review.wordsHint) quotes
// these numbers.
export const MIN_REVIEW_CHARS = 10
export const MAX_REVIEW_CHARS = 100
// ー (the katakana long-vowel mark) is script Common, so it is named outright.
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]/u
const CJK_ALL = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー]/gu

// Each CJK character counts once; any run of other text between spaces counts
// as one word, so a Latin brand name inside a Chinese sentence is one unit.
export function reviewLength(text: string): { unit: 'words' | 'chars'; n: number } {
  if (!CJK.test(text)) {
    return { unit: 'words', n: text.split(/\s+/).filter(Boolean).length }
  }
  const chars = text.match(CJK_ALL)?.length ?? 0
  const rest = text
    .replace(CJK_ALL, ' ')
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length
  return { unit: 'chars', n: chars + rest }
}

// null when the text fits; otherwise what the error message needs.
export function reviewLengthProblem(
  text: string,
): { unit: 'words' | 'chars'; min: number; max: number; n: number } | null {
  const { unit, n } = reviewLength(text)
  const [min, max] =
    unit === 'words'
      ? [MIN_REVIEW_WORDS, MAX_REVIEW_WORDS]
      : [MIN_REVIEW_CHARS, MAX_REVIEW_CHARS]
  return n < min || n > max ? { unit, min, max, n } : null
}
