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
