<script lang="ts">
  import { browser } from "$app/environment";
  import AgentsCanvas from "$lib/components/realtime/agents-canvas.svelte";
  import Navbar from "$lib/components/realtime/navbar.svelte";
  import type { Packet } from "$lib/types/realtime";
  import { initializeAgents } from "$lib/utils/realtime";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy, onMount } from "svelte";
  import { derived, writable } from "svelte/store";
  import "../../app.css";

  const selectedId = writable("");
  const selectedIdx = writable(0);

  const currentPacket = writable<Packet>({
    id: "",
    idx: -1,
    day: 0,
    isDay: true,
    agents: initializeAgents(5),
    message: "未接続",
    summary: "未接続",
    isDivider: false,
  });

  const entries = writable<Record<string, Packet[]>>({});
  const status = writable("");

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
        return {
          id: "",
          idx: -1,
          day: 0,
          isDay: true,
          agents: initializeAgents(5),
          message: "未接続",
          summary: "未接続",
          isDivider: false,
        };
      }
    ).subscribe((packet) => {
      currentPacket.set(packet);
    });

    onDestroy(() => {
      unsubscribeEntries();
      unsubscribeStatus();
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
      <AgentsCanvas packet={$currentPacket} />
    </div>
    <div class="w-full md:w-64 max-md:h-32 flex flex-col bg-base-200 px-2">
      <select class="select" bind:value={$selectedId}>
        {#each Object.keys($entries) as id}
          <option value={id}>{id}</option>
        {/each}
      </select>
      <ul class="list overflow-y-auto flex-1">
        {#each $entries[$selectedId] || [] as packet, idx}
          <button class="btn" onclick={() => selectedIdx.set(idx)}>
            {idx + 1}. {packet.summary}
          </button>
        {/each}
      </ul>
    </div>
  </div>
</main>
