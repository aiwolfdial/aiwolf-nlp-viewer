<script lang="ts">
  import type { ReAgent } from "$lib/types/realtime";

  export let agent: ReAgent;
  export let index: number;
  export let total: number;
</script>

<div
  class="player"
  style="--angle: {index * (360 / total)}"
  id="player-{agent.idx}"
>
  <img
    src="/images/male/{agent.idx.toString().padStart(2, '0')}.png"
    alt={agent.label}
    class:disabled={agent.disabled}
  />
  <p>{agent.label}</p>
</div>

<style>
  .player {
    position: absolute;
    --angle2: calc(var(--angle) * 1deg - 90deg);
    --x: calc(cos(var(--angle2)) * min(40vw, 50vw));
    --y: calc(sin(var(--angle2)) * min(32vh, 40vw));
    transform: translate(var(--x), var(--y));
    transform-origin: center;
    text-align: center;
  }

  .player > img {
    height: 12lvh;
    border-radius: 12%;
    border: 2px solid #ddd;
    transition: opacity 0.3s ease;
  }

  .player > img.disabled {
    opacity: 0.5;
  }

  .player > p {
    margin: 0;
  }
</style>
