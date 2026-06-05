<script lang="ts">
  import { onMount } from 'svelte'
  import CardImage from './lib/components/CardImage.svelte'
  import ReferenceCard from './lib/components/ReferenceCard.svelte'
  import FrequencyTable from './lib/components/FrequencyTable.svelte'
  import SurveillanceRoom from './lib/components/SurveillanceRoom.svelte'
  import DevPanel from './lib/components/DevPanel.svelte'
  import {
    createGame, startHand, startScriptedHand,
    playerCheck, playerCheckNpcCheck, playerBet, playerCall, playerFold, playerDraw, npcFold,
    npcOpensBet, npcOpensCheck,
  } from './lib/game/fiveCardDraw'
  import type { GameState } from './lib/game/fiveCardDraw'
  import { save, load, clear } from './lib/game/storage'
  import {
    evaluateChecklist, evaluateNumeric,
    recordAssessment,
    getAssessmentLog,
    restoreAssessmentLog,
    clearAssessmentState,
  } from './lib/game/assessment'
  import {
    checkObservationRules, restoreFiredRules, getFiredRules, clearFiredRules,
  } from './lib/game/observationEngine'
  import type { HandSummary } from './lib/game/observationEngine'
  import { getScriptedDeal } from './lib/game/scriptedHands'
  import { createFrequencyData, updateFrequencyData } from './lib/game/frequencyData'
  import type { FrequencyData } from './lib/game/frequencyData'
  import { buildDataContext, renderTemplate, resolveKey } from './lib/game/liveData'
  import { hank, lucky, vivian } from './lib/game/npc'
  import { BACKUP_NPCS, getNextBackup } from './lib/game/backupNpcs'
  import type { BackupNpc } from './lib/game/backupNpcs'
  import {
    // Start of game
    getStartOfGameChain, getAvatarResponse,
    // Table 1A
    getApproachNodes, getPreHandNode, getDrawComment,
    getPostHandNode, getPatternReveal, getGamblersReveal,
    getHankActionNode, getHankDrawNode,
    // Table 1B
    getTable1bApproachNodes, getTable1bPreHandNode, getTable1bDrawComment,
    getTable1bPostHandNode, getTable1bNpcActionNode, getTable1bNpcDrawNode,

    getLuckyDue, getSurveillanceRoomIntro, getSurveillanceRoomReturn,
    getHankRetroAssessment, getTable1bAssessment,
    getTie1BNodes, getTie1ANode,
    TABLE_1B_SURV_THRESHOLD, TABLE_1B_HANK_RETRO_THRESHOLD, TABLE_1B_GATE_THRESHOLD,
    // Table 2A
    getTable2aApproachNodes, getTable2aPreHandNode, getTable2aPostHandNode,
    getTable2aNpcBetNode, getTable2aNpcActionNode,
    getVivianHotNodes, getTable2aAssessment,
    TABLE_2A_GATE_THRESHOLD,
    // Shared
    restoreFiredOnce, getFiredOnce, getNode, getChain,
    markFiredOnce, unmarkFiredOnce, clearFiredOnce,
  } from './lib/dialog/engine'
  import type { DialogNode } from './lib/dialog/engine'
  import type { DrawDecision } from './lib/game/npc'

  // Dev mode: enabled locally or via ?devmode=1
  const DEV_MODE = import.meta.env.DEV || new URLSearchParams(window.location.search).get('devmode') === '1'

  // ── Types ────────────────────────────────────────────────────────────────

  type Screen = 'title' | 'avatar' | 'intro' | 'table' | 'table1b' | 'table2a' | 'surveillance'

  interface DisplayLine {
    speaker: string
    text: string
    responseType: DialogNode['responseType']
    isNpc: boolean
    openReferenceCard?: boolean
    openSurveillanceRoom?: boolean
    assessmentNode?: DialogNode
    advanceTable?: boolean
    dealScriptedHand?: string
  }

  interface AssessmentState {
    node: DialogNode
    selectedIds: Set<string>
    numericInput: string
  }

  const AVATARS = [
    { id: 'seagull', label: 'Seagull',  desc: 'Scrappy and opportunistic.' },
    { id: 'finch',   label: 'Finch',    desc: 'Cheerful and curious.' },
    { id: 'quail',   label: 'Quail',    desc: "Calm and methodical. California's state bird." },
    { id: 'sparrow', label: 'Sparrow',  desc: 'Understated. Easy to underestimate.' },
    { id: 'crow',    label: 'Crow',     desc: 'Sharp. Remembers everything.' },
  ]

  // ── State ────────────────────────────────────────────────────────────────

  let screen: Screen = 'title'
  let avatar = ''
  let savedSession = false
  let game: GameState = createGame(100, 5, 5)
  let discardSet = new Set<number>()
  let refCardOpen = false
  let freqTableOpen = true
  let assessmentState: AssessmentState | null = null
  let gatePassedAt1A = false
  let gatePassedAt1B = false
  let gatePassedAt2A = false
  let devPanelOpen = false
  let observationLog: HandSummary[] = []
  let pendingScriptedHandId: string | null = null
  // Table 1B
  let frequencyData: FrequencyData = createFrequencyData()
  let handsAt1B = 0
  let surveillanceRoomVisited = false
  // Table 2A
  let handsAt2A = 0
  // Brief card-scatter animation played once when entering the Main Room
  let roomTransitionAnim = false
  // NPC swap system
  let currentNpcName = 'Hank'
  let usedBackupIds: string[] = []
  // Active NPC draw function — set per table so doDraw is decoupled from screen string.
  // All Table 1B NPCs (Lucky + backups) share lucky.decideDraw.
  let npcDrawDecider: (hand: Card[]) => DrawDecision = hank.decideDraw.bind(hank)

  // ── NPC discard animation ─────────────────────────────────────────────────
  // Adjust NPC_DEAL_INTERVAL_MS to tune the pacing of replacement cards.
  // NPC_SLIDE_OUT_MS must match the CSS @keyframes duration in CardImage.svelte.
  const NPC_DEAL_INTERVAL_MS  = 350
  const NPC_SLIDE_OUT_MS      = 400

  type NpcAnimPhase = 'idle' | 'sliding-out' | 'empty' | 'dealing-in'
  let npcAnimPhase: NpcAnimPhase = 'idle'
  let npcAnimDealtCount = 0          // how many replacement cards have appeared so far
  let npcAnimTimers: ReturnType<typeof setTimeout>[] = []
  // Set by doDraw() when Hank is discarding; advance() starts the animation
  // after the draw-declaration dialog ("Two.") has been dismissed.
  let pendingNpcDrawAnim = false

  function finishNpcAnim(): void {
    npcAnimPhase = 'idle'
    npcAnimDealtCount = 0
    npcAnimTimers = []
  }

  function skipNpcAnim(): void {
    if (npcAnimPhase === 'idle') return
    npcAnimTimers.forEach(t => clearTimeout(t))
    finishNpcAnim()
  }

  function startNpcDrawAnimation(): void {
    const n = game.npcDiscardIndices.length
    if (n === 0) return

    npcAnimPhase = 'sliding-out'
    npcAnimDealtCount = 0

    // After slide-out, show empty slots then deal in replacement cards.
    // Use reassignment (not .push) so Svelte 5 reactive tracking sees the change.
    const slideTimer = setTimeout(() => {
      npcAnimPhase = 'empty'

      const dealTimers = Array.from({ length: n }, (_, i) =>
        setTimeout(() => {
          npcAnimDealtCount = i + 1
          npcAnimPhase = 'dealing-in'
        }, (i + 1) * NPC_DEAL_INTERVAL_MS)
      )

      const finishTimer = setTimeout(() => {
        finishNpcAnim()
      }, n * NPC_DEAL_INTERVAL_MS + NPC_DEAL_INTERVAL_MS)

      npcAnimTimers = [...dealTimers, finishTimer]

    }, NPC_SLIDE_OUT_MS + 50)

    npcAnimTimers = [slideTimer]
  }

  // Dialog queue
  let dialogQueue: DisplayLine[] = []
  let pendingPostAssessment: DisplayLine[] = []
  $: inDialog = dialogQueue.length > 0
  $: currentLine = dialogQueue[0] ?? null

  $: if (currentLine?.openReferenceCard) refCardOpen = true

  // ── Lifecycle ────────────────────────────────────────────────────────────

  onMount(() => {
    const saved = load()
    if (saved) savedSession = true
  })

  function handleKeydown(e: KeyboardEvent) {
    if (DEV_MODE && e.ctrlKey && e.altKey && e.key === 'd') {
      e.preventDefault()
      devPanelOpen = !devPanelOpen
      return
    }
    if (e.key === 'Escape' && devPanelOpen) {
      devPanelOpen = false
      return
    }
    if ((e.key === ' ' || e.key === 'Enter') && inDialog) {
      e.preventDefault()
      advance()
    }
  }

  // ── Game outcome helpers ─────────────────────────────────────────────────

  // Outcome for post-hand routing — preserves 'tie' as a distinct value.
  // Callers use postHandNodesForOutcome() so ties route to tie-specific dialog.
  function resolveHandOutcome(result: HandResult | null): 'win' | 'loss' | 'fold' | 'tie' {
    if (!result || result.playerFolded) return 'fold'
    if (result.winner === 'player') return 'win'
    if (result.winner === 'tie') return 'tie'
    return 'loss'
  }

  // Outcome for the observation log — preserves 'tie' for streak tracking.
  function currentHandOutcome(g: GameState): HandSummary['outcome'] {
    if (!g.result || g.result.playerFolded) return 'fold'
    if (g.result.winner === 'player') return 'win'
    if (g.result.winner === 'npc') return 'loss'
    return 'tie'
  }

  // ── Dialog helpers ───────────────────────────────────────────────────────

  function interpolate(text: string, vars: Record<string, string | number>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? '?'))
  }

  function speakerLabel(speaker: string | null): string {
    if (speaker === 'chief-dodo') return 'Chief Dodo'
    if (speaker === 'hank' || speaker === 'lucky') return currentNpcName
    return 'Narrator'
  }

  function toLine(node: DialogNode, vars?: Record<string, string | number>): DisplayLine {
    const rawText = node.text ?? ''
    const isInteractive = node.responseType === 'checklist' || node.responseType === 'numeric'
    return {
      speaker: speakerLabel(node.speaker),
      text: vars ? interpolate(rawText, vars) : rawText,
      responseType: node.responseType,
      isNpc: node.speaker === 'hank' || node.speaker === 'lucky',
      openReferenceCard: node.followUp.openReferenceCard === true,
      openSurveillanceRoom: node.followUp.openSurveillanceRoom === true,
      assessmentNode: isInteractive ? node : undefined,
      advanceTable: node.followUp.advanceTable === true,
      dealScriptedHand: node.followUp.dealScriptedHand,
    }
  }

  // Resolve a live-numeric node into a concrete numeric node using the current
  // frequency table. Called at enqueue time so the assessment system always
  // receives a fully-populated node with text and correctAnswer filled in.
  function resolveLiveNode(node: DialogNode): DialogNode {
    if (node.responseType !== 'live-numeric') return node
    const ctx = buildDataContext(frequencyData)
    return {
      ...node,
      responseType: 'numeric',
      text: renderTemplate(node.textTemplate ?? '', ctx),
      correctAnswer: resolveKey(node.correctAnswerKey ?? '', ctx),
    }
  }

  function enqueue(nodes: (DialogNode | null)[], vars?: Record<string, string | number>): void {
    const lines = nodes
      .filter((n): n is DialogNode => n !== null)
      .map(n => resolveLiveNode(n))
      .filter(n => !n.silent && n.text !== null)
      .map(n => toLine(n, vars))
    if (lines.length) dialogQueue = [...dialogQueue, ...lines]
  }

  function advance(): void {
    const current = dialogQueue[0]
    dialogQueue = dialogQueue.slice(1)
    if (current?.advanceTable) {
      if (screen === 'table')   gatePassedAt1A = true
      if (screen === 'table1b') gatePassedAt1B = true
      if (screen === 'table2a') gatePassedAt2A = true
    }
    if (current?.openSurveillanceRoom) {
      screen = 'surveillance'
    }
    if (current?.dealScriptedHand) pendingScriptedHandId = current.dealScriptedHand
    if (current?.assessmentNode) {
      pendingPostAssessment = dialogQueue
      dialogQueue = []
      assessmentState = { node: current.assessmentNode, selectedIds: new Set(), numericInput: '' }
    }
    // Intro screen: when the last dialog node clears, go directly to Table 1A
    // without waiting for a reactive cycle (avoids rendering the table with empty queue).
    if (screen === 'intro' && dialogQueue.length === 0) sitDown()
    // NPC draw animation: fire after the draw-declaration dialog is dismissed.
    if (pendingNpcDrawAnim && dialogQueue.length === 0) {
      pendingNpcDrawAnim = false
      startNpcDrawAnimation()
    }
  }

  // ── Assessment ───────────────────────────────────────────────────────────

  function toggleChecklistOption(id: string): void {
    if (!assessmentState) return
    const s = new Set(assessmentState.selectedIds)
    s.has(id) ? s.delete(id) : s.add(id)
    assessmentState = { ...assessmentState, selectedIds: s }
  }

  function submitChecklist(): void {
    if (!assessmentState) return
    const node = assessmentState.node
    const correctIds = (node.options ?? []).filter(o => o.correct).map(o => o.id)
    const selectedIds = [...assessmentState.selectedIds]

    const result = evaluateChecklist(node.id, selectedIds, correctIds, node.feedback ?? {})

    if (result.correct || result.exhausted) {
      recordAssessment({ nodeId: node.id, responseType: 'checklist', attempts: result.attemptNumber, correct: result.correct })
      assessmentState = null
      const pending = pendingPostAssessment
      pendingPostAssessment = []
    pendingNpcDrawAnim = false
    skipNpcAnim()
      if (result.feedbackNodeId) {
        enqueue(getChain(result.feedbackNodeId), result.templateVars)
      }
      dialogQueue = [...dialogQueue, ...pending]
      doSave()
    } else {
      assessmentState = { ...assessmentState, selectedIds: new Set() }
      if (result.feedbackNodeId) {
        const feedbackNode = getNode(result.feedbackNodeId)
        if (feedbackNode) enqueue([feedbackNode], result.templateVars)
      }
    }
  }

  function submitNumeric(): void {
    if (!assessmentState) return
    const node = assessmentState.node
    const value = parseInt(assessmentState.numericInput, 10)
    if (isNaN(value)) return

    const result = evaluateNumeric(
      node.id,
      value,
      node.correctAnswer ?? 0,
      node.tolerance ?? 0,
      node.feedback ?? {}
    )

    if (result.correct || result.exhausted) {
      recordAssessment({ nodeId: node.id, responseType: 'numeric', attempts: result.attemptNumber, correct: result.correct })
      assessmentState = null
      const pending = pendingPostAssessment
      pendingPostAssessment = []
    pendingNpcDrawAnim = false
    skipNpcAnim()
      if (result.feedbackNodeId) {
        enqueue(getChain(result.feedbackNodeId), result.templateVars)
      }
      dialogQueue = [...dialogQueue, ...pending]
      doSave()
    } else {
      assessmentState = { ...assessmentState, numericInput: '' }
      if (result.feedbackNodeId) {
        const feedbackNode = getNode(result.feedbackNodeId)
        if (feedbackNode) enqueue([feedbackNode], result.templateVars)
      }
    }
  }

  // ── Screen transitions ───────────────────────────────────────────────────

  function freshStart(): void {
    clear()
    clearFiredOnce()
    clearFiredRules()
    clearAssessmentState()
    screen = 'avatar'
    enqueue([getNode('sog-002')])
  }

  function continueSession(): void {
    const saved = load()
    if (!saved) { freshStart(); return }
    avatar = saved.avatar
    restoreFiredOnce(saved.firedOnce ?? [])
    // If an assessment sequence was entered but not completed before saving
    // (e.g. quit while a checklist was showing), unmark it so it re-fires.
    const answered = new Set((saved.assessmentLog ?? []).map((r: { nodeId: string }) => r.nodeId))
    if (!answered.has('t1a-assess-hank-numeric')) unmarkFiredOnce('t1a-pattern-001')
    if (!answered.has('t1a-assess-gamblers-001')) unmarkFiredOnce('t1a-fallacy-001')
    if (!answered.has('t1b-hank-retro'))           unmarkFiredOnce('t1b-hank-retro-001')
    if (!answered.has('t1b-assess-proc'))          unmarkFiredOnce('t1b-assess-intro')
    if (!answered.has('t2a-assess-proc'))          unmarkFiredOnce('t2a-assess-intro')
    restoreAssessmentLog(saved.assessmentLog ?? [])
    restoreFiredRules(saved.firedRules ?? [])
    observationLog = saved.observationLog ?? []
    frequencyData = saved.frequencyData ?? createFrequencyData()
    handsAt1B = saved.handsAt1B ?? 0
    handsAt2A = saved.handsAt2A ?? 0
    surveillanceRoomVisited = saved.surveillanceRoomVisited ?? false
    usedBackupIds = saved.usedBackupIds ?? []
    gatePassedAt1A = (saved.assessmentLog ?? []).some(r => r.nodeId === 't1a-assess-transfer-001')
    gatePassedAt1B = (saved.assessmentLog ?? []).some(r => r.nodeId === 't1b-assess-transfer')
    gatePassedAt2A = saved.gatePassedAt2A ?? false
    game = {
      ...createGame(saved.playerSeeds, saved.betAmount, saved.ante),
      playerSeeds: saved.playerSeeds,
      npcSeeds:   saved.npcSeeds,
      handNumber:  saved.handNumber,
      handsPlayed: saved.handsPlayed,
    }
    if (gatePassedAt1B) {
      screen = 'table2a'
      npcDrawDecider = vivian.decideDraw.bind(vivian)
      currentNpcName = 'Vivian'
      game = { ...game, noDraw: true, ante: 10 }
      game = startHand(game)
      enqueue([getTable2aPreHandNode()])
    } else if (gatePassedAt1A) {
      screen = 'table1b'
      npcDrawDecider = lucky.decideDraw.bind(lucky)
      if (handsAt1B === 0) game = { ...game, npcSeeds: 200 }
      currentNpcName = saved.currentNpcName ?? 'Lucky'
      game = startHand(game)
      enqueue([getTable1bPreHandNode()])
    } else {
      currentNpcName = saved.currentNpcName ?? 'Hank'
      screen = 'table'
      npcDrawDecider = hank.decideDraw.bind(hank)
      game = startHand(game)
      enqueue(getPreHandNode(game.handNumber))
    }
  }

  function selectAvatar(id: string): void {
    avatar = id
    dialogQueue = []
    screen = 'intro'
    enqueue(getAvatarResponse(id))
  }

  function sitDown(): void {
    screen = 'table'
    game = startHand(game)
    discardSet = new Set()
    enqueue([...getApproachNodes(), getNode('t1a-house-rule'), ...getPreHandNode(game.handNumber)])
  }

  function moveToTable1B(): void {
    screen = 'table1b'
    npcDrawDecider = lucky.decideDraw.bind(lucky)
    frequencyData = createFrequencyData()
    handsAt1B = 0
    surveillanceRoomVisited = false
    currentNpcName = 'Lucky'
    usedBackupIds = []
    observationLog = []
    game = { ...game, npcSeeds: 200 }
    game = startHand(game)
    discardSet = new Set()
    enqueue([...getTable1bApproachNodes(), getTable1bPreHandNode()])
  }

  function moveToTable2A(): void {
    roomTransitionAnim = true
    setTimeout(() => { roomTransitionAnim = false }, 1600)
    screen = 'table2a'
    npcDrawDecider = vivian.decideDraw.bind(vivian)
    frequencyData = createFrequencyData()  // fresh table for 2A
    handsAt2A = 0
    currentNpcName = 'Vivian'
    observationLog = []
    // Seeds carry over; ante increases to 10 for the Main Room
    game = { ...game, noDraw: true, ante: 10, betAmount: 10 }
    game = startHand(game)
    discardSet = new Set()
    enqueue([...getTable2aApproachNodes()])
  }

  function returnFromSurveillance(): void {
    surveillanceRoomVisited = true
    screen = screen === 'table2a' ? 'table2a' : 'table1b'
    enqueue(getSurveillanceRoomReturn())
    doSave()
  }

  // ── Table-aware action helpers ───────────────────────────────────────────

  function hankActionNode(action: 'bet' | 'call'): DialogNode | null {
    return screen === 'table1b'
      ? getTable1bNpcActionNode(action)
      : getHankActionNode(action)
  }

  function hankDrawNode(count: number): DialogNode | null {
    return screen === 'table1b'
      ? getTable1bNpcDrawNode(count)
      : getHankDrawNode(count)
  }

  function postHandNode(outcome: 'win' | 'loss' | 'fold'): DialogNode | null {
    if (screen === 'table2a') return getTable2aPostHandNode(outcome)
    return screen === 'table1b'
      ? getTable1bPostHandNode(outcome)
      : getPostHandNode(outcome)
  }

  // Returns the correct dialog node(s) for any outcome, routing ties to their
  // own first-occurrence chain or subsequent pool.
  function postHandNodesForOutcome(outcome: 'win' | 'loss' | 'fold' | 'tie'): (DialogNode | null)[] {
    if (outcome === 'tie') {
      return screen === 'table1b' ? getTie1BNodes() : [getTie1ANode()]
    }
    return [postHandNode(outcome)]
  }

  function drawCommentNode(count: number): DialogNode | null {
    return screen === 'table1b'
      ? getTable1bDrawComment(count)
      : getDrawComment(count)
  }

  // ── Table 1B / 2A NPC streak helpers ────────────────────────────────────────

  // Returns NPC consecutive win count (= player's consecutive losses).
  function getNpcConsecutiveWins(): number {
    const recent = observationLog.slice(-2)
    if (recent.length === 2 && recent.every(s => s.outcome === 'loss')) return 2
    if (recent.length >= 1 && recent[recent.length - 1].outcome === 'loss') return 1
    return 0
  }

  // Returns NPC consecutive loss count (= player's consecutive wins).
  function getNpcConsecutiveLosses(): number {
    const recent = observationLog.slice(-3)
    if (recent.length === 3 && recent.every(s => s.outcome === 'win')) return 3
    if (recent.length >= 1 && recent[recent.length - 1].outcome === 'win') return 1
    return 0
  }

  // Vivian's hot-hand streak: how many times she's won recently (= player losses).
  // Hot hand fallacy: she bets more when SHE has been winning.
  function getVivianConsecutiveWins(): number {
    const recent = observationLog.slice(-3)
    if (recent.length === 3 && recent.every(s => s.outcome === 'loss')) return 3
    if (recent.length >= 1 && recent[recent.length - 1].outcome === 'loss') return 1
    return 0
  }

  // Update frequency data immediately when a 1B or 2A hand concludes.
  function updateFreqForHand(outcome: 'win' | 'loss' | 'fold' | 'tie'): void {
    frequencyData = updateFrequencyData(
      frequencyData,
      game.result?.playerHandName ?? '',
      outcome
    )
  }

  // Swap out the busted NPC for the next backup, or reset if pool is exhausted.
  // Table 1A: Hank runs out of seeds but the lesson isn't over — refill and continue.
  function refillNpcAt1A(): void {
    game = { ...game, npcSeeds: 200 }
    game = startHand(game)
    discardSet = new Set()
    enqueue([getNode('t1a-hank-refill'), ...getPreHandNode(game.handNumber)])
    doSave()
  }

  function swapNpc(): void {
    const backup = getNextBackup(usedBackupIds)
    if (!backup) { resetGame(); return }

    const previousName = currentNpcName
    usedBackupIds = [...usedBackupIds, backup.id]
    currentNpcName = backup.name
    npcDrawDecider = lucky.decideDraw.bind(lucky)  // backups share Lucky's draw strategy
    game = { ...game, npcSeeds: 200 }
    game = startHand(game)
    discardSet = new Set()

    const introNodes: DialogNode[] = [
      { id: `swap-bust-${backup.id}`,    speaker: 'chief-dodo', text: `${previousName}'s done. No more seeds.`,                   responseType: 'none', followUp: {} },
      { id: `swap-enter-${backup.id}`,   speaker: 'chief-dodo', text: `Hold on — ${backup.name} just walked in. Good timing.`,    responseType: 'none', followUp: {} },
      { id: `swap-anec-${backup.id}`,    speaker: 'chief-dodo', text: backup.intro,                                               responseType: 'none', followUp: {} },
      { id: `swap-ready-${backup.id}`,   speaker: 'chief-dodo', text: `Alright. ${backup.name}, you're up.`,                      responseType: 'none', followUp: {} },
    ]
    const preHandNodes = screen === 'table1b' ? [getTable1bPreHandNode()] : getPreHandNode(game.handNumber)
    enqueue([...introNodes, ...preHandNodes])
    doSave()
  }

  // ── Game actions ─────────────────────────────────────────────────────────

  function doCheck(): void {
    if (screen === 'table2a') {
      // At Table 2A, player checks → Vivian responds (bet, check, or fold)
      const wins = getVivianConsecutiveWins()
      const decision = vivian.decideBet(0, game.betAmount, wins)
      if (decision.action === 'fold') {
        game = npcFold(game)
        updateFreqForHand('win')
        enqueue([getTable2aNpcActionNode('fold'), ...postHandNodesForOutcome('win')])
        doSave()
        return
      }
      if (decision.action === 'check') {
        game = playerCheckNpcCheck(game)  // noDraw → showdown
        if (game.phase === 'done' && game.result) {
          const outcome = resolveHandOutcome(game.result)
          updateFreqForHand(outcome)
          enqueue([getTable2aNpcActionNode('check'), ...postHandNodesForOutcome(outcome)])
          doSave()
        } else {
          enqueue([getTable2aNpcActionNode('check')])
        }
        return
      }
      // Vivian bets after player checks
      const amount = decision.amount
      game = playerCheck({ ...game, betAmount: amount })
      enqueue([getTable2aNpcBetNode(amount)])
      return
    }
    if (screen === 'table1b') {
      const decision = lucky.decideBet(0, game.betAmount, getNpcConsecutiveWins(), getNpcConsecutiveLosses())
      if (decision.action === 'fold') {
        game = npcFold(game)
        updateFreqForHand('win')
        enqueue([postHandNode('win')])
        doSave()
        return
      }
      if (decision.action === 'check') {
        game = playerCheckNpcCheck(game)
        if (game.phase === 'done' && game.result) {
          const outcome = resolveHandOutcome(game.result)
          updateFreqForHand(outcome)
          enqueue([getTable1bNpcActionNode('check'), ...postHandNodesForOutcome(outcome)])
          doSave()
        } else {
          enqueue([getTable1bNpcActionNode('check')])
        }
        return
      }
    }
    game = playerCheck(game)
    enqueue([hankActionNode('bet')])
  }

  // doBet accepts an optional amount for variable-bet tables (Table 2A: 5/10/20).
  // Fixed-bet tables pass no argument and use game.betAmount.
  function doBet(betAmount?: number): void {
    // Guard: Svelte passes a MouseEvent when used as on:click={doBet} directly.
    // Treat any non-number as undefined so playerBet falls back to game.betAmount.
    const amount = typeof betAmount === 'number' ? betAmount : undefined
    const npcCallNode = screen === 'table2a'
      ? getTable2aNpcActionNode('call')
      : hankActionNode('call')
    game = playerBet(game, amount)
    if (game.phase === 'done' && game.result) {
      const outcome = resolveHandOutcome(game.result)
      if (screen === 'table1b' || screen === 'table2a') updateFreqForHand(outcome)
      enqueue([npcCallNode, ...postHandNodesForOutcome(outcome)])
      doSave()
    } else {
      enqueue([npcCallNode])
    }
  }

  function doCall(): void {
    game = playerCall(game)
    if (game.phase === 'done' && game.result) {
      const outcome = resolveHandOutcome(game.result)
      if (screen === 'table1b' || screen === 'table2a') updateFreqForHand(outcome)
      enqueue(postHandNodesForOutcome(outcome))
      doSave()
    }
  }

  function doFold(): void {
    game = playerFold(game)
    if (screen === 'table1b' || screen === 'table2a') updateFreqForHand('fold')
    enqueue([postHandNode('fold')])
    doSave()
  }

  // NPC opens betting (Table 2A rotation). Vivian decides and we apply state + dialog.
  function handleNpcOpens(): void {
    const wins = getVivianConsecutiveWins()
    const decision = vivian.decideBet(0, game.betAmount, wins)
    if (decision.action === 'fold') {
      // Vivian folds before betting (rare; treat as check → both check → done)
      game = npcOpensCheck(game)
      // No-draw: both check → showdown immediately
      game = { ...game, phase: 'done' }
      // Manually resolve as a showdown
      const result = game.result  // need to trigger resolveShowdown via playerCheckNpcCheck
      // Use playerCheckNpcCheck which handles noDraw → showdown
      game = playerCheckNpcCheck({ ...game, phase: 'bet1' })
      if (game.phase === 'done' && game.result) {
        const outcome = resolveHandOutcome(game.result)
        updateFreqForHand(outcome)
        enqueue([getTable2aNpcActionNode('check'), ...postHandNodesForOutcome(outcome)])
        doSave()
      }
      return
    }
    if (decision.action === 'check') {
      game = npcOpensCheck(game)
      enqueue([getTable2aNpcActionNode('check')])
      return
    }
    // Vivian bets
    const amount = decision.amount
    game = npcOpensBet(game, amount)
    enqueue([getTable2aNpcBetNode(amount)])
  }

  function doDraw(): void {
    const indices = [...discardSet]
    discardSet = new Set()
    const drawComment = drawCommentNode(indices.length)
    game = playerDraw(game, indices, npcDrawDecider)
    // Enqueue the declaration dialog first (player's draw comment + NPC's
    // "Two." / "Three." line). Animation fires when that dialog is dismissed.
    enqueue([drawComment, hankDrawNode(game.npcDrawCount)])
    if (game.npcDiscardIndices.length > 0) pendingNpcDrawAnim = true
  }

  function toggleDiscard(idx: number): void {
    const s = new Set(discardSet)
    s.has(idx) ? s.delete(idx) : s.add(idx)
    discardSet = s
  }

  // ── Table 1A next hand ───────────────────────────────────────────────────

  function nextHand1A(): void {
    const summary: HandSummary = {
      handNumber: game.handNumber,
      drawCount: game.playerDrawCount,
      outcome: currentHandOutcome(game),
    }
    observationLog = [...observationLog.slice(-9), summary]
    doSave()  // save before startHand so phase='done' is preserved; avoids double-ante on reload

    if (pendingScriptedHandId) {
      const deal = getScriptedDeal(pendingScriptedHandId)
      game = deal ? startScriptedHand(game, deal) : startHand(game)
      pendingScriptedHandId = null
    } else {
      game = startHand(game)
    }

    discardSet = new Set()
    const observations = checkObservationRules(observationLog).flatMap(id => getChain(id))
    const pattern = getPatternReveal(game.handsPlayed)
    // Gambler's fallacy coaching requires Hank to be factually on a losing
    // streak — CD's opening line "He keeps losing" must be literally true.
    // Fallback at hand 15: fires only when Hank is NOT on a clear winning
    // streak, ensuring the coaching makes sense in context.
    const last3 = observationLog.slice(-3)
    const hankOnLoseStreak = last3.length === 3 && last3.every(s => s.outcome === 'win')
    const hankOnWinStreak  = last3.length === 3 && last3.every(s => s.outcome === 'loss')
    const gamblersFallback = game.handsPlayed >= 15 && !hankOnWinStreak
    const gamblers = (hankOnLoseStreak || gamblersFallback) ? getGamblersReveal(game.handsPlayed) : []
    const preHandNodes = getPreHandNode(game.handNumber)
    enqueue([...observations, ...pattern, ...gamblers, ...preHandNodes])
  }

  // ── Table 1B next hand ───────────────────────────────────────────────────

  function nextHand1B(): void {
    const summary: HandSummary = {
      handNumber: game.handNumber,
      drawCount: game.playerDrawCount,
      outcome: currentHandOutcome(game),
    }
    observationLog = [...observationLog.slice(-9), summary]
    // frequencyData already updated in the action handler (doBet/doCall/doFold/doCheck)
    handsAt1B++
    doSave()  // save before startHand so phase='done' is preserved; avoids double-ante on reload

    game = startHand(game)
    discardSet = new Set()

    // Progressive reveals — lucky here is the getLuckyDue dialog trigger, not the NPC
    const last3 = observationLog.slice(-3)
    const luckyConsecutiveLosses = last3.length === 3 && last3.every(s => s.outcome === 'win') ? 3 : 0
    const luckyDueNodes = getLuckyDue(luckyConsecutiveLosses)
    const surv = getSurveillanceRoomIntro(handsAt1B)
    const hankRetro = getHankRetroAssessment(handsAt1B, surveillanceRoomVisited)
    const assessment = getTable1bAssessment(handsAt1B, surveillanceRoomVisited)
    const preHand = getTable1bPreHandNode()

    enqueue([...luckyDueNodes, ...surv, ...hankRetro, ...assessment, preHand])
  }

  function nextHand2A(): void {
    const summary: HandSummary = {
      handNumber: game.handNumber,
      drawCount: 0,  // no draw at Table 2A
      outcome: currentHandOutcome(game),
    }
    observationLog = [...observationLog.slice(-9), summary]
    handsAt2A++
    doSave()

    game = startHand(game)  // noDraw persists via ...state spread
    discardSet = new Set()

    const vivianHot = getVivianHotNodes(getVivianConsecutiveWins())
    const assessment = getTable2aAssessment(handsAt2A)
    const preHand = getTable2aPreHandNode()

    enqueue([...vivianHot, ...assessment, preHand])

    // If this hand starts with NPC acting first, immediately resolve their opening decision
    if (game.npcActsFirst) handleNpcOpens()
  }

  function nextHand(): void {
    if (screen === 'table2a') nextHand2A()
    else if (screen === 'table1b') nextHand1B()
    else nextHand1A()
  }

  function resetGame(): void {
    clear()
    game = createGame(100, 5, 5)
    discardSet = new Set()
    dialogQueue = []
    assessmentState = null
    pendingPostAssessment = []
    pendingNpcDrawAnim = false
    skipNpcAnim()
    gatePassedAt1A = false
    gatePassedAt1B = false
    gatePassedAt2A = false
    observationLog = []
    pendingScriptedHandId = null
    frequencyData = createFrequencyData()
    handsAt1B = 0
    handsAt2A = 0
    surveillanceRoomVisited = false
    currentNpcName = 'Hank'
    usedBackupIds = []
    npcDrawDecider = hank.decideDraw.bind(hank)
    skipNpcAnim()
    clearFiredRules()
    clearFiredOnce()
    clearAssessmentState()
    screen = 'title'
    savedSession = false
  }

  // ── Dev tools ────────────────────────────────────────────────────────────

  function devJumpToHand(n: number): void {
    if (!avatar) avatar = 'crow'
    dialogQueue = []
    assessmentState = null
    pendingPostAssessment = []
    pendingNpcDrawAnim = false
    skipNpcAnim()

    if (screen === 'table2a') {
      handsAt2A = n
      npcDrawDecider = vivian.decideDraw.bind(vivian)
      unmarkFiredOnce('t2a-vivian-hot-001')
      if (n >= TABLE_2A_GATE_THRESHOLD) unmarkFiredOnce('t2a-assess-intro')
      game = { ...game, noDraw: true, ante: 10 }
      game = startHand(game)
      discardSet = new Set()
      const vivianHot = getVivianHotNodes(getVivianConsecutiveWins())
      const assessment = getTable2aAssessment(handsAt2A)
      const preHand = getTable2aPreHandNode()
      enqueue([...vivianHot, ...assessment, preHand])
      if (game.npcActsFirst) handleNpcOpens()
    } else if (screen === 'table1b') {
      handsAt1B = n
      npcDrawDecider = lucky.decideDraw.bind(lucky)
      unmarkFiredOnce('t1b-lucky-due')
      // Surv intro chain ends with openSurveillanceRoom — only unmark for the
      // surv-room preset; at retro/gate thresholds we're past it already.
      if (n >= TABLE_1B_SURV_THRESHOLD && n < TABLE_1B_HANK_RETRO_THRESHOLD) {
        unmarkFiredOnce('t1b-surv-intro-001')
      }
      if (n >= TABLE_1B_HANK_RETRO_THRESHOLD && n < TABLE_1B_GATE_THRESHOLD) {
        surveillanceRoomVisited = true
        unmarkFiredOnce('t1b-hank-retro-001')
      }
      if (n >= TABLE_1B_GATE_THRESHOLD) {
        surveillanceRoomVisited = true
        unmarkFiredOnce('t1b-assess-intro')
      }
      game = startHand(game)
      discardSet = new Set()
      const surv = getSurveillanceRoomIntro(handsAt1B)
      const hankRetro = getHankRetroAssessment(handsAt1B, surveillanceRoomVisited)
      const assessment = getTable1bAssessment(handsAt1B, surveillanceRoomVisited)
      const preHand = getTable1bPreHandNode()
      enqueue([...surv, ...hankRetro, ...assessment, preHand])
    } else {
      game = { ...game, handsPlayed: n }
      game = startHand(game)
      discardSet = new Set()
      // Unmark so sequences re-fire at the correct hand thresholds
      unmarkFiredOnce('t1a-pattern-001')
      unmarkFiredOnce('t1a-fallacy-001')
      const pattern = getPatternReveal(game.handsPlayed)
      const gamblers = getGamblersReveal(game.handsPlayed)
      const preHandNodes = getPreHandNode(game.handNumber)
      enqueue([...pattern, ...gamblers, ...preHandNodes])
      screen = 'table'
    }
    devPanelOpen = false
  }

  function devJumpToTable(table: string): void {
    if (!avatar) avatar = 'crow'
    dialogQueue = []
    assessmentState = null
    pendingPostAssessment = []
    pendingNpcDrawAnim = false
    skipNpcAnim()
    if (table === 'table') {
      npcDrawDecider = hank.decideDraw.bind(hank)
      unmarkFiredOnce('t1a-pattern-001')
      unmarkFiredOnce('t1a-fallacy-001')
      game = startHand(game)
      discardSet = new Set()
      enqueue(getPreHandNode(game.handNumber))
    } else if (table === 'table1b') {
      npcDrawDecider = lucky.decideDraw.bind(lucky)
      gatePassedAt1A = true
      frequencyData = createFrequencyData()
      handsAt1B = 0
      surveillanceRoomVisited = false
      currentNpcName = 'Lucky'
      usedBackupIds = []
      unmarkFiredOnce('t1b-lucky-due')
      unmarkFiredOnce('t1b-surv-intro-001')
      unmarkFiredOnce('t1b-hank-retro-001')
      unmarkFiredOnce('t1b-assess-intro')
      game = { ...game, npcSeeds: 200 }
      game = startHand(game)
      discardSet = new Set()
      enqueue([...getTable1bApproachNodes(), getTable1bPreHandNode()])
    } else if (table === 'table2a') {
      npcDrawDecider = vivian.decideDraw.bind(vivian)
      gatePassedAt1A = true
      gatePassedAt1B = true
      frequencyData = createFrequencyData()
      handsAt2A = 0
      currentNpcName = 'Vivian'
      unmarkFiredOnce('t2a-vivian-hot-001')
      unmarkFiredOnce('t2a-assess-intro')
      game = { ...game, noDraw: true, ante: 10, betAmount: 10 }
      game = startHand(game)
      discardSet = new Set()
      enqueue([...getTable2aApproachNodes()])
      if (game.npcActsFirst) handleNpcOpens()
    }
    screen = table as Screen
    devPanelOpen = false
  }

  function devPassAssessment(nodeId: string, firedOnceId: string | null, responseType: 'checklist' | 'numeric' = 'checklist'): void {
    recordAssessment({ nodeId, responseType, attempts: 1, correct: true })
    if (firedOnceId) markFiredOnce(firedOnceId)
  }

  function devPassGate(): void {
    if (screen === 'table2a') gatePassedAt2A = true
    else if (screen === 'table1b') gatePassedAt1B = true
    else gatePassedAt1A = true
  }

  function devPassAllAssessments(): void {
    if (screen === 'table2a') {
      const log = getAssessmentLog()
      if (!log.some(r => r.nodeId === 't2a-assess-proc')) {
        recordAssessment({ nodeId: 't2a-assess-proc', responseType: 'numeric', attempts: 1, correct: true })
        markFiredOnce('t2a-assess-intro')
      }
      if (!log.some(r => r.nodeId === 't2a-assess-conceptual')) {
        recordAssessment({ nodeId: 't2a-assess-conceptual', responseType: 'checklist', attempts: 1, correct: true })
      }
      if (!log.some(r => r.nodeId === 't2a-assess-transfer')) {
        recordAssessment({ nodeId: 't2a-assess-transfer', responseType: 'checklist', attempts: 1, correct: true })
      }
      gatePassedAt2A = true
    } else if (screen === 'table1b') {
      const log = getAssessmentLog()
      if (!log.some(r => r.nodeId === 't1b-hank-retro')) {
        recordAssessment({ nodeId: 't1b-hank-retro', responseType: 'checklist', attempts: 1, correct: true })
        markFiredOnce('t1b-hank-retro-001')
      }
      if (!log.some(r => r.nodeId === 't1b-assess-proc')) {
        recordAssessment({ nodeId: 't1b-assess-proc', responseType: 'numeric', attempts: 1, correct: true })
        markFiredOnce('t1b-assess-intro')
      }
      if (!log.some(r => r.nodeId === 't1b-assess-conceptual')) {
        recordAssessment({ nodeId: 't1b-assess-conceptual', responseType: 'checklist', attempts: 1, correct: true })
      }
      if (!log.some(r => r.nodeId === 't1b-assess-transfer')) {
        recordAssessment({ nodeId: 't1b-assess-transfer', responseType: 'checklist', attempts: 1, correct: true })
      }
      gatePassedAt1B = true
    } else {
      const log = getAssessmentLog()
      if (!log.some(r => r.nodeId === 't1a-assess-hank-001')) {
        recordAssessment({ nodeId: 't1a-assess-hank-001', responseType: 'checklist', attempts: 1, correct: true })
        markFiredOnce('t1a-pattern-001')
      }
      if (!log.some(r => r.nodeId === 't1a-assess-gamblers-001')) {
        recordAssessment({ nodeId: 't1a-assess-gamblers-001', responseType: 'checklist', attempts: 1, correct: true })
        markFiredOnce('t1a-fallacy-001')
      }
      if (!log.some(r => r.nodeId === 't1a-assess-transfer-001')) {
        recordAssessment({ nodeId: 't1a-assess-transfer-001', responseType: 'checklist', attempts: 1, correct: true })
      }
      gatePassedAt1A = true
    }
  }

  function devDumpState(): void {
    console.group('[DEV] dodo-poker state dump')
    console.log('screen:', screen)
    console.log('avatar:', avatar)
    console.log('gatePassedAt1A:', gatePassedAt1A)
    console.log('gatePassedAt1B:', gatePassedAt1B)
    console.log('handsAt1B:', handsAt1B)
    console.log('surveillanceRoomVisited:', surveillanceRoomVisited)
    console.log('frequencyData:', JSON.parse(JSON.stringify(frequencyData)))
    console.log('game:', JSON.parse(JSON.stringify(game)))
    console.log('dialogQueue length:', dialogQueue.length)
    console.log('dialogQueue:', dialogQueue)
    console.log('assessmentState:', assessmentState)
    console.log('firedOnce:', getFiredOnce())
    console.log('assessmentLog:', getAssessmentLog())
    console.groupEnd()
  }

  function devClearSave(): void {
    clear()
    savedSession = false
  }

  function devForceNode(id: string): void {
    const chain = getChain(id)
    if (chain.length) {
      enqueue(chain)
    } else {
      const node = getNode(id)
      if (node) enqueue([node])
    }
    devPanelOpen = false
  }

  // ── Persistence ──────────────────────────────────────────────────────────

  function doSave(): void {
    save({
      avatar,
      playerSeeds:           game.playerSeeds,
      npcSeeds:             game.npcSeeds,
      handNumber:            game.handNumber,
      handsPlayed:           game.handsPlayed,
      betAmount:             game.betAmount,
      ante:                  game.ante,
      firedOnce:             getFiredOnce(),
      assessmentLog:         getAssessmentLog(),
      observationLog,
      firedRules:            getFiredRules(),
      frequencyData,
      handsAt1B,
      handsAt2A,
      surveillanceRoomVisited,
      currentNpcName,
      usedBackupIds,
      gatePassedAt2A,
    })
    savedSession = true
  }

  // ── Derived display ──────────────────────────────────────────────────────

  $: broke = game.playerSeeds < game.ante
  $: npcBroke = game.npcSeeds < game.ante
  $: canBet  = game.playerSeeds >= game.betAmount
  $: canCall = game.npcPendingBet && game.playerSeeds >= game.callAmount
  // Variable-bet tiers for Table 2A (5 / 10 / 20 seeds)
  $: canBet5  = game.playerSeeds >= 5
  $: canBet10 = game.playerSeeds >= 10
  $: canBet20 = game.playerSeeds >= 20
  $: showNpcCards = game.phase === 'done' && game.result && !game.result.playerFolded && !game.result.npcFolded
  $: drawCount = discardSet.size

  $: opponentName = currentNpcName

  function resultText(): string {
    if (!game.result) return ''
    if (game.result.playerFolded) return `You folded. ${currentNpcName} takes the pot.`
    if (game.result.npcFolded)   return `${currentNpcName} folded.`
    if (game.result.winner === 'player') return `You win! +${game.result.potWon} seeds`
    if (game.result.winner === 'npc')   return `${currentNpcName} wins.`
    return `Tie — pot split. +${game.result.potWon} seeds each.`
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- ── DEV TOOLS ──────────────────────────────────────────────────────────── -->
{#if DEV_MODE}
  <button class="dev-badge" on:click={() => devPanelOpen = !devPanelOpen} title="Dev Tools (Ctrl+Alt+D)">
    DEV
  </button>
  <DevPanel
    open={devPanelOpen}
    {game}
    {screen}
    {gatePassedAt1A}
    {gatePassedAt1B}
    {gatePassedAt2A}
    assessmentLog={getAssessmentLog()}
    onClose={() => devPanelOpen = false}
    onJumpToHand={devJumpToHand}
    onJumpToTable={devJumpToTable}
    onPassAssessment={devPassAssessment}
    onPassGate={devPassGate}
    onPassAllAssessments={devPassAllAssessments}
    onDumpState={devDumpState}
    onClearSave={devClearSave}
    onForceNode={devForceNode}
  />
{/if}

<!-- ── TITLE ──────────────────────────────────────────────────────────────── -->
{#if screen === 'title'}
  <div class="screen center">
    <img
      src="/title-screen-image.png"
      alt="The Nest — a members-only bird social club in Los Angeles"
      class="title-image"
    />
    <h1>The Nest</h1>
    <p class="subtitle">A members-only bird social club · Los Angeles</p>
    <div class="dodo-quote">"{getNode('sog-001')?.text}"</div>
    <div class="btn-group">
      <button class="action-btn primary" on:click={freshStart}>Enter The Nest</button>
      {#if savedSession}
        <button class="action-btn" on:click={continueSession}>Continue previous session</button>
      {/if}
    </div>
  </div>

<!-- ── AVATAR ─────────────────────────────────────────────────────────────── -->
{:else if screen === 'avatar'}
  <div class="screen with-dodo">
    <div class="dodo-content">
      {#if inDialog && currentLine}
        <p class="dialog-speaker">Chief Dodo</p>
        <p class="dialog-text">"{currentLine.text}"</p>
        {#if currentLine.responseType === 'action'}
          <div class="avatar-grid">
            {#each AVATARS as { id, label, desc }, i}
              <button class="avatar-btn" on:click={() => selectAvatar(id)}>
                <span class="num">{i + 1}.</span>
                <span class="label">{label}</span>
                <span class="desc">{desc}</span>
              </button>
            {/each}
          </div>
        {:else}
          <button class="action-btn primary" on:click={advance}>Next</button>
        {/if}
      {/if}
    </div>
    <div class="dodo-portrait">
      <img src="/chief-dodo.png" alt="Chief Dodo" />
    </div>
  </div>

<!-- ── INTRO ──────────────────────────────────────────────────────────────── -->
{:else if screen === 'intro'}
  <div class="screen with-dodo">
    <div class="dodo-content">
      {#if inDialog && currentLine}
        <p class="dialog-speaker">Chief Dodo</p>
        <p class="dialog-text">"{currentLine.text}"</p>
        <button class="action-btn primary" on:click={advance}>Next</button>
      {/if}
    </div>
    <div class="dodo-portrait">
      <img src="/chief-dodo.png" alt="Chief Dodo" />
    </div>
  </div>

<!-- ── SURVEILLANCE ROOM ──────────────────────────────────────────────────── -->
{:else if screen === 'surveillance'}
  <SurveillanceRoom onReturn={returnFromSurveillance} />

<!-- ── TABLE 1B ────────────────────────────────────────────────────────────── -->
{:else if screen === 'table1b'}
  <FrequencyTable open={freqTableOpen} data={frequencyData} onToggle={() => freqTableOpen = !freqTableOpen} />

  <div class="table-screen has-freq-panel" class:ref-card-open={refCardOpen} class:freq-table-open={freqTableOpen}>

    <ReferenceCard open={refCardOpen} onToggle={() => refCardOpen = !refCardOpen} />

    <!-- Header bar -->
    <div class="header">
      <div class="player-info">
        <span class="player-name you">You ({avatar})</span>
        <span class="seed-count">🌰 {game.playerSeeds}</span>
      </div>
      <div class="center-display">
        <div class="room-badge">Front Room · Table 1B</div>
        <div class="pot-display">
          <span class="pot-label">Pot</span>
          <span class="pot-amount">🌰 {game.pot}</span>
        </div>
        <div class="bet-display">
          <span class="bet-label">Bet</span>
          <span class="bet-amount">🌰 {game.betAmount}</span>
        </div>
      </div>
      <div class="player-info right">
        <span class="seed-count">🌰 {game.npcSeeds}</span>
        <span class="player-name lucky">{currentNpcName}</span>
      </div>
    </div>

    <!-- NPC hand -->
    <div class="hand-area opponent">
      <span class="hand-label">{currentNpcName}'s hand</span>
      <div class="cards">
        {#if showNpcCards}
          {#each game.npcHand as card}
            <CardImage {card} />
          {/each}
          <span class="hand-name">{game.result?.npcHandName}</span>
        {:else}
          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
          <div
            class="npc-hand-anim"
            on:click={skipNpcAnim}
            title={npcAnimPhase !== 'idle' ? 'Click to skip' : undefined}
          >
            {#each game.npcHand as _card, i (i)}
              <CardImage faceDown animState={
                npcAnimPhase === 'idle' || game.npcDiscardIndices.indexOf(i) === -1 ? 'idle' :
                npcAnimPhase === 'sliding-out' ? 'slide-out' :
                game.npcDiscardIndices.indexOf(i) < npcAnimDealtCount ? 'deal-in' : 'empty'
              } />
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="felt-rule"></div>

    <!-- Player's hand -->
    <div class="hand-area player">
      <span class="hand-label">Your hand</span>
      <div class="cards">
        {#each game.playerHand as card, i}
          <CardImage
            {card}
            selected={discardSet.has(i)}
            clickable={game.phase === 'draw' && !inDialog}
            on:click={() => game.phase === 'draw' && !inDialog && toggleDiscard(i)}
          />
        {/each}
        {#if game.phase === 'done' && game.result && !game.result.playerFolded}
          <span class="hand-name">{game.result.playerHandName}</span>
        {/if}
      </div>
      {#if game.phase === 'draw' && !inDialog}
        <p class="draw-hint">Click cards to mark for discard · {drawCount} selected</p>
      {/if}
    </div>

    <!-- Dialog / Action area -->
    <div class="bottom-area">

      {#if gatePassedAt1B && !inDialog && !assessmentState}
        <div class="advance-cta">
          <p class="advance-label">Chief Dodo: "The Main Room is ahead. Let's go."</p>
          <button class="action-btn primary advance-btn" on:click={moveToTable2A}>Move to Table 2A →</button>
        </div>

        {#if surveillanceRoomVisited}
          <button class="action-btn surv-return-btn" on:click={() => screen = 'surveillance'}>
            Return to Surveillance Room
          </button>
        {/if}

      {/if}

      {#if inDialog && currentLine}
        <button class="dialog-box" on:click={advance} aria-label="Advance dialog">
          <span
            class="dialog-speaker"
            class:speaker-lucky={currentLine.isNpc}
          >
            {currentLine.speaker}
          </span>
          <div aria-live="polite" aria-atomic="true">
            <p class="dialog-text">"{currentLine.text}"</p>
          </div>
          <span class="dialog-hint">Press Space, Enter, or click to continue</span>
        </button>

      {:else if assessmentState}
        {#if assessmentState.node.responseType === 'numeric'}
          <div class="assessment-area">
            <p class="assessment-prompt" id="numeric-prompt-1b">"{assessmentState.node.text}"</p>
            <div class="numeric-row">
              <input
                class="numeric-input"
                type="number"
                aria-labelledby="numeric-prompt-1b"
                bind:value={assessmentState.numericInput}
                on:keydown={e => e.key === 'Enter' && submitNumeric()}
                placeholder="Enter a number"
              />
              <button
                class="action-btn primary"
                on:click={submitNumeric}
                disabled={assessmentState.numericInput === '' || isNaN(parseInt(assessmentState.numericInput, 10))}
              >
                Submit
              </button>
            </div>
          </div>
        {:else}
          <div class="assessment-area">
            <p class="assessment-prompt">"{assessmentState.node.text}"</p>
            <p class="assessment-hint">Check all that apply.</p>
            <div class="assessment-options">
              {#each assessmentState.node.options ?? [] as option}
                <button
                  class="checklist-option"
                  class:selected={assessmentState.selectedIds.has(option.id)}
                  aria-pressed={assessmentState.selectedIds.has(option.id)}
                  on:click={() => toggleChecklistOption(option.id)}
                >
                  <span class="check-icon" aria-hidden="true">{assessmentState.selectedIds.has(option.id) ? '☑' : '☐'}</span>
                  {option.text}
                </button>
              {/each}
            </div>
            <button
              class="action-btn primary"
              on:click={submitChecklist}
              disabled={assessmentState.selectedIds.size === 0}
            >
              Submit
            </button>
          </div>
        {/if}

      {:else if game.phase === 'done'}
        {#if broke}
          <div class="result-area">
            <p class="result-text">You're out of seeds.</p>
            <button class="action-btn primary" on:click={resetGame}>Start over</button>
          </div>
        {:else if npcBroke}
          <div class="result-area">
            <p class="result-text">{currentNpcName} is tapped out.</p>
            {#if getNextBackup(usedBackupIds)}
              <button class="action-btn primary" on:click={swapNpc}>Continue</button>
            {:else}
              <button class="action-btn primary" on:click={resetGame}>Play again</button>
            {/if}
          </div>
        {:else}
          <div class="result-area">
            <p class="result-text">{resultText()}</p>
            <button class="action-btn primary" on:click={nextHand}>Play next hand</button>
            {#if surveillanceRoomVisited && !gatePassedAt1B}
              <button class="action-btn surv-return-btn" on:click={() => screen = 'surveillance'}>
                Surveillance Room
              </button>
            {/if}
          </div>
        {/if}

      {:else if game.phase === 'bet1' || game.phase === 'bet2'}
        <p class="prompt">Your move:</p>
        {#if game.npcPendingBet}
          <p class="hank-bet-notice">{currentNpcName} bet {game.callAmount} seeds.</p>
          <button class="action-btn" on:click={doCall} disabled={!canCall}>1. Call ({game.callAmount} seeds)</button>
          <button class="action-btn" on:click={doFold}>2. Fold</button>
        {:else}
          <button class="action-btn" on:click={doCheck}>1. Check</button>
          <button class="action-btn" on:click={() => doBet()} disabled={!canBet}>2. Bet {game.betAmount} seeds</button>
          <button class="action-btn" on:click={doFold}>3. Fold</button>
        {/if}

      {:else if game.phase === 'draw'}
        <p class="prompt">Select which cards you want to trade in.</p>
        <button class="action-btn primary" on:click={doDraw}>
          {drawCount === 0 ? 'Stand pat — keep all 5' : `Draw ${drawCount} card${drawCount > 1 ? 's' : ''}`}
        </button>

      {:else if game.phase === 'idle'}
        <button class="action-btn primary" on:click={nextHand}>Deal</button>
      {/if}

    </div>

    <div class="hand-counter">Hand {game.handNumber} · Hands at 1B: {handsAt1B}</div>

  </div>

<!-- ── TABLE 2A ──────────────────────────────────────────────────────────── -->
{:else if screen === 'table2a'}
  <FrequencyTable open={freqTableOpen} data={frequencyData} onToggle={() => freqTableOpen = !freqTableOpen} />

  <div class="table-screen has-freq-panel" class:ref-card-open={refCardOpen} class:freq-table-open={freqTableOpen}>

    <ReferenceCard open={refCardOpen} onToggle={() => refCardOpen = !refCardOpen} />

    <div class="header">
      <div class="player-info">
        <span class="player-name you">You ({avatar})</span>
        <span class="seed-count">🌰 {game.playerSeeds}</span>
      </div>
      <div class="center-display">
        <div class="room-badge">Main Room · Table 2A</div>
        <div class="pot-display">
          <span class="pot-label">Pot</span>
          <span class="pot-amount">🌰 {game.pot}</span>
        </div>
        <div class="bet-display">
          <span class="bet-label">Ante</span>
          <span class="bet-amount">🌰 {game.ante}</span>
        </div>
      </div>
      <div class="player-info right">
        <span class="seed-count">🌰 {game.npcSeeds}</span>
        <span class="player-name lucky">{currentNpcName}</span>
      </div>
    </div>

    <!-- NPC hand -->
    <div class="hand-area opponent">
      <span class="hand-label">{currentNpcName}'s hand</span>
      <div class="cards">
        {#if showNpcCards}
          {#each game.npcHand as card}
            <CardImage {card} />
          {/each}
          <span class="hand-name">{game.result?.npcHandName}</span>
        {:else}
          <div class="npc-hand-anim" on:click={skipNpcAnim} role="presentation">
            {#each game.npcHand as _card, i (i)}
              <CardImage faceDown animState={
                npcAnimPhase === 'idle' || game.npcDiscardIndices.indexOf(i) === -1 ? 'idle' :
                npcAnimPhase === 'sliding-out' ? 'slide-out' :
                game.npcDiscardIndices.indexOf(i) < npcAnimDealtCount ? 'deal-in' : 'empty'
              } />
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="felt-rule"></div>

    <!-- Player hand -->
    <div class="hand-area player">
      <span class="hand-label">Your hand</span>
      <div class="cards">
        {#each game.playerHand as card, i}
          <CardImage
            {card}
            clickable={false}
            on:click={() => {}}
          />
        {/each}
        {#if game.phase === 'done' && game.result && !game.result.playerFolded}
          <span class="hand-name">{game.result.playerHandName}</span>
        {/if}
      </div>
    </div>

    <!-- Dialog / Action area -->
    <div class="bottom-area">

      {#if gatePassedAt2A && !inDialog && !assessmentState}
        <div class="advance-cta">
          <p class="advance-label">Chief Dodo: "Table 2B is next. More coming soon."</p>
          <button class="action-btn primary advance-btn" disabled>Table 2B — Coming soon →</button>
        </div>

      {/if}

      {#if inDialog && currentLine}
        <button class="dialog-box" on:click={advance} aria-label="Advance dialog">
          <span class="dialog-speaker" class:speaker-lucky={currentLine.isNpc}>{currentLine.speaker}</span>
          <div aria-live="polite" aria-atomic="true">
            <p class="dialog-text">"{currentLine.text}"</p>
          </div>
          <span class="dialog-hint">Press Space, Enter, or click to continue</span>
        </button>

      {:else if assessmentState}
        {#if assessmentState.node.responseType === 'numeric'}
          <div class="assessment-area">
            <p class="assessment-prompt" id="numeric-prompt-2a">"{assessmentState.node.text}"</p>
            <div class="numeric-row">
              <input
                class="numeric-input"
                type="number"
                aria-labelledby="numeric-prompt-2a"
                bind:value={assessmentState.numericInput}
                on:keydown={e => e.key === 'Enter' && submitNumeric()}
                placeholder="Enter a number"
              />
              <button
                class="action-btn primary"
                on:click={submitNumeric}
                disabled={assessmentState.numericInput === '' || isNaN(parseInt(assessmentState.numericInput, 10))}
              >
                Submit
              </button>
            </div>
          </div>
        {:else}
          <div class="assessment-area">
            <p class="assessment-prompt">"{assessmentState.node.text}"</p>
            <p class="assessment-hint">Check all that apply.</p>
            <div class="assessment-options">
              {#each assessmentState.node.options ?? [] as option}
                <button
                  class="checklist-option"
                  class:selected={assessmentState.selectedIds.has(option.id)}
                  aria-pressed={assessmentState.selectedIds.has(option.id)}
                  on:click={() => toggleChecklistOption(option.id)}
                >
                  <span class="check-icon" aria-hidden="true">{assessmentState.selectedIds.has(option.id) ? '☑' : '☐'}</span>
                  {option.text}
                </button>
              {/each}
            </div>
            <button
              class="action-btn primary"
              on:click={submitChecklist}
              disabled={assessmentState.selectedIds.size === 0}
            >
              Submit
            </button>
          </div>
        {/if}

      {:else if game.phase === 'done'}
        {#if broke}
          <div class="result-area">
            <p class="result-text">You're out of seeds.</p>
            <button class="action-btn primary" on:click={resetGame}>Start over</button>
          </div>
        {:else}
          <div class="result-area">
            <p class="result-text">{resultText()}</p>
            <button class="action-btn primary" on:click={nextHand}>Play next hand</button>
          </div>
        {/if}

      {:else if game.phase === 'bet1'}
        <p class="prompt">
          {game.npcActsFirst ? `${currentNpcName} opened this hand.` : 'Your move:'}
        </p>
        {#if game.npcPendingBet}
          <p class="hank-bet-notice">{currentNpcName} bet {game.callAmount} seeds.</p>
          <button class="action-btn" on:click={doCall} disabled={!canCall}>1. Call ({game.callAmount} seeds)</button>
          <button class="action-btn" on:click={doFold}>2. Fold</button>
        {:else}
          <button class="action-btn" on:click={doCheck}>1. Check</button>
          <button class="action-btn" on:click={() => doBet(5)}  disabled={!canBet5}>2. Bet 5 seeds</button>
          <button class="action-btn" on:click={() => doBet(10)} disabled={!canBet10}>3. Bet 10 seeds</button>
          <button class="action-btn" on:click={() => doBet(20)} disabled={!canBet20}>4. Bet 20 seeds</button>
          <button class="action-btn" on:click={doFold}>5. Fold</button>
        {/if}

      {:else if game.phase === 'idle'}
        <button class="action-btn primary" on:click={nextHand}>Deal</button>
      {/if}

    </div>

    <div class="hand-counter">Hand {game.handNumber} · Hands at 2A: {handsAt2A}</div>

  </div>

<!-- ── TABLE 1A ──────────────────────────────────────────────────────────── -->
{:else if screen === 'table'}
  <div class="table-screen" class:ref-card-open={refCardOpen}>

    <ReferenceCard open={refCardOpen} onToggle={() => refCardOpen = !refCardOpen} />

    <!-- Header bar -->
    <div class="header">
      <div class="player-info">
        <span class="player-name you">You ({avatar})</span>
        <span class="seed-count">🌰 {game.playerSeeds}</span>
      </div>
      <div class="center-display">
        <div class="pot-display">
          <span class="pot-label">Pot</span>
          <span class="pot-amount">🌰 {game.pot}</span>
        </div>
        <div class="bet-display">
          <span class="bet-label">Bet</span>
          <span class="bet-amount">🌰 {game.betAmount}</span>
        </div>
      </div>
      <div class="player-info right">
        <span class="seed-count">🌰 {game.npcSeeds}</span>
        <span class="player-name hank">{currentNpcName}</span>
      </div>
    </div>

    <!-- NPC hand -->
    <div class="hand-area opponent">
      <span class="hand-label">{currentNpcName}'s hand</span>
      <div class="cards">
        {#if showNpcCards}
          {#each game.npcHand as card}
            <CardImage {card} />
          {/each}
          <span class="hand-name">{game.result?.npcHandName}</span>
        {:else}
          <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
          <div
            class="npc-hand-anim"
            on:click={skipNpcAnim}
            title={npcAnimPhase !== 'idle' ? 'Click to skip' : undefined}
          >
            {#each game.npcHand as _card, i (i)}
              <CardImage faceDown animState={
                npcAnimPhase === 'idle' || game.npcDiscardIndices.indexOf(i) === -1 ? 'idle' :
                npcAnimPhase === 'sliding-out' ? 'slide-out' :
                game.npcDiscardIndices.indexOf(i) < npcAnimDealtCount ? 'deal-in' : 'empty'
              } />
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <div class="felt-rule"></div>

    <!-- Player's hand -->
    <div class="hand-area player">
      <span class="hand-label">Your hand</span>
      <div class="cards">
        {#each game.playerHand as card, i}
          <CardImage
            {card}
            selected={discardSet.has(i)}
            clickable={game.phase === 'draw' && !inDialog}
            on:click={() => game.phase === 'draw' && !inDialog && toggleDiscard(i)}
          />
        {/each}
        {#if game.phase === 'done' && game.result && !game.result.playerFolded}
          <span class="hand-name">{game.result.playerHandName}</span>
        {/if}
      </div>
      {#if game.phase === 'draw' && !inDialog}
        <p class="draw-hint">Click cards to mark for discard · {drawCount} selected</p>
      {/if}
    </div>

    <!-- Dialog / Action area -->
    <div class="bottom-area">

      {#if gatePassedAt1A && !inDialog && !assessmentState}
        <div class="advance-cta">
          <p class="advance-label">Chief Dodo: "You're ready for the next table."</p>
          <button class="action-btn primary advance-btn" on:click={moveToTable1B}>Move to Table 1B →</button>
        </div>
      {/if}


      {#if inDialog && currentLine}
        <button class="dialog-box" on:click={advance} aria-label="Advance dialog">
          <span
            class="dialog-speaker"
            class:speaker-hank={currentLine.isNpc}
          >
            {currentLine.speaker}
          </span>
          <div aria-live="polite" aria-atomic="true">
            <p class="dialog-text">"{currentLine.text}"</p>
          </div>
          <span class="dialog-hint">Press Space, Enter, or click to continue</span>
        </button>

      {:else if assessmentState}
        {#if assessmentState.node.responseType === 'numeric'}
          <div class="assessment-area">
            <p class="assessment-prompt" id="numeric-prompt-1a">"{assessmentState.node.text}"</p>
            <div class="numeric-row">
              <input
                class="numeric-input"
                aria-labelledby="numeric-prompt-1a"
                type="number"
                bind:value={assessmentState.numericInput}
                on:keydown={e => e.key === 'Enter' && submitNumeric()}
                placeholder="Enter a number"
              />
              <button
                class="action-btn primary"
                on:click={submitNumeric}
                disabled={assessmentState.numericInput === '' || isNaN(parseInt(assessmentState.numericInput, 10))}
              >
                Submit
              </button>
            </div>
          </div>
        {:else}
          <div class="assessment-area">
            <p class="assessment-prompt">"{assessmentState.node.text}"</p>
            <p class="assessment-hint">Check all that apply.</p>
            <div class="assessment-options">
              {#each assessmentState.node.options ?? [] as option}
                <button
                  class="checklist-option"
                  class:selected={assessmentState.selectedIds.has(option.id)}
                  aria-pressed={assessmentState.selectedIds.has(option.id)}
                  on:click={() => toggleChecklistOption(option.id)}
                >
                  <span class="check-icon" aria-hidden="true">{assessmentState.selectedIds.has(option.id) ? '☑' : '☐'}</span>
                  {option.text}
                </button>
              {/each}
            </div>
            <button
              class="action-btn primary"
              on:click={submitChecklist}
              disabled={assessmentState.selectedIds.size === 0}
            >
              Submit
            </button>
          </div>
        {/if}

      {:else if game.phase === 'done'}
        {#if broke}
          <div class="result-area">
            <p class="result-text">You're out of seeds.</p>
            <button class="action-btn primary" on:click={resetGame}>Start over</button>
          </div>
        {:else if npcBroke}
          <div class="result-area">
            <p class="result-text">{currentNpcName} is tapped out.</p>
            <button class="action-btn primary" on:click={refillNpcAt1A}>Continue</button>
          </div>
        {:else}
          <div class="result-area">
            <p class="result-text">{resultText()}</p>
            <button class="action-btn primary" on:click={nextHand}>Play next hand</button>
          </div>
        {/if}

      {:else if game.phase === 'bet1' || game.phase === 'bet2'}
        <p class="prompt">Your move:</p>
        {#if game.npcPendingBet}
          <p class="hank-bet-notice">{currentNpcName} bet {game.callAmount} seeds.</p>
          <button class="action-btn" on:click={doCall} disabled={!canCall}>1. Call ({game.callAmount} seeds)</button>
          <button class="action-btn" on:click={doFold}>2. Fold</button>
        {:else}
          <button class="action-btn" on:click={doCheck}>1. Check</button>
          <button class="action-btn" on:click={() => doBet()} disabled={!canBet}>2. Bet {game.betAmount} seeds</button>
          <button class="action-btn" on:click={doFold}>3. Fold</button>
        {/if}

      {:else if game.phase === 'draw'}
        <p class="prompt">Select which cards you want to trade in.</p>
        <button class="action-btn primary" on:click={doDraw}>
          {drawCount === 0 ? 'Stand pat — keep all 5' : `Draw ${drawCount} card${drawCount > 1 ? 's' : ''}`}
        </button>

      {:else if game.phase === 'idle'}
        <button class="action-btn primary" on:click={nextHand}>Deal</button>
      {/if}

    </div>

    <!-- Hand counter -->
    <div class="hand-counter">Hand {game.handNumber} · Hands played: {game.handsPlayed}</div>

  </div>
{/if}

<!-- ── Main Room transition animation ───────────────────────────────────── -->
{#if roomTransitionAnim}
  <div class="room-transition-overlay" aria-hidden="true">
    {#each ['♠','♣','♦','♥','♠','♣','♦','♥','♠','♣','♦','♥'] as suit, i}
      <span class="scatter-suit" style="
        --angle: {(i / 12) * 360}deg;
        --delay: {i * 0.08}s;
        --dist: {80 + (i % 4) * 30}px;
      ">{suit}</span>
    {/each}
    <span class="room-label">Main Room</span>
  </div>
{/if}

<style>
  :global(*, *::before, *::after) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) {
    font-family: 'Georgia', serif;
    background: #111a11;
    color: #f0ead6;
    min-height: 100vh;
  }

  /* ── Shared ── */
  .screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 48px;
  }
  .center {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  .with-dodo {
    flex-direction: row;
    gap: 56px;
  }

  .dodo-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 480px;
    flex: 1;
  }

  .dodo-portrait {
    flex-shrink: 0;
    width: 300px;
    display: flex;
    align-items: center;
  }
  .dodo-portrait img {
    width: 100%;
    border-radius: 14px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
  }

  .dodo-quote {
    max-width: 560px;
    font-style: italic;
    color: #d4c89a;
    background: rgba(0,0,0,0.35);
    border-left: 3px solid #c8a84a;
    padding: 12px 18px;
    border-radius: 0 6px 6px 0;
    line-height: 1.65;
    text-align: left;
  }

  .action-btn {
    background: #1e2e1e;
    color: #f0ead6;
    border: 1px solid #3a5a3a;
    border-radius: 6px;
    padding: 11px 22px;
    font-size: 1rem;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s;
    min-width: 220px;
    text-align: left;
  }
  .action-btn:hover { background: #263626; border-color: #4a7a4a; }
  .action-btn.primary { border-color: #c8a84a; color: #c8a84a; }
  .action-btn.primary:hover { background: #1e2a12; }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-group { display: flex; flex-direction: column; gap: 10px; align-items: center; }

  /* ── Title ── */
  .title-image {
    width: 100%;
    max-width: 680px;
    border-radius: 12px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.7);
    margin-bottom: 4px;
  }
  h1 { font-size: 3rem; letter-spacing: 0.1em; color: #c8a84a; }
  .subtitle { font-size: 0.9rem; color: #a08858; letter-spacing: 0.06em; }

  /* ── Avatar ── */
  .avatar-grid { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 420px; }
  .avatar-btn {
    display: flex; align-items: baseline; gap: 10px;
    background: #1e2e1e; border: 1px solid #3a5a3a; border-radius: 6px;
    padding: 12px 16px; cursor: pointer; color: #f0ead6; font-family: inherit;
    text-align: left; transition: background 0.12s;
  }
  .avatar-btn:hover { background: #263626; }
  .num   { color: #c8a84a; min-width: 22px; }
  .label { font-weight: bold; min-width: 75px; }
  .desc  { font-size: 0.85rem; color: #b09a70; font-style: italic; }

  /* ── Table screen ── */
  .table-screen {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin-right: 0;
    margin-left: 0;
    transition: margin-right 0.25s ease, margin-left 0.25s ease;
  }

  .table-screen.ref-card-open {
    margin-right: 280px;
  }

  .table-screen.has-freq-panel {
    margin-left: 24px;
  }

  .table-screen.freq-table-open {
    margin-left: 220px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0a120a;
    padding: 10px 24px;
    border-bottom: 1px solid #1e3a1e;
    flex-shrink: 0;
  }
  .player-info { display: flex; align-items: center; gap: 12px; }
  .player-info.right { flex-direction: row-reverse; }
  .player-name { font-size: 0.9rem; font-weight: bold; }
  .player-name.you   { color: #7ac87a; }
  .player-name.hank  { color: #c87a7a; }
  .player-name.lucky { color: #7a9abc; }
  .seed-count { color: #a0c070; font-size: 0.95rem; }
  .center-display { display: flex; gap: 24px; align-items: center; }
  .room-badge { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6a9a6a; }
  .pot-display  { text-align: center; }
  .pot-label    { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6a9a6a; }
  .pot-amount   { font-size: 1.2rem; font-weight: bold; color: #f0ead6; }
  .bet-display  { text-align: center; }
  .bet-label    { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6a9a6a; }
  .bet-amount   { font-size: 1.2rem; font-weight: bold; color: #a0a090; }

  .hand-area {
    padding: 18px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .opponent { background: rgba(0,0,0,0.25); }
  .player   { background: rgba(0,0,0,0.12); }
  .hand-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: #6a9a6a; }
  .cards { display: flex; align-items: flex-end; gap: 8px; flex-wrap: wrap; min-height: 112px; }
  .npc-hand-anim { display: flex; align-items: flex-end; gap: 8px; cursor: default; }
  .hand-name { font-style: italic; color: #c8a84a; font-size: 0.95rem; margin-left: 10px; align-self: center; }
  .draw-hint { font-size: 0.82rem; color: #a08858; font-style: italic; }

  .felt-rule {
    height: 2px;
    background: linear-gradient(to right, transparent, #1e5a1e 20%, #1e5a1e 80%, transparent);
    flex-shrink: 0;
  }

  /* ── Bottom area ── */
  .bottom-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px 24px;
    border-top: 1px solid #1e3a1e;
  }

  .dialog-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(200, 168, 74, 0.08);
    border: 1px solid rgba(200, 168, 74, 0.3);
    border-radius: 8px;
    padding: 16px 20px;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    color: inherit;
    transition: background 0.12s;
    width: 100%;
  }
  .dialog-box:hover { background: rgba(200, 168, 74, 0.12); }
  .dialog-speaker { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #c8a84a; }
  .dialog-speaker.speaker-hank  { color: #c87a7a; }
  .dialog-speaker.speaker-lucky { color: #7a9abc; }
  .dialog-text { font-style: italic; color: #d4c89a; line-height: 1.6; font-size: 1.05rem; white-space: pre-line; }
  .dialog-hint { font-size: 0.72rem; color: #6a8a5a; align-self: flex-end; margin-top: 4px; }

  .prompt { font-size: 0.9rem; color: #7a8a6a; }
  .hank-bet-notice { font-size: 0.9rem; color: #c87a7a; font-style: italic; }

  /* ── Assessment / checklist ── */
  .assessment-area { display: flex; flex-direction: column; gap: 10px; }
  .assessment-prompt { font-style: italic; color: #c8a84a; line-height: 1.55; font-size: 1rem; }
  .assessment-hint { font-size: 0.78rem; color: #6a8a5a; }
  .assessment-options { display: flex; flex-direction: column; gap: 6px; }

  .checklist-option {
    display: flex;
    align-items: baseline;
    gap: 10px;
    background: #1a2a1a;
    border: 1px solid #2a4a2a;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 0.92rem;
    font-family: inherit;
    color: #d4c89a;
    cursor: pointer;
    text-align: left;
    transition: background 0.1s, border-color 0.1s;
  }
  .checklist-option:hover { background: #1e331e; }
  .checklist-option.selected { background: #1a2e10; border-color: #c8a84a; color: #f0ead6; }

  .check-icon { color: #c8a84a; font-size: 1.05rem; flex-shrink: 0; }

  /* ── Numeric assessment ── */
  .numeric-row { display: flex; gap: 10px; align-items: center; margin-top: 4px; }
  .numeric-input {
    background: #1a2a1a;
    border: 1px solid #3a5a3a;
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 1rem;
    font-family: inherit;
    color: #f0ead6;
    width: 160px;
  }
  .numeric-input:focus { outline: 2px solid #c8a84a; outline-offset: 2px; }

  .result-area { display: flex; flex-direction: column; gap: 14px; }
  .result-text { font-size: 1.15rem; color: #c8a84a; }

  .advance-cta {
    display: flex;
    align-items: center;
    gap: 16px;
    background: rgba(200, 168, 74, 0.1);
    border: 1px solid rgba(200, 168, 74, 0.4);
    border-radius: 8px;
    padding: 14px 18px;
    flex-wrap: wrap;
  }
  .advance-label { font-style: italic; color: #d4c89a; font-size: 0.95rem; flex: 1; }
  .advance-btn { min-width: auto; white-space: nowrap; }

  .surv-return-btn { min-width: auto; border-color: #3a5a7a; color: #7a9abc; font-size: 0.88rem; padding: 8px 16px; }
  .surv-return-btn:hover { background: #1a2a3a; border-color: #4a6a8a; }

  .hand-counter {
    position: fixed;
    bottom: 10px;
    right: 14px;
    font-size: 0.72rem;
    color: #4a7a4a;
  }

  /* ── Dev badge ── */
  .dev-badge {
    position: fixed;
    bottom: 10px;
    left: 14px;
    z-index: 8000;
    background: #1e1e2e;
    border: 1px solid #ff8c42;
    border-radius: 4px;
    color: #ff8c42;
    font-size: 0.65rem;
    font-family: monospace;
    font-weight: bold;
    letter-spacing: 0.1em;
    padding: 3px 7px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.15s;
  }
  .dev-badge:hover { opacity: 1; }

  /* ── Main Room transition overlay ───────────────────────────────────────── */
  .room-transition-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: overlay-fade 1.6s ease forwards;
    pointer-events: none;
  }

  @keyframes overlay-fade {
    0%   { opacity: 0; }
    15%  { opacity: 1; }
    75%  { opacity: 1; }
    100% { opacity: 0; }
  }

  .scatter-suit {
    position: absolute;
    font-size: 1.8rem;
    color: #c8a84a;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    animation: scatter-out 1.2s var(--delay, 0s) ease-out forwards;
    opacity: 0;
  }

  @keyframes scatter-out {
    0%   { transform: translate(-50%, -50%) rotate(0deg) scale(0.5); opacity: 1; }
    100% { transform: translate(
              calc(-50% + cos(var(--angle)) * var(--dist, 80px)),
              calc(-50% + sin(var(--angle)) * var(--dist, 80px))
            ) rotate(360deg) scale(0.2); opacity: 0; }
  }

  .room-label {
    font-size: 2rem;
    color: #c8a84a;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: bold;
    animation: label-pulse 1.6s ease forwards;
    position: relative;
    z-index: 1;
  }

  @keyframes label-pulse {
    0%   { opacity: 0; transform: scale(0.8); }
    30%  { opacity: 1; transform: scale(1.05); }
    70%  { opacity: 1; transform: scale(1); }
    100% { opacity: 0; }
  }
</style>
