<script lang="ts">
  import { base } from "$app/paths";
  import { IdxToText } from "$lib/constants/translate";
  import { realtimeSettings } from "$lib/stores/realtime-settings";
  import type { Packet } from "$lib/types/realtime";
  import type { RealtimeSettings } from "$lib/types/realtime-settings";
  import { onDestroy, onMount } from "svelte";

  let { packet }: { packet: Packet } = $props();

  let settings = $state<RealtimeSettings>();

  const unsubscribeSettings = realtimeSettings.subscribe((value) => {
    settings = value;
  });

  onDestroy(unsubscribeSettings);

  let container: HTMLDivElement;
  let bubble: HTMLCanvasElement;
  let arrow: HTMLCanvasElement;
  let chat: HTMLDivElement;

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
    if (!bubble || !arrow || !container) return;

    const messageCtx = bubble.getContext("2d");
    const arrowCtx = arrow.getContext("2d");
    if (!messageCtx || !arrowCtx) return;

    const rect = container.getBoundingClientRect();
    [bubble, arrow].forEach((canvas) => {
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = canvas === bubble ? 1 : 1;
      ctx.lineWidth = 2;
    });

    packet.agents.forEach((agent) => {
      const { idx, targetIdxs = [], isAlive, isBubble } = agent;

      if (!isAlive) return;

      const from = document.getElementById(`agent-${idx}`);
      if (!(from instanceof HTMLElement)) return;
      const fromRect = from.getBoundingClientRect();
      const canvasRect = arrow.getBoundingClientRect();

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
          getComputedStyle(chat).getPropertyValue("background-color")
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
          getComputedStyle(chat).getPropertyValue("background-color")
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
    isCenter: boolean,
    color: string
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

<div class="h-full flex flex-col">
  {#if !settings?.display.largeScale}
    <div role="alert" class="alert m-4">
      <p class="text-lg font-bold">
        {packet.day}日目 {packet.isDay ? "昼" : "夜"}
      </p>
    </div>
  {/if}
  <div class="w-full flex-1 mt-8">
    <div
      class="h-full flex items-center justify-center relative rounded-1/2 box-border"
      bind:this={container}
    >
      {#if settings?.display.largeScale}
        <p
          class="text-9xl font-black opacity-50 absolute top-0 left-0 -mt-4 ml-8"
        >
          {packet.day}日目 {packet.isDay ? "昼" : "夜"}
        </p>
      {/if}
      <canvas bind:this={bubble} class="w-full h-full absolute top-0 left-0"
      ></canvas>
      <canvas bind:this={arrow} class="w-full h-full absolute top-0 left-0 z-10"
      ></canvas>
      <div
        bind:this={chat}
        class="w-1/2 h-fit max-h-1/3 card bg-base-100 card-md shadow-md overflow-auto z-20"
        hidden={!packet.message}
      >
        <div class="card-body">
          <p
            class={settings?.display.largeScale
              ? "text-3xl font-bold text-pretty text-center"
              : "text-lg text-pretty text-center"}
          >
            {packet.message}
          </p>
        </div>
      </div>
      {#each packet.agents as agent, i}
        <div
          class="absolute origin-center text-center flex flex-col items-center transform-angle"
          style="--angle: {i * (360 / packet.agents.length)}"
          id="agent-{agent.idx}"
        >
          <div class="avatar rounded-full bg-base-300">
            <div
              class={settings?.display.largeScale
                ? "relative w-48 rounded-full ring-offset-base-100 ring ring-offset-2"
                : "relative w-24 rounded-full ring-offset-base-100 ring ring-offset-2"}
              class:ring-success={agent.isAlive}
              class:ring-error={!agent.isAlive}
              style:opacity={!agent.isAlive ? 0.25 : 1}
            >
              <img
                src="{base}/images/male/{agent.idx
                  .toString()
                  .padStart(2, '0')}.png"
                alt={agent.name}
                class="w-full h-full"
              />
              {#if settings?.display.largeScale && settings?.display.agent.name}
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-9xl font-bold opacity-75">
                    {agent.idx}
                  </span>
                </div>
              {/if}
            </div>
          </div>
          {#if !settings?.display.largeScale && settings?.display.agent.name}
            <span class="badge mt-1">{IdxToText(agent.idx)}</span>
          {/if}
          {#if settings?.display.agent.team}
            {#if settings?.display.largeScale}
              <span class="text-2xl mt-2">{agent.team}</span>
            {:else}
              <span class="badge mt-1">{agent.team}</span>
            {/if}
          {/if}
          {#if settings?.display.agent.role}
            {#if settings?.display.largeScale}
              <span class="text-2xl mt-2">{agent.role}</span>
            {:else}
              <span class="badge mt-1">{agent.role}</span>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <footer class="footer footer-center text-base-content p-2">
    <aside>
      <p>イラスト : 石黒正数氏</p>
    </aside>
  </footer>
</div>

<style>
  .transform-angle {
    transform: translate(-50%, -50%);
    left: calc(50% + cos(var(--angle) * 1deg - 90deg) * 40%);
    top: calc(50% + sin(var(--angle) * 1deg - 90deg) * 40%);
  }

  .ring-success {
    --tw-ring-color: var(--color-success);
  }

  .ring-error {
    --tw-ring-color: var(--color-error);
  }
</style>
