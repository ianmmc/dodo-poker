import type { FrequencyData } from './frequencyData'

// Named keys for live-numeric assessment nodes. Every key that can appear
// in a dialog node's correctAnswerKey or textTemplate must be listed here.
// This is a closed enum — add new keys when new table assessments require them.
export type LiveDataKey =
  // Counts
  | 'totalHands'
  | 'highCardCount' | 'onePairCount'     | 'twoPairCount'      | 'threeOfAKindCount'
  | 'straightCount' | 'flushCount'       | 'fullHouseCount'    | 'fourOfAKindCount'
  | 'straightFlushCount'
  | 'winCount'      | 'lossCount'        | 'tieCount'          | 'foldCount'
  // Percentages (Math.round of count/total × 100)
  | 'highCardPercent' | 'onePairPercent'     | 'twoPairPercent'      | 'threeOfAKindPercent'
  | 'straightPercent' | 'flushPercent'       | 'fullHousePercent'    | 'fourOfAKindPercent'
  | 'straightFlushPercent'
  | 'winPercent'      | 'lossPercent'        | 'tiePercent'

export type DataContext = Record<LiveDataKey, number>

// Build the full DataContext from the current frequency table.
// Division-by-zero is safe: total is clamped to 1 before division so
// all percentages are 0 when no hands have been played.
export function buildDataContext(freq: FrequencyData): DataContext {
  const total = Math.max(freq.total, 1)
  const pct = (n: number) => Math.round(n / total * 100)
  return {
    totalHands:           freq.total,
    highCardCount:        freq.highCard,
    onePairCount:         freq.onePair,
    twoPairCount:         freq.twoPair,
    threeOfAKindCount:    freq.threeOfAKind,
    straightCount:        freq.straight,
    flushCount:           freq.flush,
    fullHouseCount:       freq.fullHouse,
    fourOfAKindCount:     freq.fourOfAKind,
    straightFlushCount:   freq.straightFlush,
    winCount:             freq.wins,
    lossCount:            freq.losses,
    tieCount:             freq.ties,
    foldCount:            freq.folds,
    highCardPercent:      pct(freq.highCard),
    onePairPercent:       pct(freq.onePair),
    twoPairPercent:       pct(freq.twoPair),
    threeOfAKindPercent:  pct(freq.threeOfAKind),
    straightPercent:      pct(freq.straight),
    flushPercent:         pct(freq.flush),
    fullHousePercent:     pct(freq.fullHouse),
    fourOfAKindPercent:   pct(freq.fourOfAKind),
    straightFlushPercent: pct(freq.straightFlush),
    winPercent:           pct(freq.wins),
    lossPercent:          pct(freq.losses),
    tiePercent:           pct(freq.ties),
  }
}

// Substitute {{key}} placeholders in a template string.
// Unknown keys are left as-is ({{key}}) rather than silently removed.
export function renderTemplate(template: string, ctx: DataContext): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const val = (ctx as Record<string, number>)[key]
    return val !== undefined ? String(val) : match
  })
}

// Return the numeric value for a named key. Returns 0 for unrecognised keys
// so the assessment system never receives NaN.
export function resolveKey(key: string, ctx: DataContext): number {
  const val = (ctx as Record<string, number>)[key]
  return val ?? 0
}
