<script lang="ts">
  import { onMount } from 'svelte'
  import CardImage from './lib/components/CardImage.svelte'
  import ReferenceCard from './lib/components/ReferenceCard.svelte'
  import {
    createGame, startHand,
    playerCheck, playerBet, playerCall, playerFold, playerDraw
  } from './lib/game/fiveCardDraw'
  import type { GameState } from './lib/game/fiveCardDraw'
  import { save, load, clear } from './lib/game/storage'
  import {
    evaluateChecklist,
    recordAssessment,
    getAssessmentLog,
    restoreAssessmentLog,
  } from './lib/game/assessment'
  import {
    getApproachNodes, getPreHandNode, getDrawComment,
    getPostHandNode, getPatternReveal, getGamblersReveal,
    getHankActionNode, getHankDrawNode,
    restoreFiredOnce, getFiredOnce, getNode, getChain,
  } from './lib/dialog/engine'
  import type { DialogNode } from './lib/dialog/engine'

  // ── Types ────────────────────────────────────────────────────────────────

  type Screen = 'title' | 'avatar' | 'intro' | 'table' | 'table1b'

  interface DisplayLine {
    speaker: string
    text: string
    openReferenceCard?: boolean
    assessmentNode?: DialogNode
    advanceTable?: boolean
  }

  interface AssessmentState {
    node: DialogNode
    selectedIds: Set<string>
  }

  const AVATARS = [
    { id: 'seagull', label: 'Seagull',  desc: 'Scrappy and opportunistic.' },
    { id: 'finch',   label: 'Finch',    desc: 'Cheerful and curious.' },
    { id: 'quail',   label: 'Quail',    desc: "Calm and methodical. California's state bird." },
    { id: 'sparrow', label: 'Sparrow',  desc: 'Understated. Easy to underestimate.' },
    { id: 'crow',    label: 'Crow',     desc: 'Sharp. Remembers everything.' },
  ]

  const AVATAR_RESPONSES: Record<string, string> = {
    seagull: "Seagull. You'll fit right in — The Nest gets all kinds.",
    finch:   'Finch. Always watching, always thinking. Good choice.',
    quail:   "Quail. California's state bird! You're already home.",
    sparrow: "Sparrow. Don't let anyone underestimate you.",
    crow:    'Crow. Sharp choice. They remember everything, you know.',
  }

  // ── State ────────────────────────────────────────────────────────────────

  let screen: Screen = 'title'
  let avatar = ''
  let savedSession = false
  let game: GameState = createGame(100, 5, 5)
  let discardSet = new Set<number>()
  let refCardOpen = false
  let assessmentState: AssessmentState | null = null
  let gatePassedAt1A = false

  // Dialog queue — shown one at a time; action menu hidden while non-empty
  let dialogQueue: DisplayLine[] = []
  $: inDialog = dialogQueue.length > 0
  $: currentLine = dialogQueue[0] ?? null

  // Auto-open reference card when Chief Dodo's handoff line is displayed
  $: if (currentLine?.openReferenceCard) refCardOpen = true

  // ── Lifecycle ────────────────────────────────────────────────────────────

  onMount(() => {
    const saved = load()
    if (saved) savedSession = true
  })

  function handleKeydown(e: KeyboardEvent) {
    if ((e.key === ' ' || e.key === 'Enter') && inDialog) {
      e.preventDefault()
      advance()
    }
  }

  // ── Dialog helpers ───────────────────────────────────────────────────────

  function interpolate(text: string, vars: Record<string, string | number>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? '?'))
  }

  function toLine(node: DialogNode, vars?: Record<string, string | number>): DisplayLine {
    const rawText = node.text ?? ''
    const isInteractive = node.responseType === 'checklist' || node.responseType === 'numeric'
    return {
      speaker: node.speaker === 'chief-dodo' ? 'Chief Dodo'
             : node.speaker === 'hank'        ? 'Hank'
             : 'Narrator',
      text: vars ? interpolate(rawText, vars) : rawText,
      openReferenceCard: node.followUp.openReferenceCard === true,
      assessmentNode: isInteractive ? node : undefined,
      advanceTable: node.followUp.advanceTable === true,
    }
  }

  function enqueue(nodes: (DialogNode | null)[], vars?: Record<string, string | number>): void {
    const lines = nodes
      .filter((n): n is DialogNode => n !== null && !n.silent && n.text !== null)
      .map(n => toLine(n, vars))
    if (lines.length) dialogQueue = [...dialogQueue, ...lines]
  }

  function advance(): void {
    const current = dialogQueue[0]
    dialogQueue = dialogQueue.slice(1)
    if (current?.advanceTable) gatePassedAt1A = true
    if (current?.assessmentNode) {
      assessmentState = { node: current.assessmentNode, selectedIds: new Set() }
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
      if (result.feedbackNodeId) {
        enqueue(getChain(result.feedbackNodeId), result.templateVars)
      }
      doSave()
    } else {
      assessmentState = { ...assessmentState, selectedIds: new Set() }
      if (result.feedbackNodeId) {
        const feedbackNode = getNode(result.feedbackNodeId)
        if (feedbackNode) enqueue([feedbackNode], result.templateVars)
      }
    }
  }

  // ── Screen transitions ───────────────────────────────────────────────────

  function freshStart(): void {
    clear()
    screen = 'avatar'
    dialogQueue = [{ speaker: 'Chief Dodo', text: "Every member here has their bird. What are you?" }]
  }

  function continueSession(): void {
    const saved = load()
    if (!saved) { freshStart(); return }
    avatar = saved.avatar
    restoreFiredOnce(saved.firedOnce)
    restoreAssessmentLog(saved.assessmentLog ?? [])
    gatePassedAt1A = (saved.assessmentLog ?? []).some(r => r.nodeId === 't1a-assess-transfer-001')
    game = {
      ...createGame(saved.playerSeeds, saved.betAmount, saved.ante),
      playerSeeds: saved.playerSeeds,
      hankSeeds:   saved.hankSeeds,
      handNumber:  saved.handNumber,
      handsPlayed: saved.handsPlayed,
    }
    screen = 'table'
    game = startHand(game)
    enqueue([getPreHandNode(game.handNumber)])
  }

  function selectAvatar(id: string): void {
    avatar = id
    dialogQueue = []
    screen = 'intro'
  }

  function sitDown(): void {
    screen = 'table'
    game = startHand(game)
    discardSet = new Set()
    enqueue([...getApproachNodes(), getPreHandNode(game.handNumber)])
  }

  // ── Game actions ─────────────────────────────────────────────────────────

  function doCheck(): void {
    game = playerCheck(game)
    enqueue([getHankActionNode('bet')])
  }

  function doBet(): void {
    const hankNode = getHankActionNode('call')
    game = playerBet(game)
    if (game.phase === 'done' && game.result) {
      const outcome = game.result.winner === 'player' ? 'win' : 'loss'
      enqueue([hankNode, getPostHandNode(outcome)])
      doSave()
    } else {
      enqueue([hankNode])
    }
  }

  function doCall(): void {
    game = playerCall(game)
    if (game.phase === 'done' && game.result) {
      const outcome = game.result.winner === 'player' ? 'win' : 'loss'
      enqueue([getPostHandNode(outcome)])
      doSave()
    }
  }

  function doFold(): void {
    game = playerFold(game)
    enqueue([getPostHandNode('fold')])
    doSave()
  }

  function doDraw(): void {
    const indices = [...discardSet]
    discardSet = new Set()
    const drawComment = getDrawComment(indices.length)
    const hankDraw = game  // capture before update
    game = playerDraw(game, indices)
    enqueue([drawComment, getHankDrawNode(game.hankDrawCount)])
    void hankDraw // suppress unused warning
  }

  function toggleDiscard(idx: number): void {
    const s = new Set(discardSet)
    s.has(idx) ? s.delete(idx) : s.add(idx)
    discardSet = s
  }

  function nextHand(): void {
    game = startHand(game)
    discardSet = new Set()
    const pattern = getPatternReveal(game.handsPlayed)
    const gamblers = getGamblersReveal(game.handsPlayed)
    const preHand = getPreHandNode(game.handNumber)
    enqueue([...pattern, ...gamblers, preHand])
    doSave()
  }

  function resetGame(): void {
    clear()
    game = createGame(100, 5, 5)
    discardSet = new Set()
    dialogQueue = []
    gatePassedAt1A = false
    screen = 'title'
    savedSession = false
  }

  function moveToTable1B(): void {
    screen = 'table1b'
  }

  // ── Persistence ──────────────────────────────────────────────────────────

  function doSave(): void {
    save({
      avatar,
      playerSeeds:   game.playerSeeds,
      hankSeeds:     game.hankSeeds,
      handNumber:    game.handNumber,
      handsPlayed:   game.handsPlayed,
      betAmount:     game.betAmount,
      ante:          game.ante,
      firedOnce:     getFiredOnce(),
      assessmentLog: getAssessmentLog(),
    })
    savedSession = true
  }

  // ── Derived display ──────────────────────────────────────────────────────

  $: broke = game.playerSeeds < game.ante
  $: hankBroke = game.hankSeeds < game.ante
  $: showHankCards = game.phase === 'done' && game.result && !game.result.playerFolded
  $: drawCount = discardSet.size

  function resultText(): string {
    if (!game.result) return ''
    if (game.result.playerFolded) return 'You folded. Hank takes the pot.'
    if (game.result.winner === 'player') return `You win! +${game.result.potWon} seeds`
    if (game.result.winner === 'hank')   return 'Hank wins.'
    return 'Tie — pot split.'
  }
