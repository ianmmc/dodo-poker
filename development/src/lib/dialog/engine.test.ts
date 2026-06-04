import { describe, it, expect, beforeEach } from 'vitest'
import {
  getApproachNodes, getPreHandNode, getPatternReveal, getGamblersReveal,
  getTable1bAssessment, getHankRetroAssessment,
  getSurveillanceRoomIntro, getSurveillanceRoomReturn,
  getLuckyDue, getNode, getChain,
  getTie1BNodes, getTie1ANode,
  restoreFiredOnce, clearFiredOnce, getFiredOnce, markFiredOnce,
  TABLE_1B_SURV_THRESHOLD, TABLE_1B_HANK_RETRO_THRESHOLD, TABLE_1B_GATE_THRESHOLD,
} from './engine'

beforeEach(() => {
  clearFiredOnce()
})

describe('getNode', () => {
  it('returns a node by ID', () => {
    const n = getNode('t1a-approach-001')
    expect(n).not.toBeNull()
    expect(n?.id).toBe('t1a-approach-001')
  })

  it('returns null for unknown IDs', () => {
    expect(getNode('does-not-exist')).toBeNull()
  })
})

describe('getChain', () => {
  it('returns a sequence of nodes from a starting ID', () => {
    const chain = getChain('t1a-approach-001')
    expect(chain.length).toBeGreaterThan(0)
    expect(chain[0].id).toBe('t1a-approach-001')
  })

  it('stops at returnToGame', () => {
    const chain = getChain('t1a-approach-001')
    const last = chain[chain.length - 1]
    expect(last.followUp.returnToGame).toBe(true)
  })

  it('stops at a non-none responseType', () => {
    const chain = getChain('t1a-pattern-001')
    const last = chain[chain.length - 1]
    expect(last.responseType).not.toBe('none')
  })

  it('returns empty array for unknown IDs', () => {
    expect(getChain('no-such-node')).toEqual([])
  })
})

describe('getApproachNodes', () => {
  it('returns a non-empty chain starting from t1a-approach-001', () => {
    const nodes = getApproachNodes()
    expect(nodes.length).toBeGreaterThan(0)
    expect(nodes[0].id).toBe('t1a-approach-001')
  })
})

describe('getPreHandNode', () => {
  it('returns t1a-hand-1-pre for hand 1', () => {
    const n = getPreHandNode(1)
    expect(n?.id).toBe('t1a-hand-1-pre')
  })

  it('returns a pool node for hand > 1 (or null for silent draw)', () => {
    // fromPool may return null (silent node) — just verify it doesn't throw
    for (let i = 0; i < 10; i++) {
      const n = getPreHandNode(2)
      expect(n === null || typeof n.id === 'string').toBe(true)
    }
  })
})

describe('getPatternReveal — firedOnce guard', () => {
  it('fires at handsPlayed >= 3 and marks firedOnce', () => {
    const nodes = getPatternReveal(3)
    expect(nodes.length).toBeGreaterThan(0)
    expect(getFiredOnce()).toContain('t1a-pattern-001')
  })

  it('does not fire again after first trigger', () => {
    getPatternReveal(3)
    expect(getPatternReveal(10)).toEqual([])
  })

  it('does not fire below threshold', () => {
    expect(getPatternReveal(2)).toEqual([])
    expect(getFiredOnce()).not.toContain('t1a-pattern-001')
  })

  it('fires again after clearFiredOnce', () => {
    getPatternReveal(3)
    clearFiredOnce()
    expect(getPatternReveal(3).length).toBeGreaterThan(0)
  })
})

describe('getGamblersReveal — firedOnce guard', () => {
  it('fires at handsPlayed >= 8', () => {
    expect(getGamblersReveal(8).length).toBeGreaterThan(0)
  })

  it('does not fire twice', () => {
    getGamblersReveal(8)
    expect(getGamblersReveal(10)).toEqual([])
  })

  it('does not fire below threshold', () => {
    expect(getGamblersReveal(7)).toEqual([])
  })
})

