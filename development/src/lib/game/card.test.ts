import { describe, it, expect } from 'vitest'
import { makeDeck, shuffle, cardToSvgPath, cardAltText } from './card'

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

// AX-05: screen reader alt text must be human-readable, not machine code
describe('cardAltText', () => {
  it('produces full English names for face cards', () => {
    expect(cardAltText('Ah')).toBe('Ace of Hearts')
    expect(cardAltText('Ks')).toBe('King of Spades')
    expect(cardAltText('Qd')).toBe('Queen of Diamonds')
    expect(cardAltText('Jc')).toBe('Jack of Clubs')
  })

  it('names Ten correctly', () => {
    expect(cardAltText('Th')).toBe('Ten of Hearts')
  })

  it('names number cards correctly', () => {
    expect(cardAltText('2c')).toBe('Two of Clubs')
    expect(cardAltText('9d')).toBe('Nine of Diamonds')
    expect(cardAltText('5s')).toBe('Five of Spades')
  })

  it('covers all suits', () => {
    expect(cardAltText('Ah')).toContain('Hearts')
    expect(cardAltText('As')).toContain('Spades')
    expect(cardAltText('Ad')).toContain('Diamonds')
    expect(cardAltText('Ac')).toContain('Clubs')
  })

  it('produces text that does not contain raw card codes', () => {
    // No raw rank char ('A','T','K') or suit char ('h','s','d','c') as standalone words
    const result = cardAltText('Th')
    expect(result).not.toMatch(/\bTh?\b/)
    expect(result).toBe('Ten of Hearts')
  })
})
