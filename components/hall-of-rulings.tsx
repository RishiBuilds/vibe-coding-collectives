"use client"

import { useState } from "react"
import {
  Scroll,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Scale,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { type Ruling, type Verdict, formatDate } from "@/lib/constitution"
import { VerdictBadge, SeverityBadge } from "@/components/verdict-badge"
import { cn } from "@/lib/utils"

export function HallOfRulings({
  rulings,
  onClear,
}: {
  rulings: Ruling[]
  onClear: () => void
}) {
  const [search, setSearch] = useState("")
  const [filterVerdict, setFilterVerdict] = useState<Verdict | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  // Stats
  const totalRulings = rulings.length
  const approved = rulings.filter((r) => r.verdict === "APPROVED").length
  const denied = rulings.filter((r) => r.verdict === "DENIED").length
  const conditional = rulings.filter((r) => r.verdict === "CONDITIONAL").length

  // Filter
  const filtered = rulings.filter((r) => {
    const matchesSearch =
      !search ||
      r.question.toLowerCase().includes(search.toLowerCase()) ||
      r.body.toLowerCase().includes(search.toLowerCase())
    const matchesVerdict = !filterVerdict || r.verdict === filterVerdict
    return matchesSearch && matchesVerdict
  })

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="ornament-line mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
            The Archives
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Hall of <span className="gold-shimmer">Rulings</span>
        </h2>
        <p className="mt-3 mx-auto max-w-xl font-serif text-sm sm:text-base italic text-muted-foreground leading-relaxed">
          Every verdict ever issued under Papa&apos;s law, preserved for the
          generations.
        </p>
      </div>

      {rulings.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="size-16 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center">
              <Scroll className="size-8 text-gold/30" />
            </div>
          </div>
          <p className="font-serif text-lg italic text-muted-foreground">
            No rulings have been issued yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground/60">
            Visit the Ruling Chamber to bring your first matter before the
            Authority.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="stat-card text-center animate-fade-in stagger-1">
              <div className="flex justify-center mb-2">
                <Scale className="size-4 text-gold/50" />
              </div>
              <div className="text-2xl font-bold text-foreground font-serif">
                {totalRulings}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mt-0.5">
                Total Rulings
              </div>
            </div>
            <div className="stat-card text-center animate-fade-in stagger-2">
              <div className="flex justify-center mb-2">
                <CheckCircle2 className="size-4 text-emerald-500/50" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-serif">
                {approved}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mt-0.5">
                Approved
              </div>
            </div>
            <div className="stat-card text-center animate-fade-in stagger-3">
              <div className="flex justify-center mb-2">
                <XCircle className="size-4 text-red-500/50" />
              </div>
              <div className="text-2xl font-bold text-red-400 font-serif">
                {denied}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mt-0.5">
                Denied
              </div>
            </div>
            <div className="stat-card text-center animate-fade-in stagger-4">
              <div className="flex justify-center mb-2">
                <AlertTriangle className="size-4 text-amber-500/50" />
              </div>
              <div className="text-2xl font-bold text-amber-400 font-serif">
                {conditional}
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mt-0.5">
                Conditional
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="glass-card rounded-xl p-3 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
              <input
                id="rulings-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rulings..."
                className="w-full rounded-lg input-dark pl-10 pr-4 py-2.5 text-sm outline-none"
              />
            </div>
            <div className="flex gap-1.5">
              {(["APPROVED", "DENIED", "CONDITIONAL"] as Verdict[]).map(
                (v) => (
                  <button
                    key={v}
                    onClick={() =>
                      setFilterVerdict(filterVerdict === v ? null : v)
                    }
                    className={cn(
                      "rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-all",
                      filterVerdict === v
                        ? v === "APPROVED"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : v === "DENIED"
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "text-muted-foreground/50 border border-transparent hover:border-white/10 hover:text-muted-foreground",
                    )}
                  >
                    {v}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Results count */}
          {(search || filterVerdict) && (
            <p className="text-xs text-muted-foreground/40 mb-4 animate-fade-in">
              Showing {filtered.length} of {totalRulings} ruling
              {totalRulings !== 1 ? "s" : ""}
            </p>
          )}

          {/* Rulings List */}
          <div className="flex flex-col gap-3">
            {filtered.map((ruling, index) => {
              const isExpanded = expandedId === ruling.id

              return (
                <div
                  key={ruling.id}
                  className={cn(
                    "glass-card rounded-xl overflow-hidden transition-all duration-300 animate-fade-in cursor-pointer",
                    isExpanded && "ring-1 ring-gold/20",
                  )}
                  style={{ animationDelay: `${index * 0.04}s` }}
                  onClick={() =>
                    setExpandedId(isExpanded ? null : ruling.id)
                  }
                >
                  {/* Collapsed View */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base sm:text-lg font-semibold text-foreground/90 leading-snug truncate">
                          &ldquo;{ruling.question}&rdquo;
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-medium text-muted-foreground/40">
                            {formatDate(ruling.date)}
                          </span>
                          {ruling.severity && (
                            <SeverityBadge severity={ruling.severity} />
                          )}
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        <VerdictBadge verdict={ruling.verdict} size="sm" />
                        {isExpanded ? (
                          <ChevronUp className="size-4 text-muted-foreground/40" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground/40" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-white/[0.04] animate-fade-in">
                      <div className="pt-4 space-y-4">
                        <p className="font-serif text-sm leading-relaxed text-foreground/80">
                          {ruling.body}
                        </p>

                        <div className="rounded-lg bg-gold/5 border border-gold/10 p-3">
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-gold/50">
                            Citation
                          </span>
                          <p className="mt-1 font-serif text-xs italic text-foreground/70">
                            {ruling.citation}
                          </p>
                        </div>

                        {ruling.precedentNote && (
                          <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                            <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                              Precedent Note
                            </span>
                            <p className="mt-1 text-xs text-muted-foreground/70">
                              {ruling.precedentNote}
                            </p>
                          </div>
                        )}

                        <p className="font-serif text-xs italic text-muted-foreground/60 text-center pt-2">
                          &ldquo;{ruling.closing}&rdquo;
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Clear Button */}
          <div className="mt-8 flex justify-center">
            {showConfirmClear ? (
              <div className="flex items-center gap-3 animate-fade-in-scale">
                <span className="text-sm text-muted-foreground">
                  Clear all rulings?
                </span>
                <button
                  onClick={() => {
                    onClear()
                    setShowConfirmClear(false)
                  }}
                  className="rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/25 transition-all"
                >
                  Yes, clear all
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-2 rounded-lg border border-red-500/20 px-4 py-2.5 text-xs font-medium text-red-400/60 transition-all hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5"
              >
                <Trash2 className="size-3.5" />
                Clear all rulings
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
