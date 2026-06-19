"use client"

import { useEffect, useState } from "react"
import { ScrollText, Scale, Archive, BarChart3, Gavel } from "lucide-react"
import {
  type Article,
  type Ruling,
  DEFAULT_ARTICLES,
  STORAGE_KEYS,
} from "@/lib/constitution"
import { cn } from "@/lib/utils"
import { SetupModal } from "@/components/setup-modal"
import { ConstitutionScreen } from "@/components/constitution-screen"
import { RulingChamber } from "@/components/ruling-chamber"
import { HallOfRulings } from "@/components/hall-of-rulings"
import { InsightsDashboard } from "@/components/insights-dashboard"

type Tab = "constitution" | "chamber" | "hall" | "insights"

const TABS: { id: Tab; label: string; icon: typeof ScrollText }[] = [
  { id: "constitution", label: "Constitution", icon: ScrollText },
  { id: "chamber", label: "Ruling Chamber", icon: Scale },
  { id: "hall", label: "Hall of Rulings", icon: Archive },
  { id: "insights", label: "Insights", icon: BarChart3 },
]

export function PapaApp() {
  const [hydrated, setHydrated] = useState(false)
  const [surname, setSurname] = useState<string | null>(null)
  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES)
  const [rulings, setRulings] = useState<Ruling[]>([])
  const [tab, setTab] = useState<Tab>("constitution")

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedSurname = localStorage.getItem(STORAGE_KEYS.surname)
      if (storedSurname) setSurname(storedSurname)

      const storedArticles = localStorage.getItem(STORAGE_KEYS.articles)
      if (storedArticles) {
        const parsed = JSON.parse(storedArticles) as Article[]
        if (Array.isArray(parsed) && parsed.length > 0) setArticles(parsed)
      }

      const storedRulings = localStorage.getItem(STORAGE_KEYS.rulings)
      if (storedRulings) {
        const parsed = JSON.parse(storedRulings) as Ruling[]
        if (Array.isArray(parsed)) setRulings(parsed)
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  function handleSetup(name: string) {
    setSurname(name)
    localStorage.setItem(STORAGE_KEYS.surname, name)
  }

  function handleAddArticle(rule: string, category: string) {
    setArticles((prev) => {
      const next = [
        ...prev,
        {
          id: crypto.randomUUID(),
          number: prev.length + 1,
          rule,
          category,
        },
      ]
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(next))
      return next
    })
  }

  function handleEditArticle(id: string, rule: string, category: string) {
    setArticles((prev) => {
      const next = prev.map((a) =>
        a.id === id ? { ...a, rule, category } : a
      )
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(next))
      return next
    })
  }

  function handleDeleteArticle(id: string) {
    setArticles((prev) => {
      const filtered = prev.filter((a) => a.id !== id)
      // Renumber articles
      const renumbered = filtered.map((a, i) => ({
        ...a,
        number: i + 1,
      }))
      localStorage.setItem(STORAGE_KEYS.articles, JSON.stringify(renumbered))
      return renumbered
    })
  }

  function handleNewRuling(ruling: Ruling) {
    setRulings((prev) => {
      const next = [ruling, ...prev]
      localStorage.setItem(STORAGE_KEYS.rulings, JSON.stringify(next))
      return next
    })
  }

  function handleClearRulings() {
    setRulings([])
    localStorage.removeItem(STORAGE_KEYS.rulings)
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center animate-pulse-gold">
            <Gavel className="size-6 text-gold" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold/50">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-10">
      {!surname && <SetupModal onComplete={handleSetup} />}

      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-gold/10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20">
              <Gavel className="size-5 text-gold" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-bold text-foreground tracking-tight">
                Papa Says So
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/50">
                {surname ? `The ${surname} Family` : "Family Law & Order"}
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex rounded-xl glass p-1 gap-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  tab === id
                    ? "btn-gold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                <Icon className="size-4" />
                {label}
                {/* Badge for rulings count */}
                {id === "hall" && rulings.length > 0 && (
                  <span className={cn(
                    "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                    tab === id
                      ? "bg-[#0a0f1e]/20 text-[#0a0f1e]"
                      : "bg-gold/15 text-gold/70",
                  )}>
                    {rulings.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Mobile Nav */}
          <nav className="flex sm:hidden w-full rounded-xl glass p-1 gap-0.5">
            {TABS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-lg py-2.5 transition-all duration-200",
                  tab === id
                    ? "btn-gold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 sm:py-12">
        {tab === "constitution" && (
          <ConstitutionScreen
            surname={surname ?? "Family"}
            articles={articles}
            onAddArticle={handleAddArticle}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
          />
        )}
        {tab === "chamber" && (
          <RulingChamber
            articles={articles}
            surname={surname ?? "Family"}
            rulings={rulings}
            onNewRuling={handleNewRuling}
          />
        )}
        {tab === "hall" && (
          <HallOfRulings rulings={rulings} onClear={handleClearRulings} />
        )}
        {tab === "insights" && (
          <InsightsDashboard rulings={rulings} articles={articles} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/8 py-8 text-center">
        <p className="font-serif text-sm italic text-muted-foreground/40">
          &ldquo;A peaceful home is built quietly, not announced loudly.&rdquo;
        </p>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/20">
          The {surname ?? "Family"} Constitutional Authority
        </p>
      </footer>
    </div>
  )
}