</script>

<svelte:window on:keydown={handleKeydown} />

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
    <div class="dodo-quote">"Like I told you last night — The Nest is the best spot to play in LA. Come on in."</div>
    <div class="btn-group">
      <button class="action-btn primary" on:click={freshStart}>Enter The Nest</button>
      {#if savedSession}
        <button class="action-btn" on:click={continueSession}>Continue previous session</button>
      {/if}
    </div>
  </div>

<!-- ── AVATAR ─────────────────────────────────────────────────────────────── -->
{:else if screen === 'avatar'}
  <div class="screen center">
    {#if currentLine}
      <div class="dodo-quote">"{currentLine.text}"</div>
    {/if}
    <div class="avatar-grid">
      {#each AVATARS as { id, label, desc }, i}
        <button class="avatar-btn" on:click={() => selectAvatar(id)}>
          <span class="num">{i + 1}.</span>
          <span class="label">{label}</span>
          <span class="desc">{desc}</span>
        </button>
      {/each}
    </div>
  </div>

<!-- ── INTRO ──────────────────────────────────────────────────────────────── -->
{:else if screen === 'intro'}
  <div class="screen center">
    <div class="dodo-quote">"{AVATAR_RESPONSES[avatar]}"</div>
    <div class="dodo-quote">"The Nest has a few different tables. Each one runs a different game. You move through them as you're ready — I'll let you know when."</div>
    <div class="dodo-quote">"Table 1 is where we start. Come on."</div>
    <button class="action-btn primary" on:click={sitDown}>Sit down at Table 1</button>
  </div>

<!-- ── TABLE 1B ────────────────────────────────────────────────────────────── -->
{:else if screen === 'table1b'}
  <div class="screen center">
    <h2 class="room-heading">The Front Room — Table 1B</h2>
    <div class="dodo-quote">"Lucky's been sitting at that table all week. Rock Pigeon. Every time he loses he says 'I'm due, man — the cards owe me.' Now you know exactly what to look for."</div>
    <div class="dodo-quote">"Table 1B is coming soon. We're still setting it up."</div>
    <button class="action-btn primary" on:click={resetGame}>Return to The Nest</button>
  </div>

<!-- ── TABLE ──────────────────────────────────────────────────────────────── -->
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
        <span class="seed-count">🌰 {game.hankSeeds}</span>
        <span class="player-name hank">Hank</span>
      </div>
    </div>

    <!-- Hank's hand -->
    <div class="hand-area opponent">
      <span class="hand-label">Hank's hand</span>
      <div class="cards">
        {#if showHankCards}
          {#each game.hankHand as card}
            <CardImage {card} />
          {/each}
          <span class="hand-name">{game.result?.hankHandName}</span>
        {:else}
          {#each Array(5) as _}
            <CardImage faceDown />
          {/each}
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
        <!-- Dialog line -->
        <button class="dialog-box" on:click={advance}>
          <span class="dialog-speaker">{currentLine.speaker}</span>
          <p class="dialog-text">"{currentLine.text}"</p>
          <span class="dialog-hint">Press Space, Enter, or click to continue</span>
        </button>

      {:else if assessmentState}
        <!-- Checklist assessment -->
        <div class="assessment-area">
          <p class="assessment-prompt">"{assessmentState.node.text}"</p>
          <p class="assessment-hint">Check all that apply.</p>
          <div class="assessment-options">
            {#each assessmentState.node.options ?? [] as option}
              <button
                class="checklist-option"
                class:selected={assessmentState.selectedIds.has(option.id)}
                on:click={() => toggleChecklistOption(option.id)}
              >
                <span class="check-icon">{assessmentState.selectedIds.has(option.id) ? '☑' : '☐'}</span>
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

      {:else if game.phase === 'done'}
        <!-- Result -->
        {#if broke}
          <div class="result-area">
            <p class="result-text">You're out of seeds.</p>
            <button class="action-btn primary" on:click={resetGame}>Start over</button>
          </div>
        {:else if hankBroke}
          <div class="result-area">
            <p class="result-text">Hank's tapped out. The Nest thanks you.</p>
            <button class="action-btn primary" on:click={resetGame}>Play again</button>
          </div>
        {:else}
          <div class="result-area">
            <p class="result-text">{resultText()}</p>
            <button class="action-btn primary" on:click={nextHand}>Play next hand</button>
          </div>
        {/if}

      {:else if game.phase === 'bet1' || game.phase === 'bet2'}
        <!-- Betting action menu -->
        <p class="prompt">Your move:</p>
        {#if game.hankPendingBet}
          <p class="hank-bet-notice">Hank bet {game.betAmount} seeds.</p>
          <button class="action-btn" on:click={doCall}>1. Call ({game.betAmount} seeds)</button>
          <button class="action-btn" on:click={doFold}>2. Fold</button>
        {:else}
          <button class="action-btn" on:click={doCheck}>1. Check</button>
          <button class="action-btn" on:click={doBet}>2. Bet {game.betAmount} seeds</button>
          <button class="action-btn" on:click={doFold}>3. Fold</button>
        {/if}

      {:else if game.phase === 'draw'}
        <!-- Draw confirmation -->
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 40px 20px;
  }
  .center { text-align: center; }

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
  .subtitle { font-size: 0.9rem; color: #7a6a4a; letter-spacing: 0.06em; }

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
  .desc  { font-size: 0.85rem; color: #8a7a5a; font-style: italic; }

  /* ── Table screen ── */
  .table-screen {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin-right: 0;
    transition: margin-right 0.25s ease;
  }

  .table-screen.ref-card-open {
    margin-right: 280px;
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
  .seed-count { color: #a0c070; font-size: 0.95rem; }
  .center-display { display: flex; gap: 24px; align-items: center; }
  .pot-display  { text-align: center; }
  .pot-label    { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #4a6a4a; }
  .pot-amount   { font-size: 1.2rem; font-weight: bold; color: #f0ead6; }
  .bet-display  { text-align: center; }
  .bet-label    { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #4a6a4a; }
  .bet-amount   { font-size: 1.2rem; font-weight: bold; color: #a0a090; }

  .hand-area {
    padding: 18px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .opponent { background: rgba(0,0,0,0.25); }
  .player   { background: rgba(0,0,0,0.12); }
  .hand-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; color: #4a6a4a; }
  .cards { display: flex; align-items: flex-end; gap: 8px; flex-wrap: wrap; min-height: 112px; }
  .hand-name { font-style: italic; color: #c8a84a; font-size: 0.95rem; margin-left: 10px; align-self: center; }
  .draw-hint { font-size: 0.82rem; color: #7a6a4a; font-style: italic; }

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
  .dialog-text { font-style: italic; color: #d4c89a; line-height: 1.6; font-size: 1.05rem; }
  .dialog-hint { font-size: 0.72rem; color: #4a5a3a; align-self: flex-end; margin-top: 4px; }

  .prompt { font-size: 0.9rem; color: #7a8a6a; }
  .hank-bet-notice { font-size: 0.9rem; color: #c87a7a; font-style: italic; }

  /* ── Assessment / checklist ── */
  .assessment-area { display: flex; flex-direction: column; gap: 10px; }
  .assessment-prompt { font-style: italic; color: #c8a84a; line-height: 1.55; font-size: 1rem; }
  .assessment-hint { font-size: 0.78rem; color: #4a6a4a; }
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

  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

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

  .room-heading {
    font-size: 1.4rem;
    color: #c8a84a;
    letter-spacing: 0.06em;
    font-weight: normal;
  }

  .hand-counter {
    position: fixed;
    bottom: 10px;
    right: 14px;
    font-size: 0.72rem;
    color: #2a4a2a;
  }
</style>
