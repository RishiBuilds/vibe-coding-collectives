"use client"

import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Scale,
  Award,
  Flame,
} from "lucide-react"
import type { Article, Ruling, Verdict } from "@/lib/constitution"
import { calculateInsights, getVerdictDistribution } from "@/lib/analytics"
import { VerdictBadge } from "@/components/verdict-badge"
import { cn } from "@/lib/utils"

const VERDICT_COLORS: Record<Verdict, string> = {
  APPROVED: "#22c55e",
  DENIED: "#ef4444",
  CONDITIONAL: "#f59e0b",
}

export function InsightsDashboard({
  rulings,
  articles,
}: {
  rulings: Ruling[]
  articles: Article[]
}) {
  const insights = calculateInsights(rulings, articles)
  const distribution = getVerdictDistribution(rulings)

  if (rulings.length === 0) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="ornament-line mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
              Constitutional Analytics
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            <span className="gold-shimmer">Insights</span>
          </h2>
        </div>

        <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="size-16 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center">
              <BarChart3 className="size-8 text-gold/30" />
            </div>
          </div>
          <p className="font-serif text-lg italic text-muted-foreground">
            No data yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground/60">
            Request rulings to see constitutional analytics and patterns emerge.
          </p>
        </div>
      </div>
    )
  }

  // Donut chart calculations
  const donutRadius = 70
  const donutStroke = 14
  const donutCircumference = 2 * Math.PI * donutRadius
  let donutOffset = 0

  // Top cited articles (sorted)
  const sortedArticleCitations = Object.entries(insights.articleCitations)
    .map(([num, count]) => ({
      number: parseInt(num, 10),
      count,
      article: articles.find((a) => a.number === parseInt(num, 10)),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const maxCitations = sortedArticleCitations[0]?.count ?? 1

  // Recent verdict timeline (last 12)
  const recentRulings = rulings.slice(0, 12)

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="ornament-line mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
            Constitutional Analytics
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          <span className="gold-shimmer">Insights</span>
        </h2>
        <p className="mt-3 mx-auto max-w-xl font-serif text-sm sm:text-base italic text-muted-foreground leading-relaxed">
          Patterns and precedents emerging from Papa&apos;s constitutional
          authority.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card animate-fade-in stagger-1">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="size-4 text-gold/50" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Total Rulings
            </span>
          </div>
          <div className="text-3xl font-bold text-foreground font-serif animate-count-up">
            {insights.totalRulings}
          </div>
        </div>

        <div className="stat-card animate-fade-in stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-4 text-emerald-500/50" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Approval Rate
            </span>
          </div>
          <div className="text-3xl font-bold text-emerald-400 font-serif animate-count-up">
            {insights.approvalRate}%
          </div>
        </div>

        <div className="stat-card animate-fade-in stagger-3">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="size-4 text-amber-500/50" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Current Streak
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-serif animate-count-up">
              {insights.verdictStreak.count}
            </span>
            <span
              className={cn(
                "text-xs font-semibold uppercase",
                insights.verdictStreak.verdict === "APPROVED" && "text-emerald-400/70",
                insights.verdictStreak.verdict === "DENIED" && "text-red-400/70",
                insights.verdictStreak.verdict === "CONDITIONAL" && "text-amber-400/70",
              )}
            >
              {insights.verdictStreak.verdict}
            </span>
          </div>
        </div>

        <div className="stat-card animate-fade-in stagger-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="size-4 text-gold/50" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Most Cited
            </span>
          </div>
          {insights.mostCitedArticle ? (
            <div>
              <span className="text-3xl font-bold text-gold font-serif animate-count-up">
                Art. {insights.mostCitedArticle.number}
              </span>
              <p className="text-[10px] text-muted-foreground/40 mt-1 truncate">
                {insights.mostCitedArticle.count}× cited
              </p>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground/40">—</span>
          )}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Donut Chart */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-6 flex items-center gap-2">
            <BarChart3 className="size-3.5" />
            Verdict Distribution
          </h3>

          <div className="flex items-center justify-center gap-8">
            {/* SVG Donut */}
            <div className="relative">
              <svg
                width="170"
                height="170"
                viewBox="0 0 170 170"
                className="transform -rotate-90"
              >
                {/* Background circle */}
                <circle
                  cx="85"
                  cy="85"
                  r={donutRadius}
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth={donutStroke}
                />

                {/* Data segments */}
                {distribution.map((d) => {
                  const segmentLength =
                    (d.percentage / 100) * donutCircumference
                  const gap = 4
                  const currentOffset = donutOffset
                  donutOffset += segmentLength + gap

                  return (
                    <circle
                      key={d.verdict}
                      cx="85"
                      cy="85"
                      r={donutRadius}
                      fill="none"
                      stroke={VERDICT_COLORS[d.verdict]}
                      strokeWidth={donutStroke}
                      strokeDasharray={`${segmentLength} ${donutCircumference}`}
                      strokeDashoffset={-currentOffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                      style={{ opacity: 0.8 }}
                    />
                  )
                })}
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-foreground font-serif">
                  {insights.totalRulings}
                </span>
                <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/40">
                  Rulings
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3">
              {distribution.map((d) => (
                <div key={d.verdict} className="flex items-center gap-2.5">
                  <div
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: VERDICT_COLORS[d.verdict] }}
                  />
                  <div>
                    <div className="text-xs font-medium text-foreground/80">
                      {d.verdict}
                    </div>
                    <div className="text-[10px] text-muted-foreground/40">
                      {d.count} ({d.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Cited Articles Bar Chart */}
        <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-6 flex items-center gap-2">
            <BookOpen className="size-3.5" />
            Most Cited Articles
          </h3>

          {sortedArticleCitations.length === 0 ? (
            <p className="text-sm text-muted-foreground/40 italic">
              No citation data yet.
            </p>
          ) : (
            <div className="space-y-4">
              {sortedArticleCitations.map((item, index) => (
                <div key={item.number} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground/70">
                      Art. {item.number}
                      {item.article && (
                        <span className="text-muted-foreground/30 ml-2">
                          · {item.article.category}
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-bold text-gold/70">
                      {item.count}×
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold/30 transition-all duration-1000"
                      style={{
                        width: `${(item.count / maxCitations) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Verdict Timeline */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in stagger-7">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-6 flex items-center gap-2">
          <TrendingUp className="size-3.5" />
          Recent Verdict Timeline
        </h3>

        <div className="flex items-end gap-2 justify-center">
          {[...recentRulings].reverse().map((ruling, index) => (
            <div
              key={ruling.id}
              className="flex flex-col items-center gap-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={cn(
                  "w-8 sm:w-10 rounded-t-md transition-all",
                  ruling.verdict === "APPROVED" && "bg-emerald-500/40",
                  ruling.verdict === "DENIED" && "bg-red-500/40",
                  ruling.verdict === "CONDITIONAL" && "bg-amber-500/40",
                )}
                style={{
                  height: `${ruling.verdict === "APPROVED" ? 48 : ruling.verdict === "DENIED" ? 32 : 40}px`,
                }}
                title={`"${ruling.question}" — ${ruling.verdict}`}
              />
              <div
                className={cn(
                  "size-2 rounded-full",
                  ruling.verdict === "APPROVED" && "bg-emerald-400",
                  ruling.verdict === "DENIED" && "bg-red-400",
                  ruling.verdict === "CONDITIONAL" && "bg-amber-400",
                )}
              />
            </div>
          ))}
        </div>

        {recentRulings.length > 0 && (
          <div className="flex justify-between mt-3 px-1">
            <span className="text-[9px] text-muted-foreground/30">
              Oldest
            </span>
            <span className="text-[9px] text-muted-foreground/30">
              Most Recent
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
