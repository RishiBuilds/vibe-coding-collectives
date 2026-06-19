import { type Ruling, formatDate } from "@/lib/constitution"
import { VerdictBadge, SeverityBadge } from "@/components/verdict-badge"
import { Scale, BookOpen, Quote } from "lucide-react"

export function OfficialRuling({ ruling }: { ruling: Ruling }) {
  return (
    <article className="glass-card rounded-2xl overflow-hidden gold-border-glow animate-fade-in-up">
      {/* Gold accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="text-center">
          <div className="ornament-line mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
              Official Ruling
            </span>
          </div>

          {/* Verdict Stamp */}
          <div className="flex justify-center mt-5">
            <VerdictBadge verdict={ruling.verdict} size="lg" animated />
          </div>

          {/* Severity */}
          {ruling.severity && (
            <div className="flex justify-center mt-3">
              <SeverityBadge severity={ruling.severity} />
            </div>
          )}
        </div>

        {/* Matter */}
        <div className="mt-8 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            On the matter of
          </p>
          <p className="mt-2 font-serif text-lg sm:text-xl font-semibold text-foreground leading-snug">
            &ldquo;{ruling.question}&rdquo;
          </p>
        </div>

        {/* Ruling Body */}
        <div className="mt-8 flex gap-3">
          <Scale className="size-5 text-gold/40 shrink-0 mt-0.5" />
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            {ruling.body}
          </p>
        </div>

        {/* Citation */}
        <div className="mt-6 rounded-xl bg-gold/5 border border-gold/10 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="size-3.5 text-gold/60" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gold/60">
              Cited Authority
            </span>
          </div>
          <p className="font-serif text-sm sm:text-base italic leading-relaxed text-foreground/80">
            {ruling.citation}
          </p>
        </div>

        {/* Precedent Note */}
        {ruling.precedentNote && (
          <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/[0.04] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Quote className="size-3.5 text-muted-foreground/50" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                Precedent
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {ruling.precedentNote}
            </p>
          </div>
        )}

        {/* Closing */}
        <div className="mt-6 pt-5 border-t border-gold/10 text-center">
          <p className="font-serif text-base italic text-foreground/70 leading-relaxed">
            {ruling.closing}
          </p>
        </div>

        {/* Issued by */}
        <p className="mt-6 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
          Issued by the Constitutional Authority · {formatDate(ruling.date)}
        </p>
      </div>
    </article>
  )
}