describe('getHankRetroAssessment — firedOnce guard', () => {
  it('fires at handsAt1B >= 14 with surveillance visited', () => {
    expect(getHankRetroAssessment(14, true).length).toBeGreaterThan(0)
  })

  it('does not fire without surveillance room visit', () => {
    expect(getHankRetroAssessment(14, false)).toEqual([])
  })

  it('does not fire below threshold', () => {
    expect(getHankRetroAssessment(13, true)).toEqual([])
  })

  it('does not fire twice', () => {
    getHankRetroAssessment(14, true)
    expect(getHankRetroAssessment(20, true)).toEqual([])
  })
})

describe('getTable1bAssessment — firedOnce guard', () => {
  it('fires at handsAt1B >= 18 with surveillance visited', () => {
    expect(getTable1bAssessment(18, true).length).toBeGreaterThan(0)
  })

  it('does not fire without surveillance room', () => {
    expect(getTable1bAssessment(18, false)).toEqual([])
  })

  it('does not fire twice', () => {
    getTable1bAssessment(18, true)
    expect(getTable1bAssessment(20, true)).toEqual([])
  })
})

describe('TABLE_1B threshold constants are exported and consistent', () => {
  it('SURV < HANK_RETRO < GATE', () => {
    expect(TABLE_1B_SURV_THRESHOLD).toBeLessThan(TABLE_1B_HANK_RETRO_THRESHOLD)
    expect(TABLE_1B_HANK_RETRO_THRESHOLD).toBeLessThan(TABLE_1B_GATE_THRESHOLD)
  })

  it('functions respect the exported thresholds', () => {
    expect(getSurveillanceRoomIntro(TABLE_1B_SURV_THRESHOLD - 1)).toEqual([])
    expect(getSurveillanceRoomIntro(TABLE_1B_SURV_THRESHOLD).length).toBeGreaterThan(0)
    clearFiredOnce()
    expect(getHankRetroAssessment(TABLE_1B_HANK_RETRO_THRESHOLD - 1, true)).toEqual([])
    expect(getHankRetroAssessment(TABLE_1B_HANK_RETRO_THRESHOLD, true).length).toBeGreaterThan(0)
    clearFiredOnce()
    expect(getTable1bAssessment(TABLE_1B_GATE_THRESHOLD - 1, true)).toEqual([])
    expect(getTable1bAssessment(TABLE_1B_GATE_THRESHOLD, true).length).toBeGreaterThan(0)
  })
})

describe('restoreFiredOnce / getFiredOnce', () => {
  it('restores IDs that prevent re-firing', () => {
    restoreFiredOnce(['t1a-pattern-001'])
    expect(getPatternReveal(10)).toEqual([])
  })

  it('getFiredOnce returns all fired IDs', () => {
    markFiredOnce('t1a-pattern-001')
    markFiredOnce('t1a-fallacy-001')
    expect(getFiredOnce()).toContain('t1a-pattern-001')
    expect(getFiredOnce()).toContain('t1a-fallacy-001')
  })
})

describe('getTie1BNodes — first-occurrence teaching chain, then brief pool', () => {
  it('first call returns the full 3-node chain and marks firedOnce', () => {
    const nodes = getTie1BNodes()
    expect(nodes.length).toBe(3)
    expect(nodes[0].id).toBe('t1b-tie-first-001')
    expect(getFiredOnce()).toContain('t1b-tie-first-001')
  })

  it('second call returns a brief pool node (not the full chain)', () => {
    getTie1BNodes()  // first — already fires in beforeEach-cleared state
    clearFiredOnce()
    getTie1BNodes()  // first call in clean state
    const second = getTie1BNodes()
    // second call: firedOnce is set, falls through to pool
    expect(second.length).toBeLessThanOrEqual(1)
  })

  it('after clearFiredOnce, fires the full chain again', () => {
    getTie1BNodes()
    clearFiredOnce()
    expect(getTie1BNodes().length).toBe(3)
  })
})

describe('getTie1ANode — brief pool or null', () => {
  it('returns a node or null (pool may select silent node)', () => {
    // Run many times to confirm no crash and result is always DialogNode or null
    for (let i = 0; i < 20; i++) {
      const n = getTie1ANode()
      expect(n === null || typeof n.id === 'string').toBe(true)
    }
  })
})
