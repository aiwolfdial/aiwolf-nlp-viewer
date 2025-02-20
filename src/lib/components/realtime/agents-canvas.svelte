<script lang="ts">
  import type { ReAgent } from "$lib/types/realtime";
  import { afterUpdate, onMount } from "svelte";

  export let agents: ReAgent[] = [];
  export let text: string = "";

  let messageCanvas: HTMLCanvasElement;
  let arrowCanvas: HTMLCanvasElement;
  let container: HTMLDivElement;

  onMount(() => {
    window.addEventListener("resize", drawArrows);
    return () => {
      window.removeEventListener("resize", drawArrows);
    };
  });

  afterUpdate(() => {
    drawArrows();
  });

  function drawArrows() {
    if (!messageCanvas || !arrowCanvas || !container) return;

    const messageCtx = messageCanvas.getContext("2d");
    const arrowCtx = arrowCanvas.getContext("2d");
    if (!messageCtx || !arrowCtx) return;

    const rect = container.getBoundingClientRect();
    [messageCanvas, arrowCanvas].forEach((canvas) => {
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = canvas === messageCanvas ? 1 : 0.8;
      ctx.strokeStyle = ctx.fillStyle = "#001fcc";
      ctx.lineWidth = 2;
    });

    agents.forEach(({ idx, targetIdx, disabled, center }) => {
      if (disabled) return;
      const from = document.getElementById(`agent-${idx}`);
      if (!(from instanceof HTMLElement)) return;
      const fromRect = from.getBoundingClientRect();
      const canvasRect = arrowCanvas.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;

      if (targetIdx !== -1) {
        const to = document.getElementById(`agent-${targetIdx}`);
        if (!(to instanceof HTMLElement)) return;
        const toRect = to.getBoundingClientRect();
        drawArrow(
          arrowCtx,
          fromX,
          fromY,
          toRect.left + toRect.width / 2 - canvasRect.left,
          toRect.top + toRect.height / 2 - canvasRect.top
        );
      }

      if (center) {
        drawArrow(
          messageCtx,
          canvasRect.width / 2,
          canvasRect.height / 2,
          fromX,
          fromY,
          true
        );
      }
    });
  }

  function drawArrow(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isCenter = false
  ) {
    const arrowShape = isCenter ? [0, 0, 0, 0, 0, 15] : [0, 5, -20, 5, -20, 15];
    ctx.beginPath();
    let dx = x2 - x1;
    let dy = y2 - y1;
    let len = Math.sqrt(dx * dx + dy * dy);
    let sin = dy / len;
    let cos = dx / len;
    let points = [];
    points.push(0, 0);
    for (let i = 0; i < arrowShape.length; i += 2) {
      let x = arrowShape[i];
      let y = arrowShape[i + 1];
      points.push(x < 0 ? len + x : x, y);
    }
    points.push(len, 0);
    for (let i = arrowShape.length; i > 0; i -= 2) {
      let x = arrowShape[i - 2];
      let y = arrowShape[i - 1];
      points.push(x < 0 ? len + x : x, -y);
    }
    points.push(0, 0);
    for (let i = 0; i < points.length; i += 2) {
      let x = points[i] * cos - points[i + 1] * sin + x1;
      let y = points[i] * sin + points[i + 1] * cos + y1;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.fill();
  }
</script>

<div class="circle" bind:this={container}>
  <canvas bind:this={messageCanvas} class="message-canvas"></canvas>
  <canvas bind:this={arrowCanvas} class="arrow-canvas"></canvas>
  {#if text}
    <div class="card bg-base-100 w-64 shadow-sm">
      <p class="text-l text-center text-wrap p-4">
        {text}
        <!-- 我こそは、運命の糸を操る者なり。占いの結果、Agent[03]は人狼であったと断言せざるを得ない。 -->
      </p>
    </div>
  {/if}

  {#each agents as agent, i}
    <div
      class="agent"
      style="--angle: {i * (360 / agents.length)}"
      id="agent-{agent.idx}"
    >
      <img
        src="/images/male/{agent.idx.toString().padStart(2, '0')}.png"
        alt={agent.label}
        class:disabled={agent.disabled}
      />
      <p>{agent.label}</p>
    </div>
  {/each}
</div>

<style>
  .circle {
    background-color: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 80%;
    height: 80%;
    margin: auto;
    border-radius: 50%;
    box-sizing: border-box;
    margin-top: 5%;
  }

  .message-canvas,
  .arrow-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .arrow-canvas {
    z-index: 1;
  }

  .agent {
    position: absolute;
    transform: translate(-50%, -50%);
    transform-origin: center;
    left: calc(50% + cos(var(--angle) * 1deg) * 45%);
    top: calc(50% + sin(var(--angle) * 1deg) * 45%);
    text-align: center;
    width: 100px;
  }

  .agent > img {
    object-fit: cover;
    border-radius: 12%;
    border: 2px solid #ddd;
    transition: opacity 0.3s ease;
  }

  .agent > img.disabled {
    opacity: 0.5;
  }

  .agent > p {
    margin: 0;
  }
</style>
