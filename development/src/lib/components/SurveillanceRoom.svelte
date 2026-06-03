<script lang="ts">
  export let onReturn: () => void

  // Simulation state
  let draws = 0
  let redCount = 0
  let displayPoints: number[] = []
  let lastN = 0

  const CHART_W = 500
  const CHART_H = 180
  const MAX_POINTS = 500

  function sampleData(freqs: number[]): number[] {
    if (freqs.length <= MAX_POINTS) return freqs
    const step = freqs.length / MAX_POINTS
    return Array.from({ length: MAX_POINTS }, (_, i) => freqs[Math.floor(i * step)])
  }

  function runSimulation(n: number): void {
    let red = 0
    const raw: number[] = []
    for (let i = 0; i < n; i++) {
      // 26 red cards out of 52 — draw with replacement
      if (Math.random() < 26 / 52) red++
      raw.push(red / (i + 1))
    }
    draws = n
    redCount = red
    displayPoints = sampleData(raw)
    lastN = n
  }

  function svgPath(pts: number[]): string {
    if (!pts.length) return ''
    return pts.map((y, i) => {
      const px = (i / (pts.length - 1)) * CHART_W
      const py = (1 - y) * CHART_H
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
    }).join(' ')
  }

  $: path = svgPath(displayPoints)
  $: finalFreq = draws > 0 ? (redCount / draws * 100).toFixed(1) : null
  $: blackCount = draws - redCount
</script>

