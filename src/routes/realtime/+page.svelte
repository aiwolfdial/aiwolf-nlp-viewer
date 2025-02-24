<script lang="ts">
  import { browser } from "$app/environment";
  import AgentsCanvas from "$lib/components/realtime/agents-canvas.svelte";
  import Navbar from "$lib/components/realtime/navbar.svelte";
  import type { Packet } from "$lib/types/realtime";
  import { initializeAgents } from "$lib/utils/realtime";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../app.css";

  let selectedId = "";
  let selectedIdx = -1;
  let packet: Packet = {
    id: "",
    idx: -1,
    day: 0,
    isDay: true,
    agents: initializeAgents(5),
    message: "未接続",
    summary: "未接続",
    isDivider: false,
  };

  let socketEntries: Record<string, Packet[]>;
  let socketStatus: string;

  const unsubscribeEntries = realtimeSocketState.entries.subscribe((value) => {
    socketEntries = value;
    if (selectedId === "" && Object.keys(value).length > 0) {
      selectedId = Object.keys(value)[0];
    }
    selectedIdx = socketEntries[selectedId]?.length - 1;
    applyPacket(selectedId, selectedIdx);
  });

  const unsubscribeStatus = realtimeSocketState.subscribe((value) => {
    socketStatus = value.status;
  });

  onDestroy(() => {
    unsubscribeEntries();
    unsubscribeStatus();
  });

  function applyPacket(selectedId: string, selectedIdx: number) {
    if (!socketEntries[selectedId]) return;
    if (selectedIdx < 0) return;
    if (selectedIdx >= socketEntries[selectedId].length) return;
    packet = socketEntries[selectedId][selectedIdx];
  }

  if (browser) {
    window.addEventListener("beforeunload", (e) => {
      if (socketStatus === "connecting") {
        e.preventDefault();
      }
    });
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
        {#each socketEntries[selectedId] || [] as p, idx}
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
