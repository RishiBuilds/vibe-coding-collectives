export type Article = {
  id: string
  number: number
  rule: string
  category: string
}

export type Verdict = "APPROVED" | "DENIED" | "CONDITIONAL"

export type Ruling = {
  id: string
  question: string
  verdict: Verdict
  citation: string
  body: string
  closing: string
  date: string // ISO string
}

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: "art-1",
    number: 1,
    category: "Money & Spending",
    rule: "Savings are not what is left after spending. Spending is what is left after saving.",
  },
  {
    id: "art-2",
    number: 2,
    category: "Money & Spending",
    rule: "A want dressed in urgency is still a want. Sleep on it.",
  },
  {
    id: "art-3",
    number: 3,
    category: "Wisdom & Patience",
    rule: "The quality of your decisions reflects the quality of your thinking. Think slowly.",
  },
  {
    id: "art-4",
    number: 4,
    category: "Character",
    rule: "A man who cannot wait cannot build anything worth having.",
  },
  {
    id: "art-5",
    number: 5,
    category: "Respect & Family",
    rule: "Respect is not given by title. It is earned by consistency.",
  },
  {
    id: "art-6",
    number: 6,
    category: "Planning & Foresight",
    rule: "Fix the roof while the sun is shining. Problems are cheaper early.",
  },
  {
    id: "art-7",
    number: 7,
    category: "Money & Spending",
    rule: "Debt is borrowing from your future self. That self has not agreed to it.",
  },
  {
    id: "art-8",
    number: 8,
    category: "Family & Home",
    rule: "A peaceful home is built quietly, not announced loudly.",
  },
]

export const STORAGE_KEYS = {
  surname: "papa_surname",
  articles: "papa_articles",
  rulings: "papa_rulings",
} as const

export const EXAMPLE_PROMPTS = [
  "Can I buy a new phone?",
  "Should we go on an expensive holiday?",
  "Is it okay to skip saving this month?",
  "Who is right in this argument?",
]

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return iso
  }
}
