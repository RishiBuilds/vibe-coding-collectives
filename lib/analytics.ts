import type { Article, Ruling, Verdict, ConstitutionalInsights } from "./constitution"

/**
 * Calculate constitutional insights from ruling history.
 * Pure logic — no AI involved.
 */
export function calculateInsights(
  rulings: Ruling[],
  articles: Article[]
): ConstitutionalInsights {
  const total = rulings.length

  if (total === 0) {
    return {
      totalRulings: 0,
      approvalRate: 0,
      denialRate: 0,
      conditionalRate: 0,
      mostCitedArticle: null,
      verdictStreak: { verdict: "APPROVED", count: 0 },
      categoryBreakdown: {},
      articleCitations: {},
    }
  }

  // Verdict counts
  const verdictCounts: Record<Verdict, number> = {
    APPROVED: 0,
    DENIED: 0,
    CONDITIONAL: 0,
  }
  for (const r of rulings) {
    verdictCounts[r.verdict]++
  }

  // Article citation tracking
  const articleCitations: Record<number, number> = {}
  for (const r of rulings) {
    if (r.citedArticleNumber) {
      articleCitations[r.citedArticleNumber] =
        (articleCitations[r.citedArticleNumber] || 0) + 1
    } else {
      // Parse from citation string: "Article 3 — ..."
      const match = r.citation.match(/Article\s+(\d+)/)
      if (match) {
        const num = parseInt(match[1], 10)
        articleCitations[num] = (articleCitations[num] || 0) + 1
      }
    }
  }

  // Most cited article
  let mostCitedArticle: ConstitutionalInsights["mostCitedArticle"] = null
  let maxCitations = 0
  for (const [numStr, count] of Object.entries(articleCitations)) {
    if (count > maxCitations) {
      maxCitations = count
      const num = parseInt(numStr, 10)
      const article = articles.find((a) => a.number === num)
      mostCitedArticle = {
        number: num,
        rule: article?.rule ?? "Unknown article",
        count,
      }
    }
  }

  // Verdict streak (most recent)
  let streakVerdict = rulings[0]?.verdict ?? "APPROVED"
  let streakCount = 0
  for (const r of rulings) {
    if (r.verdict === streakVerdict) {
      streakCount++
    } else {
      break
    }
  }

  // Category breakdown from cited articles
  const categoryBreakdown: Record<string, number> = {}
  for (const [numStr, count] of Object.entries(articleCitations)) {
    const num = parseInt(numStr, 10)
    const article = articles.find((a) => a.number === num)
    if (article) {
      categoryBreakdown[article.category] =
        (categoryBreakdown[article.category] || 0) + count
    }
  }

  return {
    totalRulings: total,
    approvalRate: Math.round((verdictCounts.APPROVED / total) * 100),
    denialRate: Math.round((verdictCounts.DENIED / total) * 100),
    conditionalRate: Math.round((verdictCounts.CONDITIONAL / total) * 100),
    mostCitedArticle,
    verdictStreak: { verdict: streakVerdict, count: streakCount },
    categoryBreakdown,
    articleCitations,
  }
}

/**
 * Get verdict distribution for charts.
 */
export function getVerdictDistribution(
  rulings: Ruling[]
): { verdict: Verdict; count: number; percentage: number }[] {
  const total = rulings.length
  if (total === 0) return []

  const counts: Record<Verdict, number> = { APPROVED: 0, DENIED: 0, CONDITIONAL: 0 }
  for (const r of rulings) counts[r.verdict]++

  return (["APPROVED", "DENIED", "CONDITIONAL"] as Verdict[]).map((verdict) => ({
    verdict,
    count: counts[verdict],
    percentage: Math.round((counts[verdict] / total) * 100),
  }))
}
