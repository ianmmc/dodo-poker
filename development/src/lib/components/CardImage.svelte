<script lang="ts">
  import { cardToSvgPath, CARD_BACK_PATH } from '../game/card'
  import type { Card } from '../game/card'

  export let card: Card | null = null
  export let faceDown = false
  export let selected = false
  export let clickable = false
</script>

<button
  class="card"
  class:selected
  class:clickable
  class:face-down={faceDown || !card}
  on:click
  disabled={!clickable}
  aria-pressed={selected}
>
  {#if faceDown || !card}
    <img src={CARD_BACK_PATH} alt="Card back" />
  {:else}
    <img src={cardToSvgPath(card)} alt={card} />
  {/if}
</button>

<style>
  .card {
    background: none;
    border: 3px solid transparent;
    border-radius: 6px;
    cursor: default;
    padding: 0;
    transition: transform 0.1s, border-color 0.1s;
  }
  .card img {
    display: block;
    width: 80px;
    height: auto;
    border-radius: 4px;
  }
  .clickable {
    cursor: pointer;
  }
  .clickable:hover {
    transform: translateY(-6px);
  }
  .selected {
    border-color: #e04a2f;
    transform: translateY(-10px);
  }
</style>
