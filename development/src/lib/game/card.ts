export type Suit = 's' | 'h' | 'd' | 'c'
export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'
export type Card = `${Rank}${Suit}`

const RANKS: readonly Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const SUITS: readonly Suit[] = ['s', 'h', 'd', 'c']

export function makeDeck(): Card[] {
  return RANKS.flatMap(rank => SUITS.map(suit => `${rank}${suit}` as Card))
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const RANK_NAMES: Record<string, string> = {
  A: 'ace', K: 'king', Q: 'queen', J: 'jack', T: '10',
  '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2'
}

const SUIT_NAMES: Record<string, string> = {
  s: 'spades', h: 'hearts', d: 'diamonds', c: 'clubs'
}

export function cardToSvgPath(card: Card): string {
  const rank = card.slice(0, -1)
  const suit = card.slice(-1)
  return `/svg-cards/${RANK_NAMES[rank]}_of_${SUIT_NAMES[suit]}.svg`
}

export const CARD_BACK_PATH = '/png-cards/back.png'

const ALT_RANK_NAMES: Record<string, string> = {
  A: 'Ace', K: 'King', Q: 'Queen', J: 'Jack', T: 'Ten',
  '9': 'Nine', '8': 'Eight', '7': 'Seven', '6': 'Six',
  '5': 'Five', '4': 'Four', '3': 'Three', '2': 'Two',
}
const ALT_SUIT_NAMES: Record<string, string> = {
  s: 'Spades', h: 'Hearts', d: 'Diamonds', c: 'Clubs',
}

/** Returns a human-readable description of a card for screen readers, e.g. "Ace of Hearts". */
export function cardAltText(card: Card): string {
  const rank = card.slice(0, -1)
  const suit = card.slice(-1)
  return `${ALT_RANK_NAMES[rank] ?? rank} of ${ALT_SUIT_NAMES[suit] ?? suit}`
}
