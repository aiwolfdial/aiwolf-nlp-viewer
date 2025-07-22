<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { realtimeSettings } from "$lib/stores/realtime-settings";
  import type { Packet } from "$lib/types/realtime";
  import type { RealtimeSettings } from "$lib/types/realtime-settings";
  import { IdxToCustomName, initializeAgents } from "$lib/utils/realtime";
  import { realtimeSocketState, RealtimeConnectionStatus } from "$lib/utils/realtime-socket";
  import { onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { writable } from "svelte/store";
  import "../../app.css";
  import Canvas from "./Canvas.svelte";
  import HlsAudioPlayer from "./HlsAudioPlayer.svelte";
  import Navbar from "./Navbar.svelte";

  let focusIdx = $state<number | undefined>(undefined);

  const defaultPacket: Packet = {
    id: "",
    idx: -1,
    day: 0,
    is_day: true,
    agents: initializeAgents(13),
    event: "未接続",
    message: undefined,
    from_idx: undefined,
    to_idx: undefined,
    bubble_idx: undefined,
  };

  const currentPacket = writable<Packet>(defaultPacket);
  let settings = $state<RealtimeSettings>();
  let width = $state<number>(80);
  let isDragging = false;
  let containerRef: HTMLDivElement | null = null;

  function connectWithParams() {
    if (browser) {
      const params = page.url.searchParams;
      const url = params.get("url");
      const token = params.get("token");
      if (url) {
        realtimeSettings.update((value) => ({
          ...value,
          connection: {
            url: url ?? "",
            token: token ?? "",
          },
        }));
        realtimeSocketState.connect();
      }
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    realtimeSocketState.loadFromFiles(files);
  }

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
    connectWithParams();

    const unsubscribeCurrentPacket =
      realtimeSocketState.currentPacket.subscribe((packet) => {
        currentPacket.set(packet || defaultPacket);
      });

    const unsubscribeSettings = realtimeSettings.subscribe((value) => {
      settings = value;
    });

    onDestroy(() => {
      unsubscribeCurrentPacket();
      unsubscribeSettings();
    });

    if (browser) {
      window.addEventListener("beforeunload", (e) => {
        if ($realtimeSocketState.status === RealtimeConnectionStatus.CONNECTED) {
          e.preventDefault();
        }
      });
      window.addEventListener("popstate", (e) => {
        if ($realtimeSocketState.status === RealtimeConnectionStatus.CONNECTED) {
          e.preventDefault();
        }
      });
    }
  });

  let listRef: HTMLDivElement | null = null;
  $effect(() => {
    if (listRef && $realtimeSocketState.selectedPacketIdx !== null) {
      const buttons = listRef.querySelectorAll("button");
      if (
        $realtimeSocketState.selectedPacketIdx >= 0 &&
        $realtimeSocketState.selectedPacketIdx < buttons.length
      ) {
        buttons[$realtimeSocketState.selectedPacketIdx].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
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
    ondragover={handleDragOver}
    ondrop={handleDrop}
    role="region"
  >
    <div class="overflow-y-auto pr-2 h-full" style="width: {width}%">
      <Canvas packet={$currentPacket} bind:focusIdx />
    </div>
    <button
      class="cursor-ew-resize w-2 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition-colors border-0 my-2"
      onmousedown={onDragStart}
      ontouchstart={onDragStart}
      aria-label="Resize"
    ></button>
    <div class="flex-1 overflow-y-auto h-full pr-2">
      <div class="flex flex-col p-2">
        {#if browser}
          <HlsAudioPlayer
            url={settings?.connection.url ?? "http://localhost:8080/tts"}
            gameId={$realtimeSocketState.currentGameId ?? ""}
          />
        {/if}

        <div class="mb-2">
          <select
            class="w-full select"
            value={$realtimeSocketState.currentGameId}
            onchange={(e) => {
              const gameId = e.currentTarget.value;
              realtimeSocketState.switchToGame(gameId, true);
            }}
          >
            {#each $realtimeSocketState.gameItems as game}
              <option value={game.id}>
                {game.filename || game.id}
                ({new Date(game.updated_at).toLocaleTimeString()})
              </option>
            {/each}
          </select>
        </div>

        <div class="list overflow-y-auto flex-1 my-2" bind:this={listRef}>
          {#if $realtimeSocketState.currentGameId && $realtimeSocketState.entries[$realtimeSocketState.currentGameId]}
            {#each $realtimeSocketState.entries[$realtimeSocketState.currentGameId] || [] as packet, idx}
              {#if (idx > 0 && (packet.day !== $realtimeSocketState.entries[$realtimeSocketState.currentGameId][idx - 1].day || packet.is_day !== $realtimeSocketState.entries[$realtimeSocketState.currentGameId][idx - 1].is_day)) || idx === 0}
                <div class="divider">
                  {packet.day}日目 {packet.is_day ? "昼" : "夜"}
                </div>
              {/if}
              <button
                class="btn {idx === $realtimeSocketState.selectedPacketIdx
                  ? 'btn-primary'
                  : ''}"
                onclick={() => {
                  realtimeSocketState.selectPacket(idx, true);
                }}
              >
                {#if packet.event === "トーク" || packet.event === "囁き"}
                  {#if packet.event === "囁き" && focusIdx !== undefined && packet.agents.find((agent) => agent.idx === focusIdx)?.role !== "WEREWOLF"}
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                      {$_(`realtime.eventTypes.${packet.event}`, {
                        default: packet.event,
                      })}
                    </p>
                  {:else if packet.message === "Over"}
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.bubble_idx
                      )}
                    </p>
                    <iconify-icon inline icon="mdi:skip-forward"></iconify-icon>
                  {:else if packet.message === "Skip"}
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.bubble_idx
                      )}
                    </p>
                    <iconify-icon inline icon="mdi:arrow-u-down-right-bold"
                    ></iconify-icon>
                  {:else}
                    <p class="overflow-hidden text-ellipsis whitespace-nowrap">
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.bubble_idx
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
                        packet.from_idx
                      )}
                    {:else if packet.event === "追放" || packet.event === "襲撃"}
                      {IdxToCustomName(
                        settings?.display.text,
                        packet,
                        packet.to_idx
                      )}
                    {/if}
                    {$_(`realtime.eventTypes.${packet.event}`, {
                      default: packet.event,
                    })}
                  </p>
                {/if}
              </button>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>
