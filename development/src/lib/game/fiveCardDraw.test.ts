import { describe, it, expect } from 'vitest'
import { createGame, startHand, startScriptedHand, playerCheck, playerCheckNpcCheck, playerBet, playerCall, playerFold, playerDraw, npcFold } from './fiveCardDraw'
import { hank } from './npc'
import { getScriptedDeal } from './scriptedHands'

const npcDecider = hank.decideDraw.bind(hank)

describe('startHand', () => {
  it('deals 5 cards to each player', () => {
    const state = startHand(createGame())
    expect(state.playerHand).toHaveLength(5)
    expect(state.npcHand).toHaveLength(5)
  })

  it('no card appears in both hands', () => {
    const state = startHand(createGame())
    const allCards = [...state.playerHand, ...state.npcHand]
    expect(new Set(allCards).size).toBe(10)
  })

  it('takes the ante from both players', () => {
    const game = createGame(100, 5, 5)
    const state = startHand(game)
    expect(state.playerSeeds).toBe(95)
    expect(state.npcSeeds).toBe(95)
    expect(state.pot).toBe(10)
  })

  it('increments the hand number', () => {
    const game = createGame()
    const state = startHand(game)
    expect(state.handNumber).toBe(1)
  })

  it('leaves 42 cards in the deck after dealing', () => {
    const state = startHand(createGame())
    expect(state.deck).toHaveLength(42)
  })
})

describe('playerFold', () => {
  it('gives the pot to the NPC', () => {
    const state = startHand(createGame(100, 5, 5))
    const folded = playerFold(state)
    expect(folded.npcSeeds).toBe(state.npcSeeds + state.pot)
  })

  it('sets phase to done', () => {
    const state = startHand(createGame())
    expect(playerFold(state).phase).toBe('done')
  })

  it('records player folded in result', () => {
    const state = startHand(createGame())
    const folded = playerFold(state)
    expect(folded.result?.playerFolded).toBe(true)
    expect(folded.result?.winner).toBe('npc')
  })
})

describe('playerCheck', () => {
  it('sets npcPendingBet to true', () => {
    const state = startHand(createGame())
    expect(playerCheck(state).npcPendingBet).toBe(true)
  })

  it('adds NPC bet to pot', () => {
    const game = createGame(100, 5, 5)
    const state = startHand(game)
    const checked = playerCheck(state)
    expect(checked.pot).toBe(state.pot + game.betAmount)
    expect(checked.npcSeeds).toBe(state.npcSeeds - game.betAmount)
  })
})

describe('playerBet (round 1)', () => {
  it('moves to draw phase', () => {
    const state = startHand(createGame())
    expect(playerBet(state).phase).toBe('draw')
  })

  it('adds both player and NPC bets to pot', () => {
    const game = createGame(100, 5, 5)
    const state = startHand(game)
    const bet = playerBet(state)
    expect(bet.pot).toBe(state.pot + game.betAmount * 2)
  })
})

describe('playerCall', () => {
  it('moves to draw phase from bet1', () => {
    const state = playerCheck(startHand(createGame()))
    expect(playerCall(state).phase).toBe('draw')
  })

  it('adds call amount to pot', () => {
    const game = createGame(100, 5, 5)
    const checked = playerCheck(startHand(game))
    const called = playerCall(checked)
    expect(called.playerSeeds).toBe(checked.playerSeeds - game.betAmount)
    expect(called.pot).toBe(checked.pot + game.betAmount)
  })
})

describe('playerDraw', () => {
  it('replaces the correct number of cards', () => {
    const state = playerBet(startHand(createGame())) // goes to draw phase
    const before = [...state.playerHand]
    const drawn = playerDraw(state, [0, 2, 4], npcDecider)
    expect(drawn.playerHand).toHaveLength(5)
    // cards at indices 1 and 3 should be unchanged
    expect(drawn.playerHand[1]).toBe(before[1])
    expect(drawn.playerHand[3]).toBe(before[3])
  })

  it('keeping all cards leaves the hand unchanged', () => {
    const state = playerBet(startHand(createGame()))
    const before = [...state.playerHand]
    const drawn = playerDraw(state, [], npcDecider)
    expect(drawn.playerHand).toEqual(before)
  })

  it('moves to bet2 phase', () => {
    const state = playerBet(startHand(createGame()))
    expect(playerDraw(state, [], npcDecider).phase).toBe('bet2')
  })

  it('all 10 player + NPC cards are unique after draw', () => {
    const state = playerBet(startHand(createGame()))
    const drawn = playerDraw(state, [0, 1, 2], npcDecider)
    const all = [...drawn.playerHand, ...drawn.npcHand]
    expect(new Set(all).size).toBe(10)
  })
})

