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

  const selectedId = writable("");
  const selectedIdx = writable(0);

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

  onMount(() => {
    const unsubscribeEntries = realtimeSocketState.entries.subscribe(
      (value) => {
        entries.set(value);
        selectedId.update((id) => {
          if (!id) {
            const firstKey = Object.keys(value)[0] || "";
            return firstKey;
          }
          return id;
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

<main class="h-screen flex flex-col">
  <Navbar />
  <div class="flex flex-1 overflow-hidden w-full flex-col md:flex-row">
    <div class="flex-auto bg-base-300">
      <Canvas packet={$currentPacket} />
    </div>
    <div class="w-full md:w-64 max-md:h-32 flex flex-col bg-base-200 p-2">
      <select class="w-full select" bind:value={$selectedId}>
        {#each Object.keys($entries) as id}
          <option value={id}>{id}</option>
        {/each}
      </select>
      <ul class="list overflow-y-auto flex-1 my-2 px-2">
        {#each $entries[$selectedId] || [] as packet, idx}
          {#if idx > 0 && (packet.day !== $entries[$selectedId][idx - 1].day || packet.isDay !== $entries[$selectedId][idx - 1].isDay)}
            <div class="divider">
              {packet.day}日目 {packet.isDay ? "昼" : "夜"}
            </div>
          {/if}
          {#if idx == 0}
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
      </ul>
    </div>
  </div>
</main>
