import { type Ruling, formatDate } from "@/lib/constitution"
import { VerdictBadge } from "@/components/verdict-badge"

export function OfficialRuling({ ruling }: { ruling: Ruling }) {
  return (
    <article className="relative overflow-hidden rounded-lg border-2 border-gold/50 bg-card p-6 shadow-xl ring-1 ring-gold/15 sm:p-8">
      <div className="pointer-events-none absolute inset-2.5 rounded border border-gold/25" />

      <div className="relative">
        <div className="text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          Official Ruling
        </div>

        <div className="mt-4 flex justify-center">
          <VerdictBadge verdict={ruling.verdict} />
        </div>

        <p className="mt-6 text-center font-serif text-sm italic text-muted-foreground">
          On the matter of:
        </p>
        <p className="mt-1 text-center font-serif text-lg font-semibold text-balance text-foreground">
          &ldquo;{ruling.question}&rdquo;
        </p>

        <p className="mt-6 font-serif text-lg leading-relaxed text-foreground text-pretty">
          {ruling.body}
        </p>

        <div className="mt-6 rounded-md border-l-4 border-gold bg-gold-soft/70 px-4 py-3">
          <p className="font-sans text-xs font-semibold uppercase tracking-wider text-gold">
            Cited
          </p>
          <p className="mt-1 font-serif text-base italic leading-relaxed text-foreground">
            {ruling.citation}
          </p>
        </div>

        <p className="mt-6 border-t border-gold/20 pt-4 text-center font-serif text-base italic leading-relaxed text-foreground text-pretty">
          {ruling.closing}
        </p>

        <p className="mt-6 text-center font-sans text-xs tracking-wide text-muted-foreground">
          Issued by the Constitutional Authority · {formatDate(ruling.date)}
        </p>
      </div>
    </article>
  )
}
