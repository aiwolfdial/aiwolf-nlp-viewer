<script lang="ts">
  import { browser } from "$app/environment";
  import { realtimeSettings } from "$lib/stores/realtime-settings";
  import type { Packet } from "$lib/types/realtime";
  import type { RealtimeSettings } from "$lib/types/realtime-settings";
  import { IdxToCustomName, initializeAgents } from "$lib/utils/realtime";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy, onMount } from "svelte";
  import { derived, writable } from "svelte/store";
  import "../../app.css";
  import Canvas from "./Canvas.svelte";
  import Navbar from "./Navbar.svelte";

  const selectedId = writable<string | null>(null);
  const selectedIdx = writable<number | null>(null);

  const defaultPacket: Packet = {
    id: "",
    idx: -1,
    day: 0,
    isDay: true,
    agents: initializeAgents(5),
    event: "未接続",
    message: undefined,
    fromIdx: undefined,
    toIdx: undefined,
    bubbleIdx: undefined,
  };

  const currentPacket = writable<Packet>(defaultPacket);

  const entries = writable<Record<string, Packet[]>>({});
  const status = writable("");

  let settings = $state<RealtimeSettings>();

  let width = $state<number>(80);
  let isDragging = false;
  let containerRef: HTMLDivElement | null = null;

  function onMouseMove(clientX: number) {
    if (!isDragging || !containerRef) return;
    const containerRect = containerRef.getBoundingClientRect();
    const relativeX = clientX - containerRect.left;
    const containerWidth = containerRect.width;
    width = Math.min(90, Math.max(10, (relativeX / containerWidth) * 100));
  }

  function onDragStart() {
    isDragging = true;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const moveHandler = (e: MouseEvent | TouchEvent) => {
      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      onMouseMove(clientX);
    };

    const stopHandler = () => {
      isDragging = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("mouseup", stopHandler);
      window.removeEventListener("touchend", stopHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("touchmove", moveHandler);
    window.addEventListener("mouseup", stopHandler);
    window.addEventListener("touchend", stopHandler);
  }

  onMount(() => {
    const unsubscribeEntries = realtimeSocketState.entries.subscribe(
      (value) => {
        entries.set(value);

        selectedId.update((currentId) => {
          if (currentId) return currentId;
          return Object.keys(value)[0];
        });

        selectedIdx.update(() => {
          if (!$selectedId) return null;
          const currentEntries = value[$selectedId];
          if (!currentEntries) return null;
          return currentEntries.length - 1;
        });
      }
    );

    const unsubscribeStatus = realtimeSocketState.subscribe((value) => {
      status.set(value.status);
    });

    selectedId.subscribe((id) => {
      entries.update((e) => {
        if (id && e[id]?.length > 0) {
          selectedIdx.set(e[id].length - 1);
        }
        return e;
      });
    });

    const unsubscribeSettings = realtimeSettings.subscribe((value) => {
      settings = value;
    });

    derived(
      [selectedId, selectedIdx, entries],
      ([$selectedId, $selectedIdx, $entries]) => {
        if (!$selectedId) return defaultPacket;
        if (!$selectedIdx) return defaultPacket;
        if (
          $entries[$selectedId] &&
          $selectedIdx >= 0 &&
          $selectedIdx < $entries[$selectedId].length
        ) {
          return $entries[$selectedId][$selectedIdx];
        }
        return defaultPacket;
      }
    ).subscribe((packet) => {
      currentPacket.set(packet);
    });

    onDestroy(() => {
      unsubscribeEntries();
      unsubscribeStatus();
      unsubscribeSettings();
    });

    if (browser) {
      window.addEventListener("beforeunload", (e) => {
        if ($status === "connecting") {
          e.preventDefault();
        }
      });
    }
  });
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main class="h-screen flex flex-col bg-base-300">
  <Navbar />
  <div
    class="flex flex-1 overflow-hidden w-full flex-row h-full"
    bind:this={containerRef}
  >
    <div class="overflow-y-auto pr-2 h-full" style="width: {width}%">
      <Canvas packet={$currentPacket} />
    </div>
    <button
      class="cursor-ew-resize w-2 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition-colors border-0 my-2"
      onmousedown={onDragStart}
      ontouchstart={onDragStart}
      aria-label="Resize"
    ></button>
    <div
      class="overflow-y-auto pl-2 h-full"
      style="width: {100 - width - 0.5}%;"
    >
      <div class="flex flex-col p-2">
        <select class="w-full select" bind:value={$selectedId}>
          {#each Object.keys($entries) as id}
            <option value={id}>{id}</option>
          {/each}
        </select>
        <ul class="list overflow-y-auto flex-1 my-2">
          {#if $selectedId}
            {#each $entries[$selectedId] || [] as packet, idx}
              {#if (idx > 0 && (packet.day !== $entries[$selectedId][idx - 1].day || packet.isDay !== $entries[$selectedId][idx - 1].isDay)) || idx === 0}
                <div class="divider">
                  {packet.day}日目 {packet.isDay ? "昼" : "夜"}
                </div>
              {/if}
              <button class="btn" onclick={() => selectedIdx.set(idx)}>
                {#if packet.event === "トーク" || packet.event === "囁き"}
                  {#if packet.message === "Over"}
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.bubbleIdx
                      )}
                    </p>
                    <iconify-icon inline icon="mdi:skip-forward"></iconify-icon>
                  {:else if packet.message === "Skip"}
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.bubbleIdx
                      )}
                    </p>
                    <iconify-icon inline icon="mdi:arrow-u-down-right-bold"
                    ></iconify-icon>
                  {:else}
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.bubbleIdx
                      ) +
                        "<" +
                        packet.message}
                    </p>
                  {/if}
                {:else}
                  <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                    {#if packet.event === "投票" || packet.event === "占い"}
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.fromIdx
                      )}
                    {:else if packet.event === "追放" || packet.event === "襲撃"}
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.toIdx
                      )}
                    {/if}
                    {packet.event}
                  </p>
                {/if}
              </button>
            {/each}
          {/if}
        </ul>
      </div>
    </div>
  </div>
</main>
