import { describe, it, expect } from 'vitest'
import { evaluateHand, pickWinner } from './hand'

describe('evaluateHand', () => {
  it('identifies a royal flush as straight flush (pokersolver does not distinguish)', () => {
    expect(evaluateHand(['As', 'Ks', 'Qs', 'Js', 'Ts']).name).toBe('Straight Flush')
  })

  it('identifies a straight flush', () => {
    expect(evaluateHand(['9s', '8s', '7s', '6s', '5s']).name).toBe('Straight Flush')
  })

  it('identifies four of a kind', () => {
    expect(evaluateHand(['As', 'Ah', 'Ad', 'Ac', '2s']).name).toBe('Four of a Kind')
  })

  it('identifies a full house', () => {
    expect(evaluateHand(['As', 'Ah', 'Ad', 'Ks', 'Kh']).name).toBe('Full House')
  })

  it('identifies a flush', () => {
    expect(evaluateHand(['As', 'Ks', 'Js', '9s', '5s']).name).toBe('Flush')
  })

  it('identifies a straight', () => {
    expect(evaluateHand(['As', 'Kh', 'Qd', 'Jc', 'Ts']).name).toBe('Straight')
  })

  it('identifies three of a kind', () => {
    expect(evaluateHand(['As', 'Ah', 'Ad', '2s', '3h']).name).toBe('Three of a Kind')
  })

  it('identifies two pair', () => {
    expect(evaluateHand(['As', 'Ah', 'Ks', 'Kh', '2s']).name).toBe('Two Pair')
  })

  it('identifies a pair', () => {
    expect(evaluateHand(['As', 'Ah', '2s', '5d', '9c']).name).toBe('Pair')
  })

  it('identifies a high card hand', () => {
    expect(evaluateHand(['2s', '5h', '7d', '9c', 'Jh']).name).toBe('High Card')
  })

  it('identifies a wheel (A-2-3-4-5 straight)', () => {
    expect(evaluateHand(['As', '2h', '3d', '4c', '5s']).name).toBe('Straight')
  })
})

describe('pickWinner', () => {
  it('player wins with stronger hand', () => {
    expect(pickWinner(
      ['As', 'Ah', 'Ad', 'Ac', '2s'], // four aces
      ['Ks', 'Kh', 'Kd', 'Kc', 'As']  // four kings
    )).toBe('player')
  })

  it('opponent wins with stronger hand', () => {
    expect(pickWinner(
      ['2s', '3h', '4d', '5c', '7h'],  // high card
      ['2h', '3s', '4c', '5d', '6h']   // straight
    )).toBe('opponent')
  })

  it('detects a tie between equal hands', () => {
    expect(pickWinner(
      ['As', 'Ks', 'Qs', 'Js', 'Ts'], // royal flush
      ['Ad', 'Kd', 'Qd', 'Jd', 'Td']  // royal flush
    )).toBe('tie')
  })

  it('flush beats straight', () => {
    expect(pickWinner(
      ['2s', '5s', '7s', '9s', 'Js'],  // flush
      ['2h', '3s', '4d', '5c', '6h']   // straight
    )).toBe('player')
  })
})
