import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gemini often returns JSON wrapped in ```json ... ``` or ``` ... ```.
 * Strip those before parsing.
 */
export function parseJsonFromGemini(raw: string): unknown {
  const trimmed = raw.trim()
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = codeBlock ? codeBlock[1].trim() : trimmed
  return JSON.parse(jsonStr)
}

/**
 * Convert a Date into a specific IANA timezone without mutating the original date.
 * Relies on Intl API (works in Node 18+ and modern browsers).
 */
export function toTimeZone(date: Date, timeZone: string): Date {
  const iso = date.toLocaleString('en-US', { timeZone })
  return new Date(iso)
}

/**
 * Normalize a fuzzy time phrase into a target Date using a fallback day and timezone.
 * This is a minimal heuristic; callers should still ask for user confirmation.
 */
export function normalizeFuzzyTime(
  phrase: string,
  now: Date,
  timeZone: string
): Date | null {
  const lower = phrase.toLowerCase().trim()
  const base = toTimeZone(now, timeZone)

  if (['today', 'tonight'].includes(lower)) return base
  if (lower === 'tomorrow') {
    const d = new Date(base)
    d.setDate(d.getDate() + 1)
    return d
  }
  if (lower.match(/^in \\d+ (minutes|min)$/)) {
    const mins = parseInt(lower.match(/\\d+/)?.[0] || '0', 10)
    const d = new Date(base)
    d.setMinutes(d.getMinutes() + mins)
    return d
  }
  if (lower.match(/^in \\d+ (hours|hrs|hour)$/)) {
    const hrs = parseInt(lower.match(/\\d+/)?.[0] || '0', 10)
    const d = new Date(base)
    d.setHours(d.getHours() + hrs)
    return d
  }
  return null
}
