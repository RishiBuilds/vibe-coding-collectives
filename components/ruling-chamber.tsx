"use client"

import { useState } from "react"
import { Scale, Loader2, Mic, MicOff, Sparkles } from "lucide-react"
import {
  type Article,
  type Ruling,
  type Verdict,
  type Severity,
  EXAMPLE_PROMPTS,
} from "@/lib/constitution"
import { findPrecedents } from "@/lib/precedent"
import { OfficialRuling } from "@/components/official-ruling"
import { cn } from "@/lib/utils"

export function RulingChamber({
  articles,
  surname,
  rulings,
  onNewRuling,
}: {
  articles: Article[]
  surname: string
  rulings: Ruling[]
  onNewRuling: (ruling: Ruling) => void
}) {
  const [situation, setSituation] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Ruling | null>(null)
  const [isListening, setIsListening] = useState(false)

  // Voice input
  function toggleVoice() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setError("Voice input is not supported in this browser.")
      return
    }

    if (isListening) {
      setIsListening(false)
      return
    }

    const SpeechRecognition =
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition ||
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition

    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setSituation((prev) => (prev ? prev + " " + transcript : transcript))
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    setIsListening(true)
    recognition.start()
  }

  async function requestRuling() {
    const text = situation.trim()
    if (!text || loading) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Find precedents (real app logic, not AI)
      const precedents = findPrecedents(text, rulings)

      const res = await fetch("/api/ruling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation: text,
          articles,
          surname,
          precedents,
        }),
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
        severity: Severity
        precedentNote: string
      }

      const ruling: Ruling = {
        id: crypto.randomUUID(),
        question: text,
        verdict: data.verdict,
        citation: `Article ${data.citationArticle} — "${data.citationQuote}"`,
        body: data.body,
        closing: data.closing,
        date: new Date().toISOString(),
        severity: data.severity,
        precedentNote: data.precedentNote,
        citedArticleNumber: data.citationArticle,
      }

      setResult(ruling)
      onNewRuling(ruling)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  // Find matching articles as user types
  const matchingArticles = situation.trim().length > 5
    ? articles.filter((a) => {
        const words = situation.toLowerCase().split(/\s+/)
        const ruleWords = a.rule.toLowerCase()
        const catWords = a.category.toLowerCase()
        return words.some(
          (w) => w.length > 3 && (ruleWords.includes(w) || catWords.includes(w))
        )
      }).slice(0, 3)
    : []

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="ornament-line mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
            The Ruling Chamber
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          Request a <span className="gold-shimmer">Ruling</span>
        </h2>
        <p className="mt-3 mx-auto max-w-xl font-serif text-sm sm:text-base italic text-muted-foreground leading-relaxed">
          Bring your dispute or decision before the Constitutional Authority.
          A precedent-aware verdict will be issued under Papa&apos;s law.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass-card rounded-2xl p-5 sm:p-6">
        {/* Textarea with voice input */}
        <div className="relative">
          <textarea
            id="ruling-input"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={4}
            placeholder="Describe the situation or dispute..."
            className="w-full resize-none rounded-xl input-dark px-5 py-4 pr-14 font-serif text-base sm:text-lg leading-relaxed outline-none"
          />
          <button
            onClick={toggleVoice}
            type="button"
            className={cn(
              "absolute right-3 top-3 rounded-lg p-2.5 transition-all",
              isListening
                ? "bg-red-500/20 text-red-400 animate-pulse"
                : "text-muted-foreground/40 hover:text-gold hover:bg-gold/10",
            )}
            aria-label={isListening ? "Stop listening" : "Voice input"}
          >
            {isListening ? (
              <MicOff className="size-4" />
            ) : (
              <Mic className="size-4" />
            )}
          </button>
        </div>

        {/* Matching Articles Preview */}
        {matchingArticles.length > 0 && !loading && (
          <div className="mt-3 animate-fade-in">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-2">
              Potentially relevant articles
            </p>
            <div className="flex flex-wrap gap-1.5">
              {matchingArticles.map((a) => (
                <span
                  key={a.id}
                  className="rounded-full bg-gold/8 border border-gold/10 px-2.5 py-0.5 text-[10px] font-medium text-gold/60"
                >
                  Art. {a.number} · {a.category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Example Prompts */}
        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setSituation(prompt)}
              className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium text-muted-foreground/70 transition-all hover:border-gold/20 hover:text-gold/80 hover:bg-gold/5"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={requestRuling}
          disabled={!situation.trim() || loading}
          className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl btn-gold px-6 py-4 text-base font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              The Authority is deliberating...
            </>
          ) : (
            <>
              <Scale className="size-5" />
              Request a Ruling
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-center animate-fade-in">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Deliberation Animation */}
      {loading && (
        <div className="mt-8 flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="size-20 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center animate-deliberate">
              <Scale className="size-10 text-gold/60" />
            </div>
            <div className="absolute -inset-3 rounded-full border border-gold/10 animate-spin-slow" />
            <div className="absolute -inset-6 rounded-full border border-gold/5 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "12s" }} />
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-gold/40 animate-glow-pulse" />
            <p className="font-serif text-sm italic text-muted-foreground">
              Reviewing constitutional articles and precedents...
            </p>
            <Sparkles className="size-3.5 text-gold/40 animate-glow-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8">
          <OfficialRuling ruling={result} />
        </div>
      )}
    </div>
  )
}
