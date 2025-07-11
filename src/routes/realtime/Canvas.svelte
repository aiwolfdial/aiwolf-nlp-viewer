<script lang="ts">
  import { base } from "$app/paths";
  import { RoleToSpecies } from "$lib/constants/common";
  import { realtimeSettings } from "$lib/stores/realtime-settings";
  import type { Packet } from "$lib/types/realtime";
  import type { RealtimeSettings } from "$lib/types/realtime-settings";
  import { IdxToCustomName, xor } from "$lib/utils/realtime";
  import { onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  let {
    packet,
    focusIdx = $bindable(),
  }: { packet: Packet; focusIdx?: number } = $props();

  let settings = $state<RealtimeSettings>();

  const unsubscribe = realtimeSettings.subscribe((value) => {
    settings = value;
  });

  onDestroy(unsubscribe);

  let message = $derived.by(() => {
    switch (packet.event) {
      case "未接続":
        return "未接続";
      case "トーク":
        return packet.message;
      case "囁き":
        if (
          xor(
            focusIdx === undefined,
            packet.agents.find((agent) => agent.idx === focusIdx)?.role ===
              "WEREWOLF"
          )
        ) {
          return packet.message;
        }
        return "囁きました";
      case "襲撃投票":
        if (xor(focusIdx === undefined, packet.from_idx === focusIdx)) {
          return `${IdxToCustomName(settings?.display.bubble, packet, packet.from_idx)} が ${IdxToCustomName(settings?.display.bubble, packet, packet.to_idx)} に襲撃投票しました`;
        }
        return `襲撃投票しました`;
      case "投票":
        if (xor(focusIdx === undefined, packet.from_idx === focusIdx)) {
          return `${IdxToCustomName(settings?.display.bubble, packet, packet.from_idx)} が ${IdxToCustomName(settings?.display.bubble, packet, packet.to_idx)} に投票しました`;
        }
        return `${IdxToCustomName(settings?.display.bubble, packet, packet.from_idx)} が投票しました`;
      case "追放":
        if (packet.to_idx === undefined) {
          return "誰も追放されませんでした";
        }
        return `${IdxToCustomName(settings?.display.bubble, packet, packet.to_idx)} を追放しました`;
      case "襲撃":
        if (packet.to_idx === undefined) {
          return "誰も襲撃されませんでした";
        }
        if (packet.from_idx === -1) {
          return `${IdxToCustomName(settings?.display.bubble, packet, packet.to_idx)} が襲撃されましたが、護衛されました`;
        }
        return `${IdxToCustomName(settings?.display.bubble, packet, packet.to_idx)} が襲撃されました`;
      case "占い":
        if (xor(focusIdx === undefined, packet.from_idx === focusIdx)) {
          const targetRole = packet.agents.find(
            (agent) => agent.idx === packet.to_idx
          )?.role;
          const species = targetRole
            ? RoleToSpecies[targetRole as keyof typeof RoleToSpecies]
            : undefined;
          return `${IdxToCustomName(settings?.display.bubble, packet, packet.from_idx)} が ${IdxToCustomName(settings?.display.bubble, packet, packet.to_idx)} を占った結果、${species ? $_(`game.species.${species}`) : ""} でした`;
        }
        return "占いました";
      case "護衛":
        if (xor(focusIdx === undefined, packet.from_idx === focusIdx)) {
          return `${IdxToCustomName(settings?.display.bubble, packet, packet.from_idx)} が ${IdxToCustomName(settings?.display.bubble, packet, packet.to_idx)} を護衛対象にしました`;
        }
        return "護衛しました";
      case "終了":
        return packet.message + " が勝利しました";
      default:
        return packet.message ?? "不明なイベント";
    }
  });

  let container: HTMLDivElement;
  let bubble: HTMLCanvasElement;
  let arrow: HTMLCanvasElement;
  let bubbleContainer: HTMLDivElement;
  let arrowContainer: HTMLDivElement;

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

    if (focusIdx !== undefined) {
      if (
        packet.event === "囁き" &&
        packet.agents.find((agent) => agent.idx === focusIdx)?.role !==
          "WEREWOLF"
      )
        return;
      if (packet.event === "占い" && packet.from_idx !== focusIdx) return;
      if (packet.event === "投票" && packet.from_idx !== focusIdx) return;
      if (packet.event === "襲撃投票" && packet.from_idx !== focusIdx) return;
    }

    const messageCtx = bubble.getContext("2d");
    const arrowCtx = arrow.getContext("2d");
    if (!messageCtx || !arrowCtx) return;
    const canvasRect = arrow.getBoundingClientRect();

    if (packet.from_idx !== undefined && packet.to_idx !== undefined) {
      const from = document.getElementById(`agent-${packet.from_idx}`);
      if (!(from instanceof HTMLElement)) return;
      const fromRect = from.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - canvasRect.left;
      const fromY = fromRect.top + fromRect.height / 2 - canvasRect.top;

      const to = document.getElementById(`agent-${packet.to_idx}`);
      if (!(to instanceof HTMLElement)) return;
      const toRect = to.getBoundingClientRect();

      drawArrow(
        arrowCtx,
        fromX,
        fromY,
        toRect.left + toRect.width / 2 - canvasRect.left,
        toRect.top + toRect.height / 2 - canvasRect.top,
        false,
        getComputedStyle(arrowContainer).getPropertyValue("background-color")
      );
    }

    if (packet.bubble_idx !== undefined) {
      const bubble = document.getElementById(`agent-${packet.bubble_idx}`);
      if (!(bubble instanceof HTMLElement)) return;
      const bubbleRect = bubble.getBoundingClientRect();

      const bubbleX = bubbleRect.left + bubbleRect.width / 2 - canvasRect.left;
      const bubbleY = bubbleRect.top + bubbleRect.height / 2 - canvasRect.top;

      drawArrow(
        messageCtx,
        canvasRect.width / 2,
        canvasRect.height / 2,
        bubbleX,
        bubbleY,
        true,
        getComputedStyle(bubbleContainer).getPropertyValue("background-color")
      );
    }
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
    const arrowShape = isCenter ? [0, 0, 0, 0, 0, 30] : [0, 5, -20, 5, -20, 15];

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
  <div class="bg-secondary" bind:this={arrowContainer}></div>
  <div class="w-full flex-1 mt-8">
    <div
      class="h-full flex items-center justify-center relative rounded-1/2 box-border"
      bind:this={container}
    >
      <pre
        class="base-content w-2/5 text-5xl font-bold opacity-70 absolute top-0 left-0 -mt-4 ml-8 select-none">{packet.day}日目<br
        />{packet.is_day ? "昼" : "夜"}<br />{packet.event}</pre>
      <canvas
        bind:this={bubble}
        class="w-full h-full absolute top-0 left-0 pointer-events-none"
      ></canvas>
      <canvas
        bind:this={arrow}
        class="w-full h-full absolute top-0 left-0 z-10 pointer-events-none"
      ></canvas>
      <div
        bind:this={bubbleContainer}
        class="w-1/2 h-fit max-h-1/3 card bg-base-100 card-md shadow-md overflow-auto z-20"
        hidden={!message}
      >
        <div class="card-body">
          <p
            class={settings?.display.largeScale
              ? "base-content text-3xl font-bold text-pretty break-all text-center"
              : "base-content text-lg text-pretty break-all text-center"}
          >
            {message}
          </p>
        </div>
      </div>
      {#each packet.agents as agent, i}
        <div
          class="absolute origin-center text-center flex flex-col items-center transform-angle rounded-xl p-2"
          class:bg-focus={agent.idx === focusIdx}
          style="--angle: {i * (360 / packet.agents.length)}"
          id="agent-{agent.idx}"
        >
          <div class="avatar rounded-full bg-base-300">
            <div
              class={"relative w-24 rounded-full ring-offset-base-100 ring ring-offset-2"}
              class:ring-info={agent.is_alive}
              class:ring-error={!agent.is_alive}
              style:opacity={!agent.is_alive ? 0.25 : 1}
            >
              <button
                class="cursor-pointer"
                onclick={() => {
                  if (focusIdx === agent.idx) {
                    focusIdx = undefined;
                  } else {
                    focusIdx = agent.idx;
                  }
                }}
              >
                <img
                  src={agent.avatar === undefined
                    ? `${base}/images/male/${agent.idx.toString().padStart(2, "0")}.png`
                    : agent.avatar}
                  alt={agent.name}
                  class="w-full h-full"
                />
              </button>
            </div>
          </div>
          <div class="mt-2">
            {#if settings?.display.canvas.name}
              {#if settings?.display.largeScale}
                <pre
                  class="base-content text-2xl select-none">{agent.name}</pre>
              {:else}
                <pre class="base-content select-none">{agent.name}</pre>
              {/if}
            {/if}
            {#if settings?.display.canvas.team}
              {#if settings?.display.largeScale}
                <pre
                  class="base-content text-2xl select-none">{agent.team}</pre>
              {:else}
                <pre class="base-content select-none">{agent.team}</pre>
              {/if}
            {/if}
            {#if settings?.display.canvas.role && (agent.idx === focusIdx || focusIdx === undefined)}
              {#if settings?.display.largeScale}
                <pre
                  class="base-content text-2xl select-none">{agent.role}</pre>
              {:else}
                <pre class="base-content select-none">{agent.role}</pre>
              {/if}
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
  <footer class="footer footer-center text-base-content p-2">
    <aside>
      <span class="text-xs">
        イラスト:石黒正数氏, VOICEVOX:四国めたん,ずんだもん,春日部つむぎ,
        波音リツ,玄野武宏,白上虎太郎,青山龍星,冥鳴ひまり,九州そら,もち子(cv
        明日葉よもぎ),剣崎雌雄,WhiteCUL,後鬼,No.7,ちび式じい,
        櫻歌ミコ,小夜/SAYO,ナースロボ＿タイプＴ,†聖騎士 紅桜†,雀松朱司,
        麒ヶ島宗麟,春歌ナナ,猫使アル,猫使ビィ,中国うさぎ,栗田まろん,
        あいえるたん,満別花丸,琴詠ニア,Voidoll(CV:丹下桜),ぞん子,中部つるぎ</span
      >
    </aside>
  </footer>
</div>

<style>
  .transform-angle {
    transform: translate(-50%, -50%);
    left: calc(50% + cos(var(--angle) * 1deg - 90deg) * 40%);
    top: calc(50% + sin(var(--angle) * 1deg - 90deg) * 40%);
  }

  .ring-info {
    --tw-ring-color: var(--color-info);
  }

  .ring-error {
    --tw-ring-color: var(--color-error);
  }

  .bg-focus {
    background-color: oklch(
      from var(--color-primary) calc(l + (1 - l) / 2) c h / 0.3
    );
  }
</style>
