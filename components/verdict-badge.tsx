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
        "inline-flex items-center justify-center rounded-full font-sans font-bold uppercase tracking-[0.15em]",
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
    LOW: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider",
        styles[severity],
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          severity === "LOW" && "bg-sky-400",
          severity === "MEDIUM" && "bg-amber-400",
          severity === "HIGH" && "bg-red-400 animate-pulse",
        )}
      />
      {severity} severity
    </span>
  )
}
