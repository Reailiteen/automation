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