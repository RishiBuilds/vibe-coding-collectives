import { generateText, Output } from "ai"
import { z } from "zod"
import type { Article } from "@/lib/constitution"

export const maxDuration = 30

const rulingSchema = z.object({
  verdict: z
    .enum(["APPROVED", "DENIED", "CONDITIONAL"])
    .describe("The clear verdict for the situation."),
  citationArticle: z
    .number()
    .describe("The number of the specific article being cited."),
  citationQuote: z
    .string()
    .describe("The exact quoted text of the cited article."),
  body: z
    .string()
    .describe(
      "A 2 to 3 sentence ruling written in Papa's calm, philosophical tone.",
    ),
  closing: z
    .string()
    .describe("One short, wise closing thought to end the ruling."),
})

export async function POST(req: Request) {
  try {
    const { situation, articles, surname } = (await req.json()) as {
      situation: string
      articles: Article[]
      surname?: string
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

    const system = `You are the AI enforcer of the Papa Constitution${
      surname ? ` of ${surname}` : ""
    }. Papa is a wise, philosophical man who believes deeply in savings, patience, and long-term thinking. He speaks in calm, measured English — never shouts, never jokes cheaply, but occasionally lands a dry, thoughtful observation that makes you think. Here are his Constitutional articles:

${articleList}

When given a family situation or dispute, you must: (1) deliver a clear verdict — APPROVED, DENIED, or CONDITIONAL, (2) cite at least one specific article by number and quote it exactly as written above, (3) give a 2–3 sentence ruling in Papa's philosophical tone, (4) end with one short, wise closing thought. Sound like a calm patriarch who has seen enough of life to know what matters. Never be preachy. Never be harsh. Always be fair.`

    const { experimental_output } = await generateText({
      model: "anthropic/claude-sonnet-4.6",
      system,
      prompt: `The situation submitted for ruling:\n\n"${situation}"`,
      experimental_output: Output.object({ schema: rulingSchema }),
    })

    return Response.json(experimental_output)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.log("[v0] ruling error:", message)
    return Response.json(
      {
        error: message.includes("credit card")
          ? "The AI Gateway needs a credit card on file to unlock free credits. Add one in your Vercel dashboard under AI, then try again."
          : "The Constitutional Authority could not be reached. Please try again.",
      },
      { status: 500 },
    )
  }
}
