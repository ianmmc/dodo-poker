import type { Card } from './card'

export interface BetDecision {
  action: 'bet' | 'call' | 'check'
  amount: number
}

export interface DrawDecision {
  discardIndices: number[]
}

// Weighted random draw: Hank has no strategy, but draws 0–3 cards
// with realistic-looking distribution (never 4 or 5).
const HANK_DRAW_WEIGHTS = [
  { count: 0, weight: 1 },
  { count: 1, weight: 3 },
  { count: 2, weight: 4 },
  { count: 3, weight: 2 },
]

function weightedRandom(weights: { count: number; weight: number }[]): number {
  const total = weights.reduce((sum, w) => sum + w.weight, 0)
  let r = Math.random() * total
  for (const w of weights) {
    r -= w.weight
    if (r <= 0) return w.count
  }
  return weights[weights.length - 1].count
}

export const hank = {
  // Hank always bets if he can; always calls if facing a bet.
  decideBet(callAmount: number, betAmount: number): BetDecision {
    if (callAmount > 0) return { action: 'call', amount: callAmount }
    return { action: 'bet', amount: betAmount }
  },

  decideDraw(_hand: Card[]): DrawDecision {
    const count = weightedRandom(HANK_DRAW_WEIGHTS)
    // Discard the last `count` cards (arbitrary — Hank has no real strategy)
    const discardIndices = Array.from({ length: count }, (_, i) => 4 - i)
    return { discardIndices }
  },

  drawDialogNodeId(count: number): string {
    return count === 0 ? 't1a-hank-draw-0' : `t1a-hank-draw-${Math.min(count, 3)}`
  }
}
