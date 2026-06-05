import { describe, it, expect } from 'vitest'
import { hank, lucky, vivian } from './npc'

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
      const d = lucky.decideBet(5, 5, 0, 0)
      expect(d.action).toBe('call')
    }
  })

  it('always calls when facing a bet regardless of streak state', () => {
    for (let i = 0; i < 50; i++) {
      expect(lucky.decideBet(5, 5, 3, 0).action).toBe('call')
      expect(lucky.decideBet(5, 5, 0, 3).action).toBe('call')
    }
  })

  it('when opening (neutral), produces bet/check/fold over many trials', () => {
    const actions = new Set<string>()
    for (let i = 0; i < 500; i++) actions.add(lucky.decideBet(0, 5, 0, 0).action)
    expect(actions.has('bet')).toBe(true)
    expect(actions.has('check')).toBe(true)
    expect(actions.has('fold')).toBe(true)
  })

  it('on winning streak, folds and checks more than bets (timid)', () => {
    const TRIALS = 2000
    let folds = 0, checks = 0, bets = 0
    for (let i = 0; i < TRIALS; i++) {
      const a = lucky.decideBet(0, 5, 2, 0).action
      if (a === 'fold') folds++
      else if (a === 'check') checks++
      else bets++
    }
    // Winning streak: 35% fold, 45% check, 20% bet — passive actions dominate
    expect(folds + checks).toBeGreaterThan(bets)
    // Fold rate ~35% — clearly above neutral ~10%
    expect(folds / TRIALS).toBeGreaterThan(0.20)
  })

  it('on losing streak, bets aggressively (thinks win is due)', () => {
    const TRIALS = 2000
    let bets = 0
    for (let i = 0; i < TRIALS; i++) {
      if (lucky.decideBet(0, 5, 0, 3).action === 'bet') bets++
    }
    // Losing streak: 80% bet — clearly above neutral 60%
    expect(bets / TRIALS).toBeGreaterThan(0.65)
  })

  it('folds more when on winning streak vs neutral', () => {
    const TRIALS = 2000
    let foldsNeutral = 0, foldsStreak = 0
    for (let i = 0; i < TRIALS; i++) {
      if (lucky.decideBet(0, 5, 0, 0).action === 'fold') foldsNeutral++
      if (lucky.decideBet(0, 5, 2, 0).action === 'fold') foldsStreak++
    }
    expect(foldsStreak).toBeGreaterThan(foldsNeutral)
    expect(foldsNeutral / TRIALS).toBeLessThan(0.20)
    expect(foldsStreak / TRIALS).toBeGreaterThan(0.20)
  })
})

describe('vivian.decideBet — hot hand fallacy: bets more when winning', () => {
  it('always calls when facing a player bet', () => {
    for (let i = 0; i < 50; i++) {
      expect(vivian.decideBet(10, 10, 0).action).toBe('call')
    }
  })

  it('always bets when opening (never folds or checks)', () => {
    for (let i = 0; i < 100; i++) {
      const d = vivian.decideBet(0, 10, 0)
      expect(d.action).toBe('bet')
    }
  })

  it('bets 5 seeds when neutral (no streak)', () => {
    const d = vivian.decideBet(0, 10, 0)
    expect(d.amount).toBe(5)
  })

  it('bets 10 seeds after 1 consecutive win', () => {
    const d = vivian.decideBet(0, 10, 1)
    expect(d.amount).toBe(10)
  })

  it('bets 20 seeds after 2+ consecutive wins (running hot)', () => {
    expect(vivian.decideBet(0, 10, 2).amount).toBe(20)
    expect(vivian.decideBet(0, 10, 5).amount).toBe(20)
  })

  it('bet amounts increase strictly with winning streak (hot hand escalation)', () => {
    const neutral = vivian.decideBet(0, 10, 0).amount
    const oneWin  = vivian.decideBet(0, 10, 1).amount
    const twoWins = vivian.decideBet(0, 10, 2).amount
    expect(neutral).toBeLessThan(oneWin)
    expect(oneWin).toBeLessThan(twoWins)
  })

  it('decideDraw returns empty discards (no-draw table)', () => {
    const d = vivian.decideDraw(['Ah', '2c', '3d', '4s', '5h'] as any)
    expect(d.discardIndices).toEqual([])
  })
})
