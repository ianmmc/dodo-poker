import { describe, it, expect } from 'vitest'
import { makeDeck, shuffle, cardToSvgPath } from './card'

describe('makeDeck', () => {
  it('produces 52 unique cards', () => {
    const deck = makeDeck()
    expect(deck).toHaveLength(52)
    expect(new Set(deck).size).toBe(52)
  })

  it('contains exactly 13 cards of each suit', () => {
    const deck = makeDeck()
    expect(deck.filter(c => c.endsWith('s'))).toHaveLength(13)
    expect(deck.filter(c => c.endsWith('h'))).toHaveLength(13)
    expect(deck.filter(c => c.endsWith('d'))).toHaveLength(13)
    expect(deck.filter(c => c.endsWith('c'))).toHaveLength(13)
  })

  it('contains all four suits for every rank', () => {
    const deck = makeDeck()
    for (const rank of ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']) {
      const cards = deck.filter(c => c.startsWith(rank))
      expect(cards).toHaveLength(4)
    }
  })
})

describe('shuffle', () => {
  it('preserves all 52 cards', () => {
    const deck = makeDeck()
    const shuffled = shuffle(deck)
    expect(shuffled).toHaveLength(52)
    expect(new Set(shuffled).size).toBe(52)
  })

  it('does not mutate the original array', () => {
    const deck = makeDeck()
    const original = [...deck]
    shuffle(deck)
    expect(deck).toEqual(original)
  })

  it('contains the same cards as the original', () => {
    const deck = makeDeck()
    const shuffled = shuffle(deck)
    expect([...shuffled].sort()).toEqual([...deck].sort())
  })
})

describe('cardToSvgPath', () => {
  it('maps ace of spades correctly', () => {
    expect(cardToSvgPath('As')).toBe('/svg-cards/ace_of_spades.svg')
  })

  it('maps 10 correctly', () => {
    expect(cardToSvgPath('Th')).toBe('/svg-cards/10_of_hearts.svg')
  })

  it('maps face cards correctly', () => {
    expect(cardToSvgPath('Kd')).toBe('/svg-cards/king_of_diamonds.svg')
    expect(cardToSvgPath('Qc')).toBe('/svg-cards/queen_of_clubs.svg')
    expect(cardToSvgPath('Js')).toBe('/svg-cards/jack_of_spades.svg')
  })

  it('maps number cards correctly', () => {
    expect(cardToSvgPath('2d')).toBe('/svg-cards/2_of_diamonds.svg')
    expect(cardToSvgPath('9s')).toBe('/svg-cards/9_of_spades.svg')
  })
})
