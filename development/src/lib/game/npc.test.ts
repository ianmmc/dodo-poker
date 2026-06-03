import { describe, it, expect } from 'vitest'
import { hank, lucky } from './npc'

describe('hank.decideBet', () => {
  it('always bets when opening (callAmount = 0)', () => {
    const d = hank.decideBet(0, 5)
    expect(d.action).toBe('bet')
    expect(d.amount).toBe(5)
  })

  it('always calls when facing a bet', () => {
    const d = hank.decideBet(5, 5)
    expect(d.action).toBe('call')
    expect(d.amount).toBe(5)
  })

  it('never folds', () => {
    for (let i = 0; i < 50; i++) {
      expect(hank.decideBet(0, 5).action).not.toBe('fold')
      expect(hank.decideBet(5, 5).action).not.toBe('fold')
    }
  })
})

describe('lucky.decideBet', () => {
  it('always calls when facing a bet (callAmount > 0) — never folds to a player bet', () => {
    for (let i = 0; i < 100; i++) {
      const d = lucky.decideBet(5, 5, 0)
      expect(d.action).toBe('call')
    }
  })

  it('always calls when facing a bet regardless of consecutive wins', () => {
    for (let i = 0; i < 50; i++) {
      const d = lucky.decideBet(5, 5, 3)
      expect(d.action).toBe('call')
    }
  })

  it('when opening, either bets or folds (never checks)', () => {
    const actions = new Set<string>()
    for (let i = 0; i < 200; i++) {
      actions.add(lucky.decideBet(0, 5, 0).action)
    }
    expect(actions.has('check')).toBe(false)
    // Should see both bet and fold over 200 trials at 10% fold rate
    expect(actions.has('bet')).toBe(true)
    expect(actions.has('fold')).toBe(true)
  })

  it('folds more often after 2+ consecutive Lucky wins', () => {
    const TRIALS = 2000
    let folds0 = 0
    let folds2 = 0
    for (let i = 0; i < TRIALS; i++) {
      if (lucky.decideBet(0, 5, 0).action === 'fold') folds0++
      if (lucky.decideBet(0, 5, 2).action === 'fold') folds2++
    }
    // Baseline ~10%, hot-streak ~35% — should be clearly distinguishable
    expect(folds2).toBeGreaterThan(folds0)
    // Rough bounds: baseline should be under 20%, hot-streak over 20%
    expect(folds0 / TRIALS).toBeLessThan(0.20)
    expect(folds2 / TRIALS).toBeGreaterThan(0.20)
  })
})
