<script lang="ts">
  import type { FrequencyData } from '../game/frequencyData'
  import { freqPct } from '../game/frequencyData'

  export let open: boolean
  export let data: FrequencyData
  export let onToggle: () => void

  const HAND_ROWS: { key: keyof FrequencyData; label: string }[] = [
    { key: 'onePair',       label: 'One Pair'        },
    { key: 'twoPair',       label: 'Two Pair'        },
    { key: 'threeOfAKind',  label: 'Three of a Kind' },
    { key: 'straight',      label: 'Straight'        },
    { key: 'flush',         label: 'Flush'           },
    { key: 'fullHouse',     label: 'Full House'      },
    { key: 'fourOfAKind',   label: 'Four of a Kind'  },
    { key: 'straightFlush', label: 'Straight Flush'  },
    { key: 'highCard',      label: 'High Card'       },
  ]
</script>

<div class="freq-panel" class:open>
  <button
    class="freq-tab"
    on:click={onToggle}
    aria-label={open ? 'Close frequency table' : 'Open frequency table'}
    aria-expanded={open}
  >
    <span class="tab-text" aria-hidden="true">FREQ</span>
  </button>

  {#if open}
    <div class="freq-content">
      <div class="freq-header">Frequency Table</div>

      <table class="freq-table">
        <thead>
          <tr>
            <th class="col-hand">Hand</th>
            <th class="col-n">#</th>
            <th class="col-pct">Freq</th>
          </tr>
        </thead>
        <tbody>
          {#each HAND_ROWS as { key, label }}
            <tr class:nonzero={(data[key] as number) > 0}>
              <td class="col-hand">{label}</td>
              <td class="col-n">{data[key]}</td>
              <td class="col-pct">{freqPct(data[key] as number, data.total - data.folds)}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="outcomes-section">
        <div class="outcomes-header">Outcomes</div>
        <div class="outcomes-grid">
          <span class="out-label">Win</span>
          <span class="out-val win">{data.wins}</span>
          <span class="out-pct">{freqPct(data.wins, data.total)}</span>

          <span class="out-label">Loss</span>
          <span class="out-val loss">{data.losses}</span>
          <span class="out-pct">{freqPct(data.losses, data.total)}</span>

          <span class="out-label">Fold</span>
          <span class="out-val">{data.folds}</span>
          <span class="out-pct">{freqPct(data.folds, data.total)}</span>

          {#if data.ties > 0}
            <span class="out-label tie-label">Tie</span>
            <span class="out-val tie">{data.ties}</span>
            <span class="out-pct">{freqPct(data.ties, data.total)}</span>
          {/if}
        </div>
        <div class="total-row">
          Total: <strong>{data.total}</strong> {data.total === 1 ? 'hand' : 'hands'}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .freq-panel {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 24px;
    z-index: 100;
    display: flex;
    flex-direction: row;
    overflow: visible;
    transition: width 0.25s ease;
  }
  .freq-panel.open {
    width: 220px;
  }

  .freq-tab {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: #1e1e2e;
    border: 1px solid #7a9a7a;
    border-left: none;
    border-radius: 0 6px 6px 0;
    color: #7a9a7a;
    font-size: 0.6rem;
    font-family: monospace;
    font-weight: bold;
    letter-spacing: 0.12em;
    padding: 10px 5px;
    cursor: pointer;
    writing-mode: vertical-rl;
    opacity: 0.7;
    transition: opacity 0.15s, color 0.15s;
    z-index: 101;
  }
  .freq-panel.open .freq-tab {
    color: #7ac87a;
    opacity: 1;
  }
  .freq-tab:hover { opacity: 1; color: #7ac87a; }
  .tab-text { writing-mode: vertical-rl; text-orientation: mixed; }

  .freq-content {
    width: 220px;
    height: 100%;
    background: #0a120a;
    border-right: 1px solid #1e3a1e;
    overflow-y: auto;
    padding: 14px 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .freq-header {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #5a8a5a;
    padding-bottom: 6px;
    border-bottom: 1px solid #1e3a1e;
  }

  .freq-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.78rem;
  }
  .freq-table th {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #5a8a5a;
    padding: 2px 4px 4px;
    text-align: left;
    border-bottom: 1px solid #1e3a1e;
  }
  .freq-table td {
    padding: 3px 4px;
    color: #7aaa7a;
    vertical-align: middle;
  }
  .freq-table tr.nonzero td {
    color: #a0c070;
  }
  .col-hand { font-size: 0.73rem; }
  .col-n    { width: 24px; text-align: right; }
  .col-pct  { width: 46px; text-align: right; font-size: 0.7rem; color: #7aaa7a; }
  .freq-table tr.nonzero .col-pct { color: #7ac87a; }

  .outcomes-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .outcomes-header {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #5a8a5a;
  }
  .outcomes-grid {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 2px 6px;
    align-items: center;
    font-size: 0.78rem;
  }
  .out-label { color: #7aaa7a; }
  .out-val   { text-align: right; color: #a0c070; }
  .out-val.win  { color: #7ac87a; }
  .out-val.loss { color: #c87a7a; }
  .out-val.tie  { color: #c8a84a; }
  .tie-label    { color: #c8a84a; }
  .out-pct   { color: #7aaa7a; font-size: 0.7rem; }
  .total-row {
    font-size: 0.72rem;
    color: #5a8a5a;
    padding-top: 4px;
    border-top: 1px solid #1e3a1e;
  }
  .total-row strong { color: #7ac87a; }
</style>
