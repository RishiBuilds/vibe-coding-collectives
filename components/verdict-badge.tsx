import type { Verdict } from "@/lib/constitution"
import { cn } from "@/lib/utils"

const config: Record<
  Verdict,
  { bg: string; text: string; glow: string; label: string }
> = {
  APPROVED: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    glow: "verdict-glow-approved",
    label: "APPROVED",
  },
  DENIED: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    glow: "verdict-glow-denied",
    label: "DENIED",
  },
  CONDITIONAL: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    glow: "verdict-glow-conditional",
    label: "CONDITIONAL",
  },
}

export function VerdictBadge({
  verdict,
  size = "lg",
  animated = false,
}: {
  verdict: Verdict
  size?: "sm" | "md" | "lg"
  animated?: boolean
}) {
  const { bg, text, glow, label } = config[verdict]

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border-3 border-black font-sans font-bold uppercase tracking-[0.15em] shadow-[4px_4px_0_#0a0a0a]",
        bg,
        text,
        animated && glow,
        animated && "animate-verdict-stamp",
        size === "lg" && "px-8 py-3 text-xl sm:text-2xl",
        size === "md" && "px-5 py-2 text-sm",
        size === "sm" && "px-3 py-1 text-[10px] tracking-widest",
      )}
    >
      {label}
    </span>
  )
}

export function SeverityBadge({
  severity,
}: {
  severity: "LOW" | "MEDIUM" | "HIGH"
}) {
  const styles = {
    LOW: "bg-blue-600 text-white border-blue-800",
    MEDIUM: "bg-amber-600 text-white border-amber-800",
    HIGH: "bg-red-700 text-white border-red-900",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-[3px_3px_0_#0a0a0a]",
        styles[severity],
      )}
    >
      <span
        className={cn(
          "size-2 rounded-full",
          severity === "LOW" && "bg-blue-200",
          severity === "MEDIUM" && "bg-amber-200",
          severity === "HIGH" && "bg-red-200 animate-pulse",
        )}
      />
      {severity} severity
    </span>
  )
}
