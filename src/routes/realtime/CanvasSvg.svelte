<script lang="ts">
  import { base } from "$app/paths";
  import { realtimeSettings } from "$lib/stores/realtime-settings";
  import type { Packet } from "$lib/types/realtime";
  import type { RealtimeSettings } from "$lib/types/realtime-settings";
  import { getElementCenter } from "$lib/utils/arrow";
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import ArrowSvg from "./ArrowSvg.svelte";
  import EventMessage from "./EventMessage.svelte";

  /**
   * リファクタリング版Canvasコンポーネント（SVG使用）
   *
   * 改善点:
   * 1. Canvas描画からSVG描画に変更（DOM操作可能、スケーラブル）
   * 2. メッセージ表示ロジックをEventMessageコンポーネントに分離
   * 3. 矢印計算ロジックをutilsに分離
   * 4. 型安全性の向上（EventType使用）
   */

  let {
    packet,
    focusIdx = $bindable(),
  }: { packet: Packet; focusIdx?: number } = $props();

  let settings = $state<RealtimeSettings>();

  const unsubscribe = realtimeSettings.subscribe((value) => {
    settings = value;
  });

  onDestroy(unsubscribe);

  let container: HTMLDivElement | undefined = $state();
  let svgElement: SVGSVGElement | undefined = $state();
  let arrowContainer: HTMLDivElement | undefined = $state();
  let bubbleContainer: HTMLDivElement | undefined = $state();

  // リサイズ時に再計算をトリガー
  let resizeTrigger = $state(0);

  // 矢印の座標データ型
  interface ArrowData {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    isCenter: boolean;
  }

  /**
   * イベントが表示対象かどうかを判定
   */
  function shouldShowEvent(): boolean {
    if (focusIdx === undefined) return true;

    switch (packet.event) {
      case "囁き":
        return (
          packet.agents.find((agent) => agent.idx === focusIdx)?.role ===
          "WEREWOLF"
        );
      case "占い":
      case "投票":
      case "襲撃投票":
        return packet.from_idx === focusIdx;
      default:
        return true;
    }
  }

  /**
   * 矢印の座標を計算して更新
   * リアクティブに計算することで、リサイズとテーマ変更の両方に対応
   */
  let eventArrow = $derived.by(() => {
    resizeTrigger; // リサイズ時の再計算をトリガー
    if (!svgElement || !container) return null;
    if (!shouldShowEvent()) return null;
    if (packet.from_idx === undefined || packet.to_idx === undefined)
      return null;

    const canvasRect = svgElement.getBoundingClientRect();
    const from = getElementCenter(`agent-${packet.from_idx}`, canvasRect);
    const to = getElementCenter(`agent-${packet.to_idx}`, canvasRect);

    if (!from || !to) return null;

    return {
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      isCenter: false,
    };
  });

  let bubbleArrow = $derived.by(() => {
    resizeTrigger; // リサイズ時の再計算をトリガー
    if (!svgElement || !container) return null;
    if (!shouldShowEvent()) return null;
    if (packet.bubble_idx === undefined) return null;

    const canvasRect = svgElement.getBoundingClientRect();
    const bubble = getElementCenter(`agent-${packet.bubble_idx}`, canvasRect);

    if (!bubble) return null;

    return {
      x1: canvasRect.width / 2,
      y1: canvasRect.height / 2,
      x2: bubble.x,
      y2: bubble.y,
      isCenter: true,
    };
  });

  // リサイズ監視
  $effect(() => {
    if (!container) return;

    const handleResize = () => {
      resizeTrigger++;
    };

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  });
</script>

<div class="h-full flex flex-col">
  <div class="bg-secondary" bind:this={arrowContainer}></div>
  <div class="w-full flex-1 mt-8">
    <div
      class="h-full flex items-center justify-center relative rounded-1/2 box-border"
      bind:this={container}
    >
      <!-- Day/Night表示 -->
      <pre
        class="base-content w-2/5 text-5xl font-bold opacity-70 absolute top-0 left-0 -mt-4 ml-8 select-none"
        >{$_("realtime.day", { values: { day: packet.day } })}<br />{packet.is_day
          ? $_("realtime.daytime")
          : $_("realtime.nighttime")}<br />{$_(
          `realtime.eventTypes.${packet.event}`,
          { default: packet.event }
        )}</pre
      >

      <!-- SVGレイヤー（矢印描画） -->
      <svg
        bind:this={svgElement}
        class="w-full h-full absolute top-0 left-0 pointer-events-none"
        style="z-index: 10;"
      >
        {#if bubbleArrow}
          <ArrowSvg
            x1={bubbleArrow.x1}
            y1={bubbleArrow.y1}
            x2={bubbleArrow.x2}
            y2={bubbleArrow.y2}
            colorElement={bubbleContainer}
            isCenter={bubbleArrow.isCenter}
          />
        {/if}
        {#if eventArrow}
          <ArrowSvg
            x1={eventArrow.x1}
            y1={eventArrow.y1}
            x2={eventArrow.x2}
            y2={eventArrow.y2}
            colorElement={arrowContainer}
            isCenter={eventArrow.isCenter}
          />
        {/if}
      </svg>

      <!-- メッセージ表示 -->
      <div bind:this={bubbleContainer} style="display: contents;">
        <EventMessage {packet} {focusIdx} />
      </div>

      <!-- エージェント配置 -->
      {#each packet.agents as agent, i}
        <div
          class="absolute origin-center text-center flex flex-col items-center transform-angle rounded-xl p-2"
          class:bg-focus={agent.idx === focusIdx}
          style="--angle: {i * (360 / packet.agents.length)}"
          id="agent-{agent.idx}"
        >
          <div class="avatar rounded-full bg-base-300">
            <div
              class="relative w-24 rounded-full ring-offset-base-100 ring ring-offset-2"
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
                <pre class="base-content text-2xl select-none">{agent.name}</pre
                >
              {:else}
                <pre class="base-content select-none">{agent.name}</pre>
              {/if}
            {/if}
            {#if settings?.display.canvas.team}
              {#if settings?.display.largeScale}
                <pre class="base-content text-2xl select-none">{agent.team}</pre
                >
              {:else}
                <pre class="base-content select-none">{agent.team}</pre>
              {/if}
            {/if}
            {#if settings?.display.canvas.role && (agent.idx === focusIdx || focusIdx === undefined)}
              {#if settings?.display.largeScale}
                <pre class="base-content text-2xl select-none">{agent.role}</pre
                >
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
