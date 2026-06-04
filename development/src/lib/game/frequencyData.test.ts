import { describe, it, expect } from 'vitest'
import { createFrequencyData, updateFrequencyData, freqPct } from './frequencyData'

describe('createFrequencyData', () => {
  it('initialises all counts to zero', () => {
    const d = createFrequencyData()
    expect(d.highCard).toBe(0)
    expect(d.onePair).toBe(0)
    expect(d.twoPair).toBe(0)
    expect(d.threeOfAKind).toBe(0)
    expect(d.straight).toBe(0)
    expect(d.flush).toBe(0)
    expect(d.fullHouse).toBe(0)
    expect(d.fourOfAKind).toBe(0)
    expect(d.straightFlush).toBe(0)
    expect(d.wins).toBe(0)
    expect(d.losses).toBe(0)
    expect(d.ties).toBe(0)
    expect(d.folds).toBe(0)
    expect(d.total).toBe(0)
  })
})

describe('updateFrequencyData — hand names from pokersolver', () => {
  it('maps "Pair" to onePair', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Pair', 'win')
    expect(d.onePair).toBe(1)
  })

  it('maps "Two Pair" to twoPair', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Two Pair', 'win')
    expect(d.twoPair).toBe(1)
  })

  it('maps "Three of a Kind" to threeOfAKind', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Three of a Kind', 'win')
    expect(d.threeOfAKind).toBe(1)
  })

  it('maps "Straight" to straight', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Straight', 'win')
    expect(d.straight).toBe(1)
  })

  it('maps "Flush" to flush', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Flush', 'win')
    expect(d.flush).toBe(1)
  })

  it('maps "Full House" to fullHouse', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Full House', 'win')
    expect(d.fullHouse).toBe(1)
  })

  it('maps "Four of a Kind" to fourOfAKind', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Four of a Kind', 'win')
    expect(d.fourOfAKind).toBe(1)
  })

  it('maps "Straight Flush" to straightFlush', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Straight Flush', 'win')
    expect(d.straightFlush).toBe(1)
  })

  it('maps "High Card" to highCard', () => {
    const d = updateFrequencyData(createFrequencyData(), 'High Card', 'loss')
    expect(d.highCard).toBe(1)
  })

  it('unknown hand name does not increment any hand bucket', () => {
    const d = updateFrequencyData(createFrequencyData(), '', 'win')
    expect(d.onePair + d.highCard + d.straight).toBe(0)
    expect(d.wins).toBe(1)
  })
})

describe('updateFrequencyData — outcomes', () => {
  it('increments wins on win', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Pair', 'win')
    expect(d.wins).toBe(1)
    expect(d.losses).toBe(0)
  })

  it('increments losses on loss', () => {
    const d = updateFrequencyData(createFrequencyData(), 'High Card', 'loss')
    expect(d.losses).toBe(1)
    expect(d.wins).toBe(0)
  })

  it('increments ties on tie', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Pair', 'tie')
    expect(d.ties).toBe(1)
  })

  it('fold: increments folds, does not touch hand buckets', () => {
    const d = updateFrequencyData(createFrequencyData(), '', 'fold')
    expect(d.folds).toBe(1)
    expect(d.wins).toBe(0)
    expect(d.onePair).toBe(0)
  })

  it('always increments total regardless of outcome', () => {
    let d = createFrequencyData()
    d = updateFrequencyData(d, 'Pair', 'win')
    d = updateFrequencyData(d, 'High Card', 'loss')
    d = updateFrequencyData(d, '', 'fold')
    expect(d.total).toBe(3)
  })

  it('accumulates correctly over multiple hands', () => {
    let d = createFrequencyData()
    d = updateFrequencyData(d, 'Pair', 'win')
    d = updateFrequencyData(d, 'Pair', 'loss')
    d = updateFrequencyData(d, 'Two Pair', 'win')
    expect(d.onePair).toBe(2)
    expect(d.twoPair).toBe(1)
    expect(d.wins).toBe(2)
    expect(d.losses).toBe(1)
    expect(d.total).toBe(3)
  })
})

describe('updateFrequencyData — tie outcome', () => {
  it('increments ties count on tie outcome', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Pair', 'tie')
    expect(d.ties).toBe(1)
    expect(d.total).toBe(1)
  })

  it('does not increment wins or losses on a tie', () => {
    const d = updateFrequencyData(createFrequencyData(), 'Pair', 'tie')
    expect(d.wins).toBe(0)
    expect(d.losses).toBe(0)
  })

  it('accumulates multiple ties', () => {
    let d = createFrequencyData()
    d = updateFrequencyData(d, 'Pair', 'tie')
    d = updateFrequencyData(d, 'High Card', 'tie')
    expect(d.ties).toBe(2)
    expect(d.total).toBe(2)
  })

  it('ties > 0 signals the Tie row should appear in the frequency table', () => {
    const d = createFrequencyData()
    expect(d.ties).toBe(0)
    const after = updateFrequencyData(d, 'Pair', 'tie')
    expect(after.ties).toBeGreaterThan(0)
  })
})

describe('freqPct', () => {
  it('returns "—" when total is zero', () => {
    expect(freqPct(0, 0)).toBe('—')
  })

  it('computes percentage to one decimal place', () => {
    expect(freqPct(1, 4)).toBe('25.0%')
    expect(freqPct(10, 50)).toBe('20.0%')
  })

  it('returns 100.0% when count equals total', () => {
    expect(freqPct(5, 5)).toBe('100.0%')
  })

  it('returns 0.0% when count is zero', () => {
    expect(freqPct(0, 10)).toBe('0.0%')
  })
})
