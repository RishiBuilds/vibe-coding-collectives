import type { Ruling } from "./constitution"

/**
 * Find rulings with similar keywords to the current situation.
 * This is real app logic — not an AI call — that enables precedent tracking.
 */
export function findPrecedents(
  situation: string,
  rulings: Ruling[],
  maxResults = 3
): Ruling[] {
  if (rulings.length === 0) return []

  const situationWords = extractKeywords(situation)
  if (situationWords.length === 0) return []

  const scored = rulings.map((ruling) => {
    const rulingWords = extractKeywords(ruling.question)
    const overlap = situationWords.filter((w) => rulingWords.includes(w)).length
    const score = overlap / Math.max(situationWords.length, 1)
    return { ruling, score }
  })

  return scored
    .filter((s) => s.score > 0.15) // At least 15% keyword overlap
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((s) => s.ruling)
}

/**
 * Extract meaningful keywords from text, ignoring common stop words.
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "a", "an", "the", "is", "it", "to", "in", "on", "of", "for",
    "and", "or", "but", "not", "my", "we", "i", "me", "our", "can",
    "should", "would", "could", "will", "do", "does", "did", "be",
    "am", "are", "was", "were", "has", "have", "had", "this", "that",
    "with", "from", "at", "by", "as", "if", "so", "ok", "okay",
    "just", "very", "too", "also", "about", "up", "out", "no", "yes",
    "all", "some", "any", "each", "every", "into", "over", "than",
  ])

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
}

/**
 * Format precedents into a context string for the AI prompt.
 */
export function formatPrecedentContext(precedents: Ruling[]): string {
  if (precedents.length === 0) return ""

  const lines = precedents.map(
    (p, i) =>
      `Precedent ${i + 1}: "${p.question}" → Verdict: ${p.verdict}. Ruling: "${p.body}"`
  )

  return `\n\nRELEVANT PRECEDENTS (past rulings on similar matters — be consistent unless you have strong reason to overrule):\n${lines.join("\n")}`
}
