<script lang="ts">
  import AgentsCanvas from "$lib/components/realtime/agents-canvas.svelte";
  import Navbar from "$lib/components/realtime/navbar.svelte";
  import type { RePacket } from "$lib/types/realtime";
  import { initializeAgents } from "$lib/utils/realtime";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../app.css";

  let selectedId = "";
  let selectedIdx = -1;

  let entries: Record<string, RePacket[]> = {};
  let packet: RePacket = {
    id: "",
    idx: 0,
    day: 0,
    isDay: true,
    agents: initializeAgents(5),
    message: "",
    summary: "",
    isDivider: false,
  };

  const unsubscribeEntries = realtimeSocketState.entries.subscribe((value) => {
    entries = value;
    if (selectedId === "" && Object.keys(value).length > 0) {
      selectedId = Object.keys(value)[0];
    }
    selectedIdx = entries[selectedId]?.length - 1;
    applyPacket(selectedId, selectedIdx);
  });

  onDestroy(() => {
    unsubscribeEntries();
  });

  function applyPacket(selectedId: string, selectedIdx: number) {
    if (!entries[selectedId]) return;
    if (selectedIdx < 0) return;
    if (selectedIdx >= entries[selectedId].length) return;
    packet = entries[selectedId][selectedIdx];
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main class="h-screen flex flex-col">
  <Navbar />
  <div class="flex flex-1 overflow-hidden w-full flex-col md:flex-row">
    <div class="flex-auto p-8 bg-base-300">
      <AgentsCanvas {packet}></AgentsCanvas>
    </div>
    <div class="w-full md:w-64 max-md:h-64 flex flex-col bg-base-200">
      <ul class="list overflow-y-auto flex-1">
        {#each entries[selectedId] || [] as p, idx}
          <li class="list-row">
            <button
              class="btn btn-wide"
              on:click={() => applyPacket(selectedId, idx)}
              >{idx + 1}. {p.summary}</button
            >
          </li>
        {/each}
      </ul>
    </div>
  </div>
</main>
