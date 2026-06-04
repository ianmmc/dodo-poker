import { describe, it, expect, beforeEach } from 'vitest'
import {
  checkObservationRules,
  restoreFiredRules,
  clearFiredRules,
  getFiredRules,
} from './observationEngine'
import type { HandSummary } from './observationEngine'

const win  = (n: number): HandSummary => ({ handNumber: n, drawCount: 0, outcome: 'win'  })
const loss = (n: number): HandSummary => ({ handNumber: n, drawCount: 0, outcome: 'loss' })
const fold = (n: number): HandSummary => ({ handNumber: n, drawCount: 0, outcome: 'fold' })
const draw = (n: number, d: number): HandSummary => ({ handNumber: n, drawCount: d, outcome: 'win' })

beforeEach(() => {
  clearFiredRules()
})

describe('checkObservationRules', () => {
  it('returns empty for no qualifying pattern', () => {
    expect(checkObservationRules([win(1), win(2)])).toEqual([])
  })

  it('fires fold-streak rule after 3 consecutive folds', () => {
    const log = [fold(1), fold(2), fold(3)]
    const result = checkObservationRules(log)
    expect(result).toContain('t1a-obs-fold-streak')
  })

  it('does not fire fold-streak for only 2 folds', () => {
    expect(checkObservationRules([fold(1), fold(2), win(3)])).toEqual([])
  })

  it('fires loss-streak rule after 3 consecutive losses', () => {
    const log = [loss(1), loss(2), loss(3)]
    expect(checkObservationRules(log)).toContain('t1a-obs-loss-streak')
  })

  it('fires max-draw rule when last 3 draw-hands each discarded 4+', () => {
    const log = [draw(1, 4), draw(2, 5), draw(3, 4)]
    expect(checkObservationRules(log)).toContain('t1a-obs-max-draw')
  })

  it('does not fire max-draw when fewer than 3 qualifying draw-hands', () => {
    expect(checkObservationRules([draw(1, 4), draw(2, 4)])).toEqual([])
  })

  it('does not fire max-draw when any draw-hand has fewer than 4 discards', () => {
    expect(checkObservationRules([draw(1, 4), draw(2, 3), draw(3, 4)])).toEqual([])
  })
})

describe('firedRules — fires at most once', () => {
  it('does not re-fire fold-streak after first trigger', () => {
    const log = [fold(1), fold(2), fold(3)]
    checkObservationRules(log)
    expect(checkObservationRules([fold(4), fold(5), fold(6)])).not.toContain('t1a-obs-fold-streak')
  })

  it('clearFiredRules allows re-firing', () => {
    checkObservationRules([fold(1), fold(2), fold(3)])
    clearFiredRules()
    expect(checkObservationRules([fold(4), fold(5), fold(6)])).toContain('t1a-obs-fold-streak')
  })
})

describe('restoreFiredRules / getFiredRules', () => {
  it('restores previously fired rule IDs', () => {
    const ids = ['t1a-obs-fold-streak', 't1a-obs-loss-streak']
    restoreFiredRules(ids)
    expect(getFiredRules()).toEqual(expect.arrayContaining(ids))
  })

  it('restoring prevents the rule from re-firing (uses short rule ID, not dialog node ID)', () => {
    restoreFiredRules(['fold-streak'])
    expect(checkObservationRules([fold(1), fold(2), fold(3)])).not.toContain('t1a-obs-fold-streak')
  })
})
