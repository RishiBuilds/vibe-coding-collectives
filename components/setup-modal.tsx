"use client"

import { useState } from "react"

export function SetupModal({ onComplete }: { onComplete: (surname: string) => void }) {
  const [value, setValue] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onComplete(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border-2 border-gold/60 bg-card p-8 shadow-2xl ring-1 ring-gold/20">
        <div className="mb-2 text-center font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          By Order of Papa
        </div>
        <h2 className="text-center font-serif text-3xl font-bold text-balance text-foreground">
          Establish Your Constitution
        </h2>
        <p className="mt-3 text-center font-serif text-base italic leading-relaxed text-muted-foreground text-pretty">
          Every family is governed by Papa&apos;s unwritten rules. Enter your
          family surname to make them official.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label
            htmlFor="surname"
            className="mb-2 block font-sans text-sm font-medium text-foreground"
          >
            Family surname
          </label>
          <input
            id="surname"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Sharma"
            className="w-full rounded-md border border-input bg-background px-4 py-3 font-serif text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
          {value.trim() && (
            <p className="mt-3 text-center font-serif text-sm text-muted-foreground">
              The {value.trim()} Family Constitution
            </p>
          )}
          <button
            type="submit"
            disabled={!value.trim()}
            className="mt-5 w-full rounded-md bg-gold px-6 py-3 font-sans text-base font-semibold text-primary-foreground shadow transition-all hover:bg-gold/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            Establish the Constitution
          </button>
        </form>
      </div>
    </div>
  )
}
