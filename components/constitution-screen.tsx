"use client"

import { useState } from "react"
import { Plus, X, Pencil, Trash2, Check, Filter } from "lucide-react"
import type { Article } from "@/lib/constitution"
import { CATEGORIES } from "@/lib/constitution"
import { cn } from "@/lib/utils"

export function ConstitutionScreen({
  surname,
  articles,
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
}: {
  surname: string
  articles: Article[]
  onAddArticle: (rule: string, category: string) => void
  onEditArticle: (id: string, rule: string, category: string) => void
  onDeleteArticle: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [rule, setRule] = useState("")
  const [category, setCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRule, setEditRule] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories from existing articles
  const categories = Array.from(new Set(articles.map((a) => a.category)))

  const filteredArticles = filterCategory
    ? articles.filter((a) => a.category === filterCategory)
    : articles

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rule.trim() || !category.trim()) return
    onAddArticle(rule.trim(), category.trim())
    setRule("")
    setCategory("")
    setOpen(false)
  }

  function startEdit(article: Article) {
    setEditingId(article.id)
    setEditRule(article.rule)
    setEditCategory(article.category)
  }

  function saveEdit() {
    if (!editingId || !editRule.trim() || !editCategory.trim()) return
    onEditArticle(editingId, editRule.trim(), editCategory.trim())
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditRule("")
    setEditCategory("")
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Document Container */}
      <div className="glass-card rounded-2xl p-6 sm:p-10 gold-border-glow">
        {/* Preamble Header */}
        <header className="text-center pb-8 border-b border-gold/15">
          <div className="ornament-line mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
              The {surname} Family
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            THE PAPA
            <br />
            <span className="gold-shimmer">CONSTITUTION</span>
          </h1>

          <p className="mt-4 font-serif text-sm sm:text-base italic text-muted-foreground leading-relaxed">
            Established Father&apos;s Day, 21st June 2026 — By Order of Papa
          </p>

          <p className="mt-3 font-serif text-xs text-gold/50 uppercase tracking-widest">
            {articles.length} Article{articles.length !== 1 ? "s" : ""} Ratified
          </p>
        </header>

        {/* Category Filters */}
        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              showFilters
                ? "bg-gold/15 text-gold border border-gold/30"
                : "text-muted-foreground hover:text-foreground border border-transparent",
            )}
          >
            <Filter className="size-3" />
            Filter
          </button>

          {showFilters && (
            <div className="flex flex-wrap gap-1.5 animate-fade-in">
              <button
                onClick={() => setFilterCategory(null)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-medium transition-all",
                  !filterCategory
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-muted-foreground hover:text-foreground border border-white/5 hover:border-white/10",
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setFilterCategory(filterCategory === cat ? null : cat)
                  }
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-medium transition-all",
                    filterCategory === cat
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "text-muted-foreground hover:text-foreground border border-white/5 hover:border-white/10",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Articles List */}
        <ol className="mt-8 flex flex-col gap-6">
          {filteredArticles.map((article, index) => (
            <li
              key={article.id}
              className={cn(
                "group relative rounded-xl p-5 sm:p-6 transition-all duration-300",
                "bg-white/[0.02] hover:bg-white/[0.04]",
                "border border-white/[0.04] hover:border-gold/15",
                "animate-fade-in",
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {editingId === article.id ? (
                /* Editing mode */
                <div className="space-y-3 animate-fade-in">
                  <textarea
                    value={editRule}
                    onChange={(e) => setEditRule(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg input-dark px-4 py-3 font-serif text-base italic resize-none outline-none"
                    autoFocus
                  />
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-lg input-dark px-4 py-2.5 text-sm outline-none appearance-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="rounded-lg btn-gold px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Check className="size-3" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* Display mode */
                <div className="flex gap-5">
                  {/* Article Number */}
                  <div className="shrink-0 flex flex-col items-center w-14 sm:w-16">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold/50">
                      Article
                    </span>
                    <span className="font-serif text-3xl sm:text-4xl font-bold leading-none text-gold/80 mt-0.5">
                      {article.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 border-l border-gold/10 pl-5">
                    <p className="font-serif text-base sm:text-lg italic leading-relaxed text-foreground/90">
                      &ldquo;{article.rule}&rdquo;
                    </p>
                    <span className="mt-3 inline-block rounded-full bg-gold/8 border border-gold/10 px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold/60">
                      {article.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(article)}
                      className="rounded-lg p-2 text-muted-foreground hover:text-gold hover:bg-gold/10 transition-all"
                      aria-label="Edit article"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteArticle(article.id)}
                      className="rounded-lg p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                      aria-label="Delete article"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>

        {/* Add Article Section */}
        <div className="mt-8 pt-6 border-t border-gold/10">
          {open ? (
            <form
              onSubmit={handleSubmit}
              className="rounded-xl glass p-5 sm:p-6 animate-fade-in-scale"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                  <Plus className="size-4 text-gold" />
                  Ratify a New Article
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  aria-label="Cancel"
                >
                  <X className="size-4" />
                </button>
              </div>

              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Rule Text
              </label>
              <textarea
                value={rule}
                onChange={(e) => setRule(e.target.value)}
                rows={3}
                placeholder="State the law as Papa would..."
                className="w-full resize-none rounded-xl input-dark px-4 py-3 font-serif text-base italic outline-none"
                autoFocus
              />

              <label className="mb-2 mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl input-dark px-4 py-3 text-sm outline-none appearance-none"
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={!rule.trim() || !category.trim()}
                className="mt-5 w-full rounded-xl btn-gold px-5 py-3 text-sm font-semibold"
              >
                Add to the Constitution
              </button>
            </form>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gold/20 px-5 py-4 text-sm font-medium text-gold/60 transition-all hover:border-gold/40 hover:text-gold hover:bg-gold/5"
            >
              <Plus className="size-4" />
              Ratify New Article
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
