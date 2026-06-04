import type { Card } from './card'

export interface BetDecision {
  action: 'bet' | 'call' | 'check' | 'fold'
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
  // Hank always bets if he can; always calls if facing a bet. Never folds.
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

// Lucky's opening action probabilities driven by the gambler's fallacy:
//   winning streak → thinks she's due to lose → plays timidly (fold/check)
//   losing streak  → thinks she's due to win  → bets aggressively
//   neutral        → normal mix
// Only applies when callAmount === 0 (Lucky opens); she always calls a player bet.
function luckyOpeningDecision(
  betAmount: number,
  wins: number,
  losses: number
): BetDecision {
  const r = Math.random()
  if (wins >= 2) {
    // 35% fold, 45% check, 20% bet
    if (r < 0.35) return { action: 'fold',  amount: 0 }
    if (r < 0.80) return { action: 'check', amount: 0 }
    return { action: 'bet', amount: betAmount }
  }
  if (losses >= 3) {
    // 5% fold, 15% check, 80% bet
    if (r < 0.05) return { action: 'fold',  amount: 0 }
    if (r < 0.20) return { action: 'check', amount: 0 }
    return { action: 'bet', amount: betAmount }
  }
  // Neutral: 10% fold, 30% check, 60% bet
  if (r < 0.10) return { action: 'fold',  amount: 0 }
  if (r < 0.40) return { action: 'check', amount: 0 }
  return { action: 'bet', amount: betAmount }
}

export const lucky = {
  decideBet(
    callAmount: number,
    betAmount: number,
    luckyConsecutiveWins = 0,
    luckyConsecutiveLosses = 0
  ): BetDecision {
    if (callAmount > 0) return { action: 'call', amount: callAmount }
    return luckyOpeningDecision(betAmount, luckyConsecutiveWins, luckyConsecutiveLosses)
  },

  decideDraw(_hand: Card[]): DrawDecision {
    const count = weightedRandom(HANK_DRAW_WEIGHTS)
    const discardIndices = Array.from({ length: count }, (_, i) => 4 - i)
    return { discardIndices }
  },

  drawDialogNodeId(count: number): string {
    return count === 0 ? 't1b-npc-draw-0' : `t1b-npc-draw-${Math.min(count, 3)}`
  }
}
