"use client"

import { Scroll, Trash2 } from "lucide-react"
import { type Ruling, formatDate } from "@/lib/constitution"
import { VerdictBadge } from "@/components/verdict-badge"

export function HallOfRulings({
  rulings,
  onClear,
}: {
  rulings: Ruling[]
  onClear: () => void
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <div className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          The Archives
        </div>
        <h2 className="mt-2 font-serif text-3xl font-bold text-balance text-foreground sm:text-4xl">
          Hall of Rulings
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-serif text-base italic leading-relaxed text-muted-foreground text-pretty">
          Every verdict ever issued under Papa&apos;s law, preserved for the
          generations.
        </p>
      </div>

      {rulings.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-lg border border-dashed border-gold/40 bg-card/60 py-16 text-center">
          <Scroll className="size-8 text-gold/60" />
          <p className="font-serif text-lg italic text-muted-foreground">
            No rulings have been issued yet.
          </p>
          <p className="font-sans text-sm text-muted-foreground/80">
            Visit the Ruling Chamber to bring your first matter before the
            Authority.
          </p>
        </div>
      ) : (
        <>
          <ol className="mt-8 flex flex-col gap-4">
            {rulings.map((ruling) => (
              <li
                key={ruling.id}
                className="rounded-lg border border-gold/30 bg-card p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-serif text-lg font-semibold leading-snug text-foreground text-pretty">
                    &ldquo;{ruling.question}&rdquo;
                  </p>
                  <div className="shrink-0">
                    <VerdictBadge verdict={ruling.verdict} size="sm" />
                  </div>
                </div>
                <p className="mt-3 font-serif text-sm italic leading-relaxed text-muted-foreground">
                  {ruling.citation}
                </p>
                <p className="mt-3 font-sans text-xs tracking-wide text-muted-foreground/80">
                  {formatDate(ruling.date)}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClear}
              className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-2 font-sans text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <Trash2 className="size-4" />
              Clear all rulings
            </button>
          </div>
        </>
      )}
    </div>
  )
}
