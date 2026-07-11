export interface ParsedWeddingDate {
  month: string
  day: string
  year: string
  dayOfWeek: string
}

/**
 * Parses a wedding date string (e.g. "November 7, 2026") into its components.
 * Falls back gracefully if the string cannot be parsed.
 */
export function parseWeddingDate(dateStr: string | undefined): ParsedWeddingDate {
  if (!dateStr) {
    return { month: "", day: "", year: "", dayOfWeek: "" }
  }

  const date = new Date(dateStr)

  if (isNaN(date.getTime())) {
    return { month: dateStr, day: "", year: "", dayOfWeek: "" }
  }

  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
  const day = String(date.getUTCDate())
  const year = String(date.getUTCFullYear())
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "long", timeZone: "UTC" })

  return { month, day, year, dayOfWeek }
}
