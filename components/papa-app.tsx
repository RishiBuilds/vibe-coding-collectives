"use client"

import { useEffect, useState } from "react"
import { ScrollText, Gavel, Archive } from "lucide-react"
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

type Tab = "constitution" | "chamber" | "hall"

const TABS: { id: Tab; label: string; icon: typeof ScrollText }[] = [
  { id: "constitution", label: "Constitution", icon: ScrollText },
  { id: "chamber", label: "Ruling Chamber", icon: Gavel },
  { id: "hall", label: "Hall of Rulings", icon: Archive },
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
        <ScrollText className="size-8 animate-pulse text-gold" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {!surname && <SetupModal onComplete={handleSetup} />}

      <header className="border-b border-gold/30 bg-card/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-md border border-gold/50 bg-gold/10">
              <Gavel className="size-5 text-gold" />
            </div>
            <div className="leading-tight">
              <div className="font-serif text-lg font-bold text-foreground">
                Papa Says So
              </div>
              <div className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold">
                {surname ? `The ${surname} Family` : "Family Law & Order"}
              </div>
            </div>
          </div>

          <nav className="flex rounded-lg border border-gold/30 bg-background/60 p-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 font-sans text-xs font-medium transition-colors sm:text-sm",
                  tab === id
                    ? "bg-gold text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="px-4 py-8 sm:py-12">
        {tab === "constitution" && (
          <ConstitutionScreen
            surname={surname ?? "Family"}
            articles={articles}
            onAddArticle={handleAddArticle}
          />
        )}
        {tab === "chamber" && (
          <RulingChamber
            articles={articles}
            surname={surname ?? "Family"}
            onNewRuling={handleNewRuling}
          />
        )}
        {tab === "hall" && (
          <HallOfRulings rulings={rulings} onClear={handleClearRulings} />
        )}
      </main>

      <footer className="border-t border-gold/20 py-6 text-center">
        <p className="font-serif text-sm italic text-muted-foreground">
          A peaceful home is built quietly, not announced loudly.
        </p>
      </footer>
    </div>
  )
}
