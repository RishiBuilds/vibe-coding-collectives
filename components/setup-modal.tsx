"use client"

import { useState } from "react"
import { ScrollText, Sparkles, ArrowRight } from "lucide-react"

export function SetupModal({
  onComplete,
}: {
  onComplete: (surname: string) => void
}) {
  const [value, setValue] = useState("")
  const [step, setStep] = useState<1 | 2>(1)

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    setStep(2)
  }

  function handleConfirm() {
    onComplete(value.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#060a16]/90 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-fade-in-scale">
        <div className="glass-strong rounded-2xl p-8 sm:p-10 gold-border-glow">
          {step === 1 ? (
            <>
              {/* Step 1: Enter surname */}
              <div className="flex justify-center mb-6">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 animate-float">
                  <ScrollText className="size-8 text-gold" />
                </div>
              </div>

              <div className="text-center mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
                  By Order of Papa
                </span>
              </div>

              <h2 className="text-center font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Establish Your
                <br />
                <span className="gold-shimmer">Constitution</span>
              </h2>

              <p className="mt-4 text-center font-serif text-base italic leading-relaxed text-muted-foreground">
                Every family is governed by Papa&apos;s unwritten rules.
                <br />
                Enter your surname to make them official.
              </p>

              <form onSubmit={handleContinue} className="mt-8">
                <label
                  htmlFor="surname-input"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Family Surname
                </label>
                <input
                  id="surname-input"
                  autoFocus
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. Sharma"
                  className="w-full rounded-xl input-dark px-5 py-4 font-serif text-xl text-foreground outline-none"
                />

                {value.trim() && (
                  <p className="mt-3 text-center font-serif text-sm text-gold/70 animate-fade-in">
                    The {value.trim()} Family Constitution
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="mt-6 w-full rounded-xl btn-gold px-6 py-4 text-base font-semibold flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Step 2: Confirmation */}
              <div className="text-center animate-fade-in-up">
                <div className="flex justify-center mb-6">
                  <div className="flex size-20 items-center justify-center rounded-full bg-gold/10 border border-gold/20 animate-pulse-gold">
                    <Sparkles className="size-10 text-gold" />
                  </div>
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-gold/80">
                  Constitutional Authority
                </span>

                <h2 className="mt-2 font-serif text-3xl font-bold text-foreground">
                  The{" "}
                  <span className="gold-shimmer">{value.trim()}</span>{" "}
                  Constitution
                </h2>

                <p className="mt-4 font-serif text-base italic text-muted-foreground leading-relaxed">
                  8 articles of Papa&apos;s wisdom have been prepared.
                  <br />
                  You may add, edit, or remove them at any time.
                </p>

                {/* Family Seal */}
                <div className="mt-8 flex justify-center">
                  <div className="relative size-28 rounded-full border-2 border-gold/40 flex items-center justify-center bg-gold/5">
                    <div className="absolute inset-2 rounded-full border border-gold/20" />
                    <div className="text-center">
                      <div className="font-serif text-3xl font-bold text-gold">
                        {value.trim().charAt(0).toUpperCase()}
                      </div>
                      <div className="text-[8px] font-semibold uppercase tracking-[0.2em] text-gold/60 mt-0.5">
                        Est. {new Date().getFullYear()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-xl btn-outline-gold px-5 py-3.5 text-sm font-semibold"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 rounded-xl btn-gold px-5 py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <ScrollText className="size-4" />
                    Ratify Constitution
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
