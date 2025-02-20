<script lang="ts">
  import AgentsCanvas from "$lib/components/realtime/agents-canvas.svelte";
  import Navbar from "$lib/components/realtime/navbar.svelte";
  import type { ReAgent, ReEntry } from "$lib/types/realtime";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../app.css";

  const agentCount = 13;
  let text = "";
  let entries: { [id: string]: ReEntry[] } = {};
  let selectedId = "";
  let selectedIdx = -1;

  let agents: ReAgent[] = initializePlayers();

  function initializePlayers(): ReAgent[] {
    return Array.from({ length: agentCount }, (_, i) => ({
      idx: i + 1,
      label: `Agent[${(i + 1).toString().padStart(2, "0")}]`,
      disabled: false,
      targetIdx: 3,
      center: true,
    }));
  }

  const unsubscribeEntries = realtimeSocketState.entries.subscribe((value) => {
    entries = value;
  });

  const unsubscribeSelectedId = realtimeSocketState.selectedId.subscribe(
    (value) => {
      selectedId = value;
    }
  );

  const unsubscribeSelectedIdx = realtimeSocketState.selectedIdx.subscribe(
    (value) => {
      selectedIdx = value;
      if (selectedId && entries[selectedId] && selectedIdx >= 0) {
        applyLogEntry(selectedIdx);
      }
    }
  );

  onDestroy(() => {
    unsubscribeEntries();
    unsubscribeSelectedId();
    unsubscribeSelectedIdx();
  });

  function applyLogEntry(idx: number) {
    if (
      !selectedId ||
      idx < 0 ||
      !entries[selectedId] ||
      idx >= entries[selectedId].length
    )
      return;

    agents = initializePlayers();
    text = "";

    for (let i = 0; i <= idx; i++) {
      const entry = entries[selectedId][i];

      if (i > 0) {
        if (entry.action !== entries[selectedId][i - 1].action) {
          text = "";
          agents = agents.map((p) => ({
            ...p,
            targetIdx: -1,
            center: false,
          }));
        }
      }

      agents = agents.map((p) => {
        switch (entry.action) {
          case "execute":
            if (p.idx === entry.agent) {
              return {
                ...p,
                disabled: entry.result as boolean,
              };
            }
            break;
          case "attack":
          case "divine":
          case "guard":
          case "vote":
          case "attackVote":
            if (p.idx === entry.agent) {
              return {
                ...p,
                targetIdx: entry.target || -1,
              };
            }
            break;
          case "talk":
          case "whisper":
            text = entry.text || "";
            return {
              ...p,
              center: p.idx === entry.agent,
            };
        }
        return p;
      });
    }
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main class="h-screen flex flex-col">
  <Navbar />
  <div class="flex flex-1 overflow-hidden w-full flex-col md:flex-row">
    <div class="flex-auto p-8 bg-base-300">
      <AgentsCanvas {agents} {text}></AgentsCanvas>
    </div>
    <div class="w-full md:w-64 max-md:h-64 flex flex-col bg-base-200">
      <ul class="list overflow-y-auto flex-1">
        {#each entries[selectedId] || [] as entry, idx}
          <li class="list-row">
            <div>
              <div>{entry.action}</div>
              <div class="text-xs uppercase font-semibold opacity-60"></div>
            </div>
            <button class="btn btn-square" on:click={() => applyLogEntry(idx)}>
              <iconify-icon inline icon="mdi:play"></iconify-icon>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</main>
