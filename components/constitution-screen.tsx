"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import type { Article } from "@/lib/constitution"

export function ConstitutionScreen({
  surname,
  articles,
  onAddArticle,
}: {
  surname: string
  articles: Article[]
  onAddArticle: (rule: string, category: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [rule, setRule] = useState("")
  const [category, setCategory] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rule.trim() || !category.trim()) return
    onAddArticle(rule.trim(), category.trim())
    setRule("")
    setCategory("")
    setOpen(false)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative rounded-lg border border-gold/40 bg-card p-6 shadow-xl ring-1 ring-gold/10 sm:p-10">
        {/* Decorative inner border */}
        <div className="pointer-events-none absolute inset-3 rounded border border-gold/30" />

        <div className="relative">
          <header className="border-b-2 border-gold/30 pb-6 text-center">
            <div className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              The {surname} Family
            </div>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
              THE PAPA CONSTITUTION
            </h1>
            <p className="mt-3 font-serif text-sm italic text-muted-foreground sm:text-base">
              Established Father&apos;s Day, 21st June 2026 — By Order of Papa
            </p>
          </header>

          <ol className="mt-8 flex flex-col gap-8">
            {articles.map((article) => (
              <li
                key={article.id}
                className="flex flex-col gap-2 sm:flex-row sm:gap-6"
              >
                <div className="flex shrink-0 items-baseline gap-2 sm:w-28 sm:flex-col sm:items-end sm:gap-0">
                  <span className="font-serif text-xs uppercase tracking-widest text-gold">
                    Article
                  </span>
                  <span className="font-serif text-4xl font-bold leading-none text-gold sm:text-5xl">
                    {article.number}
                  </span>
                </div>
                <div className="sm:border-l sm:border-gold/20 sm:pl-6">
                  <p className="font-serif text-lg italic leading-relaxed text-foreground text-pretty sm:text-xl">
                    &ldquo;{article.rule}&rdquo;
                  </p>
                  <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-0.5 font-sans text-xs font-medium uppercase tracking-wide text-secondary-foreground">
                    {article.category}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 border-t-2 border-gold/30 pt-6">
            {open ? (
              <form
                onSubmit={handleSubmit}
                className="rounded-md border border-gold/30 bg-background/60 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Ratify a New Article
                  </h3>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="Cancel"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <label className="mb-1 block font-sans text-sm font-medium text-foreground">
                  Rule text
                </label>
                <textarea
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  rows={3}
                  placeholder="State the law as Papa would..."
                  className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 font-serif text-base italic text-foreground outline-none transition-colors placeholder:not-italic placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
                <label className="mb-1 mt-3 block font-sans text-sm font-medium text-foreground">
                  Category
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Money & Spending"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
                <button
                  type="submit"
                  disabled={!rule.trim() || !category.trim()}
                  className="mt-4 w-full rounded-md bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-primary-foreground transition-all hover:bg-gold/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to the Constitution
                </button>
              </form>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gold/50 px-5 py-3 font-sans text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                <Plus className="size-4" />
                Add Article
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
