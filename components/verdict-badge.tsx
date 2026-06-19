import type { Verdict } from "@/lib/constitution"
import { cn } from "@/lib/utils"

const styles: Record<Verdict, string> = {
  APPROVED: "bg-verdict-approved text-verdict-approved-fg",
  DENIED: "bg-verdict-denied text-verdict-denied-fg",
  CONDITIONAL: "bg-verdict-conditional text-verdict-conditional-fg",
}

export function VerdictBadge({
  verdict,
  size = "lg",
}: {
  verdict: Verdict
  size?: "sm" | "lg"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-sans font-bold uppercase tracking-widest shadow-sm",
        size === "lg"
          ? "px-7 py-2.5 text-lg sm:text-xl"
          : "px-3 py-1 text-xs",
        styles[verdict],
      )}
    >
      {verdict}
    </span>
  )
}
