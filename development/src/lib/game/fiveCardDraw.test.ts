import { describe, it, expect } from 'vitest'
import { createGame, startHand, startScriptedHand, playerCheck, playerCheckNpcCheck, playerBet, playerCall, playerFold, playerDraw, npcFold, npcOpensBet, npcOpensCheck } from './fiveCardDraw'
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

  it('sets callAmount to betAmount so player knows the call cost', () => {
    const game = createGame(100, 5, 5)
    const checked = playerCheck(startHand(game))
    expect(checked.callAmount).toBe(game.betAmount)
  })
})

describe('startHand / createGame callAmount initialisation', () => {
  it('callAmount starts at 0', () => {
    expect(createGame().callAmount).toBe(0)
  })

  it('startHand resets callAmount to 0', () => {
    const g = createGame()
    const mid = { ...g, callAmount: 5 }  // simulate a mid-hand value
    expect(startHand(mid).callAmount).toBe(0)
  })
})

describe('playerCall uses callAmount', () => {
  it('deducts callAmount from playerSeeds, not betAmount directly', () => {
    const game = createGame(100, 5, 5)
    const checked = playerCheck(startHand(game))   // callAmount = betAmount = 5
    const called = playerCall(checked)
    expect(called.playerSeeds).toBe(checked.playerSeeds - checked.callAmount)
    expect(called.callAmount).toBe(0)
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

describe('npcDiscardIndices — animation support', () => {
  it('starts at [] from createGame', () => {
    expect(createGame().npcDiscardIndices).toEqual([])
  })

  it('startHand resets to []', () => {
    const g = createGame()
    const mid = { ...g, npcDiscardIndices: [3, 4] }
    expect(startHand(mid).npcDiscardIndices).toEqual([])
  })

  it('playerDraw stores the NPC discard indices', () => {
    const state = playerBet(startHand(createGame()))
    const drawn = playerDraw(state, [], npcDecider)
    // npcDiscardIndices length matches npcDrawCount
    expect(drawn.npcDiscardIndices.length).toBe(drawn.npcDrawCount)
  })

  it('npcDiscardIndices are valid slot indices (0–4)', () => {
    const state = playerBet(startHand(createGame()))
    const drawn = playerDraw(state, [], npcDecider)
    for (const idx of drawn.npcDiscardIndices) {
      expect(idx).toBeGreaterThanOrEqual(0)
      expect(idx).toBeLessThanOrEqual(4)
    }
  })

  it('each discard index appears at most once', () => {
    const state = playerBet(startHand(createGame()))
    const drawn = playerDraw(state, [], npcDecider)
    expect(new Set(drawn.npcDiscardIndices).size).toBe(drawn.npcDiscardIndices.length)
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

// ── Betting rotation ─────────────────────────────────────────────────────────
// Design principle: rotation is controlled entirely by noDraw + npcActsFirst
// in GameState. Future variants with different rotation rules (e.g. dealer-
// button position, fixed opener) set these fields accordingly — the action
// functions are agnostic to who is opening.

describe('rotation — Tables 1A and 1B (noDraw=false: no rotation)', () => {
  it('noDraw defaults to false on createGame', () => {
    expect(createGame().noDraw).toBe(false)
  })

  it('npcActsFirst defaults to false on createGame', () => {
    expect(createGame().npcActsFirst).toBe(false)
  })

  it('startHand preserves noDraw=false and sets npcActsFirst=false', () => {
    const g = startHand(createGame())
    expect(g.noDraw).toBe(false)
    expect(g.npcActsFirst).toBe(false)
  })

  it('player always opens when noDraw=false regardless of hand number', () => {
    let g = createGame()
    for (let i = 0; i < 6; i++) {
      g = startHand(g)
      expect(g.npcActsFirst).toBe(false)
    }
  })
})

describe('rotation — Table 2A (noDraw=true: odd/even alternation)', () => {
  function makeTable2AGame() {
    return { ...createGame(), noDraw: true }
  }

  it('hand 1 (odd): NPC acts first', () => {
    const g = startHand(makeTable2AGame())
    expect(g.handNumber).toBe(1)
    expect(g.npcActsFirst).toBe(true)
  })

  it('hand 2 (even): player acts first', () => {
    let g = startHand(makeTable2AGame())  // hand 1 (odd → NPC first)
    g = startHand(g)                      // hand 2 (even → player first)
    expect(g.handNumber).toBe(2)
    expect(g.npcActsFirst).toBe(false)
  })

  it('hand 3 (odd): NPC acts first again', () => {
    let g = startHand(makeTable2AGame())  // hand 1
    g = startHand(g)                      // hand 2
    g = startHand(g)                      // hand 3
    expect(g.handNumber).toBe(3)
    expect(g.npcActsFirst).toBe(true)
  })

  it('alternation continues correctly for 10 hands', () => {
    let g = makeTable2AGame()
    for (let i = 1; i <= 10; i++) {
      g = startHand(g)
      const expectedNpcFirst = i % 2 === 1  // NPC first on odd hands
      expect(g.npcActsFirst).toBe(expectedNpcFirst)
    }
  })
})

describe('noDraw phase transitions', () => {
  it('bet1 → done (no draw phase) when noDraw=true', () => {
    const g = { ...startHand(createGame()), noDraw: true }
    const afterBet = playerBet(g)
    expect(afterBet.phase).toBe('done')
  })

  it('bet1 → draw when noDraw=false (normal Five Card Draw)', () => {
    const g = startHand(createGame())  // noDraw=false by default
    const afterBet = playerBet(g)
    expect(afterBet.phase).toBe('draw')
  })

  it('mutual check in bet1 → done when noDraw=true', () => {
    const g = { ...startHand(createGame()), noDraw: true }
    const afterCheck = playerCheckNpcCheck(g)
    expect(afterCheck.phase).toBe('done')
  })

  it('mutual check in bet1 → draw when noDraw=false', () => {
    const g = startHand(createGame())
    const afterCheck = playerCheckNpcCheck(g)
    expect(afterCheck.phase).toBe('draw')
  })

  it('player call in bet1 → done when noDraw=true', () => {
    const g = { ...startHand(createGame()), noDraw: true }
    const withPendingBet = playerCheck(g)   // NPC bets, player must call
    const afterCall = playerCall(withPendingBet)
    expect(afterCall.phase).toBe('done')
  })

  it('seeds preserved after noDraw showdown', () => {
    const g = { ...startHand(createGame(100, 5, 5)), noDraw: true }
    const result = playerBet(g)
    expect(result.playerSeeds + result.npcSeeds).toBe(200)
  })
})

describe('npcOpensBet / npcOpensCheck (rotation support)', () => {
  it('npcOpensBet sets npcPendingBet and callAmount', () => {
    const g = startHand(createGame())
    const after = npcOpensBet(g, 10)
    expect(after.npcPendingBet).toBe(true)
    expect(after.callAmount).toBe(10)
    expect(after.pot).toBe(g.pot + 10)
    expect(after.npcSeeds).toBe(g.npcSeeds - 10)
  })

  it('npcOpensCheck clears npcPendingBet', () => {
    const g = startHand(createGame())
    const after = npcOpensCheck(g)
    expect(after.npcPendingBet).toBe(false)
    expect(after.callAmount).toBe(0)
    expect(after.npcLastAction).toBe('check')
  })
})
