"use client"

import { useState } from "react"
import { Gavel, Loader2 } from "lucide-react"
import {
  type Article,
  type Ruling,
  type Verdict,
  EXAMPLE_PROMPTS,
} from "@/lib/constitution"
import { OfficialRuling } from "@/components/official-ruling"

export function RulingChamber({
  articles,
  surname,
  onNewRuling,
}: {
  articles: Article[]
  surname: string
  onNewRuling: (ruling: Ruling) => void
}) {
  const [situation, setSituation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Ruling | null>(null)

  async function requestRuling() {
    const text = situation.trim()
    if (!text || loading) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/ruling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situation: text, articles, surname }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "The ruling could not be issued.")
      }

      const data = (await res.json()) as {
        verdict: Verdict
        citationArticle: number
        citationQuote: string
        body: string
        closing: string
      }

      const ruling: Ruling = {
        id: crypto.randomUUID(),
        question: text,
        verdict: data.verdict,
        citation: `Article ${data.citationArticle} — "${data.citationQuote}"`,
        body: data.body,
        closing: data.closing,
        date: new Date().toISOString(),
      }

      setResult(ruling)
      onNewRuling(ruling)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <div className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          The Ruling Chamber
        </div>
        <h2 className="mt-2 font-serif text-3xl font-bold text-balance text-foreground sm:text-4xl">
          Request a Ruling
        </h2>
        <p className="mx-auto mt-3 max-w-xl font-serif text-base italic leading-relaxed text-muted-foreground text-pretty">
          Bring your dispute or decision before the Constitutional Authority. A
          verdict will be issued under Papa&apos;s law.
        </p>
      </div>

      <div className="mt-8 rounded-lg border border-gold/40 bg-card p-5 shadow-lg sm:p-6">
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={4}
          placeholder="Describe the situation..."
          className="w-full resize-none rounded-md border border-input bg-background px-4 py-3 font-serif text-lg leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/30"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setSituation(prompt)}
              className="rounded-full border border-gold/40 bg-secondary/60 px-3 py-1.5 font-sans text-xs font-medium text-secondary-foreground transition-colors hover:border-gold hover:bg-secondary"
            >
              {prompt}
            </button>
          ))}
        </div>

        <button
          onClick={requestRuling}
          disabled={!situation.trim() || loading}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-gold px-6 py-3.5 font-sans text-base font-semibold text-primary-foreground shadow transition-all hover:bg-gold/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              The Authority is deliberating...
            </>
          ) : (
            <>
              <Gavel className="size-5" />
              Request a Ruling
            </>
          )}
        </button>

        {error && (
          <p className="mt-3 text-center font-sans text-sm text-destructive">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="mt-8">
          <OfficialRuling ruling={result} />
        </div>
      )}
    </div>
  )
}