<div class="surv-screen">
  <div class="surv-header">
    <div class="surv-title">The Surveillance Room</div>
    <button class="back-btn" on:click={onReturn}>← Return to Table 1B</button>
  </div>

  <div class="surv-body">
    <div class="surv-intro">
      <p class="intro-text">
        The Nest's surveillance system can replay draws at any speed.
        Each simulation draws one card at a time from a standard 52-card deck, notes the suit color,
        then puts it back and reshuffles before the next draw.
      </p>
      <p class="intro-text">
        The graph shows the <strong>running frequency of red cards</strong> — how often red has appeared
        so far, as a fraction of total draws. There are 26 red cards in a 52-card deck,
        so the theoretical probability is <strong>26/52 = 50%</strong>.
        Watch what happens to that line over thousands of draws.
      </p>
    </div>

    <div class="sim-controls">
      <button class="sim-btn" on:click={() => runSimulation(100)}>Draw 100 cards</button>
      <button class="sim-btn" on:click={() => runSimulation(1000)}>Draw 1,000 cards</button>
      <button class="sim-btn primary" on:click={() => runSimulation(10000)}>Draw 10,000 cards</button>
    </div>

    {#if displayPoints.length > 0}
      <div class="chart-area">
        <div class="y-label-wrap">
          <span class="y-label">Freq of red</span>
        </div>
        <svg
          class="chart-svg"
          viewBox="0 0 {CHART_W} {CHART_H}"
          preserveAspectRatio="none"
          aria-label="Running frequency of red cards over {draws} draws"
        >
          <!-- grid lines -->
          <line x1="0" y1={CHART_H * 0.25} x2={CHART_W} y2={CHART_H * 0.25} class="grid-line" />
          <line x1="0" y1={CHART_H * 0.5}  x2={CHART_W} y2={CHART_H * 0.5}  class="grid-line ref-line" />
          <line x1="0" y1={CHART_H * 0.75} x2={CHART_W} y2={CHART_H * 0.75} class="grid-line" />

          <!-- data line -->
          <path d={path} class="data-line" />
        </svg>

        <div class="y-labels">
          <span>100%</span>
          <span>75%</span>
          <span class="ref-label">50% ← 26/52</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>

      <div class="sim-stats">
        <span class="stat">Draws: <strong>{draws.toLocaleString()}</strong></span>
        <span class="stat stat-red">Red: <strong>{redCount.toLocaleString()}</strong></span>
        <span class="stat stat-black">Black: <strong>{blackCount.toLocaleString()}</strong></span>
        <span class="stat">Running frequency: <strong class="freq-val">{finalFreq}%</strong></span>
      </div>

      <div class="observation-box">
        <p class="obs-text">
          {#if lastN >= 10000}
            After {draws.toLocaleString()} draws, the running frequency settled near <strong>50%</strong> — just as the deck's composition predicts.
            The Law of Large Numbers: over enough trials, relative frequency converges toward the theoretical probability.
            Any single draw is still 26 out of 52. The deck doesn't remember what just came up.
          {:else if lastN >= 1000}
            After {draws.toLocaleString()} draws, the line is getting closer to 50%.
            Draw 10,000 cards to see the full convergence.
          {:else}
            After {draws} draws, the frequency is still moving around a lot.
            Run more to see what happens over the long run.
          {/if}
        </p>
      </div>
    {:else}
      <div class="empty-state">
        <p>Run a simulation to see the convergence graph.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .surv-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #111a11;
    color: #f0ead6;
  }

  .surv-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0a120a;
    padding: 14px 28px;
    border-bottom: 1px solid #1e3a1e;
  }

  .surv-title {
    font-size: 1.1rem;
    color: #c8a84a;
    letter-spacing: 0.06em;
  }

  .back-btn {
    background: #1e2e1e;
    border: 1px solid #3a5a3a;
    border-radius: 6px;
    color: #f0ead6;
    font-family: inherit;
    font-size: 0.88rem;
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.12s;
  }
  .back-btn:hover { background: #263626; }

  .surv-body {
    flex: 1;
    padding: 28px 40px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    max-width: 780px;
    margin: 0 auto;
    width: 100%;
  }

  .intro-text {
    font-size: 0.95rem;
    line-height: 1.65;
    color: #d4c89a;
    margin-bottom: 4px;
  }
  .intro-text strong { color: #c8a84a; }

  .sim-controls {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .sim-btn {
    background: #1e2e1e;
    border: 1px solid #3a5a3a;
    border-radius: 6px;
    color: #f0ead6;
    font-family: inherit;
    font-size: 0.92rem;
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s;
  }
  .sim-btn:hover { background: #263626; border-color: #4a7a4a; }
  .sim-btn.primary { border-color: #c8a84a; color: #c8a84a; }
  .sim-btn.primary:hover { background: #1e2a12; }

  .chart-area {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .y-label-wrap {
    display: flex;
    align-items: center;
    height: 180px;
  }

  .y-label {
    font-size: 0.62rem;
    color: #2a4a2a;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .chart-svg {
    flex: 1;
    height: 180px;
    background: #0a120a;
    border: 1px solid #1e3a1e;
    border-radius: 4px;
    display: block;
  }

  .y-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 180px;
    font-size: 0.62rem;
    color: #2a4a2a;
    padding: 2px 0;
    white-space: nowrap;
  }
  .y-labels .ref-label { color: #4a7a4a; font-weight: bold; }

  .grid-line {
    stroke: #1e3a1e;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
  .ref-line {
    stroke: #2a5a2a;
    stroke-dasharray: 4 3;
    stroke-width: 1.5;
  }
  .data-line {
    fill: none;
    stroke: #c87a7a;
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }

  .sim-stats {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    font-size: 0.88rem;
  }
  .stat { color: #7a8a6a; }
  .stat strong { color: #f0ead6; }
  .stat-red strong  { color: #c87a7a; }
  .stat-black strong { color: #a0a0b0; }
  .freq-val { color: #c8a84a; }

  .observation-box {
    background: rgba(200, 168, 74, 0.07);
    border: 1px solid rgba(200, 168, 74, 0.25);
    border-radius: 6px;
    padding: 14px 18px;
  }
  .obs-text {
    font-style: italic;
    color: #d4c89a;
    line-height: 1.6;
    font-size: 0.95rem;
  }
  .obs-text strong { color: #c8a84a; font-style: normal; }

  .empty-state {
    padding: 32px;
    text-align: center;
    color: #4a6a4a;
    font-style: italic;
    font-size: 0.92rem;
  }
</style>
