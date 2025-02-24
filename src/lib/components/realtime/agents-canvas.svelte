<script lang="ts">
  import { base } from "$app/paths";
  import type { Packet } from "$lib/types/realtime";
  import { onMount } from "svelte";

  let { packet }: { packet: Packet } = $props();

  let messageCanvas: HTMLCanvasElement;
  let arrowCanvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let messageBox: HTMLDivElement;

  onMount(() => {
    window.addEventListener("resize", render);
    return () => {
      window.removeEventListener("resize", render);
    };
  });

  $effect(() => {
    render();
  });

  function render() {
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
      ctx.globalAlpha = canvas === messageCanvas ? 1 : 1;
      ctx.lineWidth = 2;
    });

    packet.agents.forEach((agent) => {
      const { idx, targetIdxs = [], isAlive, isBubble } = agent;

      if (!isAlive) return;

      const from = document.getElementById(`agent-${idx}`);
      if (!(from instanceof HTMLElement)) return;
      const fromRect = from.getBoundingClientRect();
      const canvasRect = arrowCanvas.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;

      targetIdxs.forEach((idx) => {
        if (idx === -1) return;

        const to = document.getElementById(`agent-${idx}`);
        if (!(to instanceof HTMLElement)) return;
        const toRect = to.getBoundingClientRect();

        drawArrow(
          arrowCtx,
          fromX,
          fromY,
          toRect.left + toRect.width / 2 - canvasRect.left,
          toRect.top + toRect.height / 2 - canvasRect.top,
          false,
          getComputedStyle(messageBox).getPropertyValue("background-color")
        );
      });

      if (isBubble) {
        drawArrow(
          messageCtx,
          canvasRect.width / 2,
          canvasRect.height / 2,
          fromX,
          fromY,
          true,
          getComputedStyle(messageBox).getPropertyValue("background-color")
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
    isCenter = false,
    color = "#001fcc"
  ) {
    const arrowShape = isCenter ? [0, 0, 0, 0, 0, 15] : [0, 5, -20, 5, -20, 15];

    ctx.strokeStyle = ctx.fillStyle = color;

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

<h3 class="text-lg font-bold">
  {packet.day}日目 {packet.isDay ? "昼" : "夜"}
</h3>

<div class="circle" bind:this={container}>
  <canvas bind:this={messageCanvas} class="message-canvas"></canvas>
  <canvas bind:this={arrowCanvas} class="arrow-canvas"></canvas>
  <div
    bind:this={messageBox}
    class="card bg-base-100 card-xs shadow-sm overflow-auto p-4 z-1"
    style="width: 50%; max-height: 30%;"
    style:visibility={packet.message ? "visible" : "hidden"}
  >
    <div class="card-body">
      <p class="text-lg text-pretty text-center">
        {packet.message}
      </p>
    </div>
  </div>

  {#each packet.agents as agent, i}
    <div
      class="agent"
      style="--angle: {i * (360 / packet.agents.length)}"
      id="agent-{agent.idx}"
    >
      <div class="avatar">
        <div
          class="w-24 rounded-full ring-offset-base-100 ring ring-offset-2"
          class:ring-success={agent.isAlive}
          class:ring-error={!agent.isAlive}
          style:opacity={!agent.isAlive ? 0.25 : 1}
        >
          <img
            src="{base}/images/male/{agent.idx.toString().padStart(2, '0')}.png"
            alt={agent.name}
          />
        </div>
      </div>
      <span class="badge mt-2">{agent.name}</span>
    </div>
  {/each}
</div>

<style>
  .circle {
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

  .ring-success {
    --tw-ring-color: var(--color-success);
  }

  .ring-error {
    --tw-ring-color: var(--color-error);
  }
</style>
