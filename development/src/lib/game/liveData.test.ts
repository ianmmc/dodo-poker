import { describe, it, expect } from 'vitest'
import { buildDataContext, renderTemplate, resolveKey } from './liveData'
import { createFrequencyData } from './frequencyData'
import type { FrequencyData } from './frequencyData'

function makeFreq(overrides: Partial<FrequencyData> = {}): FrequencyData {
  return { ...createFrequencyData(), ...overrides }
}

describe('buildDataContext', () => {
  it('populates count fields directly from FrequencyData', () => {
    const ctx = buildDataContext(makeFreq({ highCard: 7, onePair: 10, total: 20 }))
    expect(ctx.highCardCount).toBe(7)
    expect(ctx.onePairCount).toBe(10)
    expect(ctx.totalHands).toBe(20)
  })

  it('computes percentage as Math.round(count / total × 100)', () => {
    const ctx = buildDataContext(makeFreq({ highCard: 7, total: 20 }))
    expect(ctx.highCardPercent).toBe(35)  // round(7/20 * 100) = 35
  })

  it('rounds to nearest whole number', () => {
    const ctx = buildDataContext(makeFreq({ highCard: 7, total: 19 }))
    expect(ctx.highCardPercent).toBe(37)  // round(7/19 * 100) = round(36.84) = 37
  })

  it('returns 0% for all percentages when total is 0 (no hands played)', () => {
    const ctx = buildDataContext(createFrequencyData())
    expect(ctx.highCardPercent).toBe(0)
    expect(ctx.onePairPercent).toBe(0)
    expect(ctx.totalHands).toBe(0)
  })

  it('populates win/loss/tie/fold counts and percentages', () => {
    const ctx = buildDataContext(makeFreq({ wins: 11, losses: 8, folds: 1, total: 20 }))
    expect(ctx.winCount).toBe(11)
    expect(ctx.lossCount).toBe(8)
    expect(ctx.foldCount).toBe(1)
    expect(ctx.winPercent).toBe(55)   // round(11/20 * 100)
    expect(ctx.lossPercent).toBe(40)  // round(8/20 * 100)
  })

  it('includes all nine hand type counts', () => {
    const freq = makeFreq({
      highCard: 1, onePair: 2, twoPair: 3, threeOfAKind: 4,
      straight: 5, flush: 6, fullHouse: 7, fourOfAKind: 8, straightFlush: 9,
      total: 45,
    })
    const ctx = buildDataContext(freq)
    expect(ctx.highCardCount).toBe(1)
    expect(ctx.onePairCount).toBe(2)
    expect(ctx.twoPairCount).toBe(3)
    expect(ctx.threeOfAKindCount).toBe(4)
    expect(ctx.straightCount).toBe(5)
    expect(ctx.flushCount).toBe(6)
    expect(ctx.fullHouseCount).toBe(7)
    expect(ctx.fourOfAKindCount).toBe(8)
    expect(ctx.straightFlushCount).toBe(9)
  })
})

describe('renderTemplate', () => {
  it('substitutes a single known key', () => {
    const ctx = buildDataContext(makeFreq({ highCard: 7, total: 20 }))
    const result = renderTemplate('You have seen {{highCardCount}} High Cards.', ctx)
    expect(result).toBe('You have seen 7 High Cards.')
  })

  it('substitutes multiple keys in one template', () => {
    const ctx = buildDataContext(makeFreq({ highCard: 7, total: 20 }))
    const result = renderTemplate(
      'You saw {{highCardCount}} High Card hands out of {{totalHands}} total.',
      ctx
    )
    expect(result).toBe('You saw 7 High Card hands out of 20 total.')
  })

  it('substitutes a percentage key', () => {
    const ctx = buildDataContext(makeFreq({ highCard: 7, total: 20 }))
    const result = renderTemplate('Relative frequency: {{highCardPercent}}%', ctx)
    expect(result).toBe('Relative frequency: 35%')
  })

  it('leaves unknown keys unchanged rather than removing them', () => {
    const ctx = buildDataContext(createFrequencyData())
    const result = renderTemplate('Hello {{unknownKey}}', ctx)
    expect(result).toBe('Hello {{unknownKey}}')
  })

  it('handles a template with no placeholders unchanged', () => {
    const ctx = buildDataContext(createFrequencyData())
    expect(renderTemplate('No placeholders here.', ctx)).toBe('No placeholders here.')
  })
})

describe('resolveKey', () => {
  it('returns the correct value for a known key', () => {
    const ctx = buildDataContext(makeFreq({ highCard: 7, total: 20 }))
    expect(resolveKey('highCardPercent', ctx)).toBe(35)
  })

  it('returns 0 for an unrecognised key (safe default, never NaN)', () => {
    const ctx = buildDataContext(createFrequencyData())
    expect(resolveKey('nonExistentKey', ctx)).toBe(0)
    expect(isNaN(resolveKey('nonExistentKey', ctx))).toBe(false)
  })

  it('returns 0 for totalHands when no hands have been played', () => {
    const ctx = buildDataContext(createFrequencyData())
    expect(resolveKey('totalHands', ctx)).toBe(0)
  })
})

describe('live-numeric assessment scenario — Table 2A gate', () => {
  it('produces the correct answer for the t2a-assess-proc scenario', () => {
    // Student has 7 High Cards in 20 hands → 35%
    const ctx = buildDataContext(makeFreq({ highCard: 7, total: 20 }))
    const question = renderTemplate(
      'You\'ve seen {{highCardCount}} High Card hands out of {{totalHands}} total. What\'s the relative frequency as a percentage?',
      ctx
    )
    const answer = resolveKey('highCardPercent', ctx)
    expect(question).toContain('7 High Card hands out of 20 total')
    expect(answer).toBe(35)
  })

  it('never produces NaN when no hands have been played (edge case on early trigger)', () => {
    const ctx = buildDataContext(createFrequencyData())
    const answer = resolveKey('highCardPercent', ctx)
    expect(isNaN(answer)).toBe(false)
    expect(answer).toBe(0)
  })
})
