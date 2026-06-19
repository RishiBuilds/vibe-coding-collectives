import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"
import type { Article, Ruling } from "@/lib/constitution"
import { formatPrecedentContext } from "@/lib/precedent"

export const maxDuration = 30

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const rulingSchema = z.object({
  verdict: z.enum(["APPROVED", "DENIED", "CONDITIONAL"]),
  citationArticle: z.number(),
  citationQuote: z.string(),
  body: z.string(),
  closing: z.string(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
  precedentNote: z.string(),
})

export async function POST(req: Request) {
  try {
    const { situation, articles, surname, precedents } = (await req.json()) as {
      situation: string
      articles: Article[]
      surname?: string
      precedents?: Ruling[]
    }

    if (!situation || typeof situation !== "string") {
      return Response.json(
        { error: "A situation is required." },
        { status: 400 },
      )
    }

    const articleList = (articles ?? [])
      .map((a) => `Article ${a.number} (${a.category}): "${a.rule}"`)
      .join("\n")

    const precedentContext = precedents
      ? formatPrecedentContext(precedents)
      : ""

    const system = `You are the AI enforcer of the Papa Constitution${
      surname ? ` of the ${surname} family` : ""
    }. Papa is a wise, philosophical man who believes deeply in savings, patience, and long-term thinking. He speaks in calm, measured English — never shouts, never jokes cheaply, but occasionally lands a dry, thoughtful observation that makes you think. Here are his Constitutional articles:

${articleList}
${precedentContext}

When given a family situation or dispute, you must: (1) deliver a clear verdict — APPROVED, DENIED, or CONDITIONAL, (2) cite at least one specific article by number and quote it exactly as written above, (3) give a 2–3 sentence ruling in Papa's philosophical tone, (4) end with one short, wise closing thought, (5) assess the severity of this matter as LOW, MEDIUM, or HIGH, (6) if there are precedents above, note whether this ruling is consistent with them or if you are overruling — if no precedents, write "First ruling on this type of matter."

Sound like a calm patriarch who has seen enough of life to know what matters. Never be preachy. Never be harsh. Always be fair.

You MUST respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) with these exact keys:
- "verdict": one of "APPROVED", "DENIED", or "CONDITIONAL"
- "citationArticle": the article number (integer)
- "citationQuote": the exact quoted text of the cited article
- "body": a 2-3 sentence ruling in Papa's tone
- "closing": one short, wise closing thought
- "severity": one of "LOW", "MEDIUM", or "HIGH"
- "precedentNote": a brief note on precedent consistency`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system,
      prompt: `The situation submitted for ruling:\n\n"${situation}"`,
    })

    // Parse the JSON from the model's response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Model did not return valid JSON")
    }
    const parsed = rulingSchema.parse(JSON.parse(jsonMatch[0]))

    return Response.json(parsed)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[ruling] error:", message)
    return Response.json(
      {
        error: message.includes("API key") || message.includes("401")
          ? "Missing or invalid GROQ_API_KEY. Please add it to your .env.local file."
          : "The Constitutional Authority could not be reached. Please try again.",
      },
      { status: 500 },
    )
  }
}
