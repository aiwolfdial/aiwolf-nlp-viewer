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
      const from = document.getElementById(`player-${idx}`);
      if (!(from instanceof HTMLElement)) return;
      const fromRect = from.getBoundingClientRect();
      const canvasRect = arrowCanvas.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;

      if (targetIdx !== -1) {
        const to = document.getElementById(`player-${targetIdx}`);
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
    <div class="message-bubble">
      {text}
    </div>
  {/if}

  <slot />
</div>

<style>
  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: min(80vw, 100vw);
    height: min(64vh, 80vw);
    margin: auto;
    margin-top: 120px;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .message-canvas,
  .arrow-canvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  .arrow-canvas {
    z-index: 1;
  }

  .message-bubble {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    max-width: 70%;
    word-break: break-word;
    z-index: 2;
  }
</style>
