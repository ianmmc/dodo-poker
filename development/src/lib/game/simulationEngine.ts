// ── Phase 1: Card-draw simulation (used by Surveillance Room) ────────────────

const MAX_DISPLAY_POINTS = 500

export interface CardDrawSim {
  totalDraws: number
  redCount: number
  blackCount: number
  finalFreq: number
  /** Full results array, one entry per draw */
  results: CardDrawResult[]
  /** Sampled down to MAX_DISPLAY_POINTS for SVG rendering */
  sampledPoints: number[]
}

export interface CardDrawResult {
  drawIndex: number
  outcome: 'red' | 'black'
  runningFreq: number
}

export function runCardDrawSim(n: number): CardDrawSim {
  let red = 0
  const results: CardDrawResult[] = []
  for (let i = 0; i < n; i++) {
    const isRed = Math.random() < 26 / 52
    if (isRed) red++
    results.push({ drawIndex: i, outcome: isRed ? 'red' : 'black', runningFreq: red / (i + 1) })
  }
  return {
    totalDraws: n,
    redCount: red,
    blackCount: n - red,
    finalFreq: red / n,
    results,
    sampledPoints: samplePoints(results.map(r => r.runningFreq), MAX_DISPLAY_POINTS),
  }
}

function samplePoints(freqs: number[], maxPoints: number): number[] {
  if (freqs.length <= maxPoints) return freqs
  const step = freqs.length / maxPoints
  return Array.from({ length: maxPoints }, (_, i) => freqs[Math.floor(i * step)])
}

// ── Phase 2 foundations: Poker-hand simulation (cinematic mode) ──────────────
// Types and interfaces for the future split-screen cinematic experience.
// No implementation yet — these define the contract so SurveillanceRoom and
// future table variants can depend on stable types when the mode is built.

export type SimMode = 'card-stream' | 'cinematic'

/** A single resolved poker hand for cinematic replay. */
export interface PokerSimHandResult {
  handIndex: number
  playerCards: string[]   // card IDs, e.g. 'Ah', '2c'
  npcCards: string[]
  outcome: 'win' | 'loss' | 'tie'
  playerHandName: string
  npcHandName: string
}

/** Config for a poker simulation run (extensible for future NPC strategies). */
export interface PokerSimConfig {
  totalHands: number
  mode: SimMode
  npcStrategy?: 'random'
}

/**
 * Controller interface for simulation runs.
 * Phase 1 implementations use `runCardDrawSim` directly.
 * Phase 2 will implement this interface for step-through cinematic playback.
 */
export interface SimulationController<TResult> {
  readonly config: PokerSimConfig
  readonly complete: boolean
  /** Run all remaining steps at once; returns all results. */
  runAll(): TResult[]
  /** Advance one step; returns result or null if complete. */
  step(): TResult | null
  reset(): void
}
