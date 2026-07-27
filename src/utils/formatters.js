/**
 * WCD Dashboard — Number / display formatters
 */

/**
 * Format a large number in Indian Lakh notation.
 * e.g. 891683 → "8.92"  (caller appends "Lakh")
 */
export function toLakh(num) {
  if (num == null || isNaN(num)) return '—'
  return (num / 100000).toFixed(2)
}

/**
 * Format number with Indian-style commas (e.g. 53,065)
 */
export function formatIndian(num) {
  if (num == null || isNaN(num)) return '—'
  return Number(num).toLocaleString('en-IN')
}

/**
 * Format percentage with one decimal (e.g. 76.6%)
 */
export function formatPct(num) {
  if (num == null || isNaN(num)) return '—'
  return `${Number(num).toFixed(1)}%`
}

/**
 * Shorten FY label: "2020-21" → "20-21"
 */
export function shortenFY(fy) {
  if (!fy) return ''
  return fy // keep as-is for WCD (they're already short)
}