describe('npcFold', () => {
  it('gives the pot to the player', () => {
    const state = startHand(createGame(100, 5, 5))
    const folded = npcFold(state)
    expect(folded.playerSeeds).toBe(state.playerSeeds + state.pot)
    expect(folded.npcSeeds).toBe(state.npcSeeds)
  })

  it('sets phase to done', () => {
    const state = startHand(createGame())
    expect(npcFold(state).phase).toBe('done')
  })

  it('records npcFolded in result', () => {
    const state = startHand(createGame())
    const folded = npcFold(state)
    expect(folded.result?.npcFolded).toBe(true)
    expect(folded.result?.winner).toBe('player')
    expect(folded.result?.playerFolded).toBe(false)
  })

  it('pre-draw fold leaves playerHandName blank', () => {
    const state = startHand(createGame()) // phase = bet1
    const folded = npcFold(state)
    expect(folded.result?.playerHandName).toBe('')
  })

  it('post-draw fold records the evaluated player hand name', () => {
    const state = playerDraw(playerBet(startHand(createGame())), [], npcDecider) // phase = bet2
    const folded = npcFold(state)
    expect(folded.result?.playerHandName.length).toBeGreaterThan(0)
  })

  it('increments handsPlayed', () => {
    const state = startHand(createGame())
    expect(npcFold(state).handsPlayed).toBe(state.handsPlayed + 1)
  })

  it('total seeds preserved across player + NPC', () => {
    const state = startHand(createGame(100, 5, 5))
    const folded = npcFold(state)
    expect(folded.playerSeeds + folded.npcSeeds).toBe(200)
  })
})

describe('playerCheckNpcCheck', () => {
  it('moves from bet1 to draw phase', () => {
    const state = startHand(createGame())
    expect(playerCheckNpcCheck(state).phase).toBe('draw')
  })

  it('does not change pot or seeds — no money exchanged on mutual check', () => {
    const state = startHand(createGame(100, 5, 5))
    const checked = playerCheckNpcCheck(state)
    expect(checked.pot).toBe(state.pot)
    expect(checked.playerSeeds).toBe(state.playerSeeds)
    expect(checked.npcSeeds).toBe(state.npcSeeds)
  })

  it('sets npcLastAction to check and clears npcPendingBet', () => {
    const state = startHand(createGame())
    const checked = playerCheckNpcCheck(state)
    expect(checked.npcLastAction).toBe('check')
    expect(checked.npcPendingBet).toBe(false)
  })

  it('resolves to done from bet2 (showdown)', () => {
    let state = startHand(createGame())
    state = playerBet(state)            // bet1 → draw
    state = playerDraw(state, [], npcDecider)       // draw → bet2
    state = playerCheckNpcCheck(state)  // both check in bet2 → done
    expect(state.phase).toBe('done')
    expect(state.result).not.toBeNull()
    expect(['player', 'npc', 'tie']).toContain(state.result?.winner)
  })

  it('total seeds preserved after showdown via mutual check', () => {
    let state = startHand(createGame(100, 5, 5))
    state = playerBet(state)
    state = playerDraw(state, [], npcDecider)
    state = playerCheckNpcCheck(state)
    expect(state.playerSeeds + state.npcSeeds).toBe(200)
  })
})

describe('full hand — player wins at showdown', () => {
  it('resolves with a result and phase done', () => {
    let state = startHand(createGame())
    state = playerBet(state)         // bet1 → draw
    state = playerDraw(state, [], npcDecider)    // keep hand, draw phase → bet2
    state = playerBet(state)         // bet2 → done (showdown)
    expect(state.phase).toBe('done')
    expect(state.result).not.toBeNull()
    expect(['player', 'npc', 'tie']).toContain(state.result?.winner)
  })

  it('total seeds across player + NPC equals starting amount', () => {
    let state = startHand(createGame(100, 5, 5))
    state = playerBet(state)
    state = playerDraw(state, [], npcDecider)
    state = playerBet(state)
    expect(state.playerSeeds + state.npcSeeds).toBe(200)
  })
})

describe('startScriptedHand', () => {
  it('deals exactly the scripted cards to player and NPC', () => {
    const deal = getScriptedDeal('t1a-script-strong')!
    const state = startScriptedHand(createGame(), deal)
    expect(state.playerHand).toEqual(deal.playerCards)
    expect(state.npcHand).toEqual(deal.npcCards)
  })

  it('scripted cards do not appear in the remaining deck', () => {
    const deal = getScriptedDeal('t1a-script-strong')!
    const state = startScriptedHand(createGame(), deal)
    const allUsed = new Set([...deal.playerCards, ...deal.npcCards])
    for (const card of state.deck) {
      expect(allUsed.has(card)).toBe(false)
    }
  })

  it('total card count is 52', () => {
    const deal = getScriptedDeal('t1a-script-strong')!
    const state = startScriptedHand(createGame(), deal)
    const total = state.playerHand.length + state.npcHand.length + state.deck.length
    expect(total).toBe(52)
  })
})

describe('getScriptedDeal', () => {
  it('returns null for unknown script IDs', () => {
    expect(getScriptedDeal('no-such-script')).toBeNull()
  })

  it('returns a deal for known scripts', () => {
    const deal = getScriptedDeal('t1a-script-strong')
    expect(deal).not.toBeNull()
    expect(deal?.playerCards).toHaveLength(5)
    expect(deal?.npcCards).toHaveLength(5)
  })
})
