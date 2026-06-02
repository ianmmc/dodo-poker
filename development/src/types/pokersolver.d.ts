declare module 'pokersolver' {
  export class Hand {
    cards: string[]
    name: string
    rank: number
    static solve(cards: string[], game?: string, canDisqualify?: boolean): Hand
    static winners(hands: Hand[]): Hand[]
    toString(): string
  }
}
