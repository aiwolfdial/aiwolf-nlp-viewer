<script lang="ts">
  import AgentsCanvas from "$lib/components/realtime/agents-canvas.svelte";
  import Navbar from "$lib/components/realtime/navbar.svelte";
  import {
    ActionMap,
    ActionPrefixMap,
    IdxToText,
  } from "$lib/constants/translate";
  import type { ReAgent, ReEntry } from "$lib/types/realtime";
  import { initializeAgents } from "$lib/utils/realtime";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../app.css";

  let text = "";
  let selectedId = "";
  let selectedIdx = -1;

  let entries: Record<string, ReEntry[]> = {};
  let agents: ReAgent[] = initializeAgents(13);

  const unsubscribeEntries = realtimeSocketState.entries.subscribe((value) => {
    entries = value;
    if (!selectedId && selectedIdx === -1) {
      selectedId = Object.keys(value)[0];
    }
    if (selectedId && value[selectedId]) {
      selectedIdx = value[selectedId].length - 1;
    }
    applyEntries(selectedId, selectedIdx);
  });

  onDestroy(() => {
    unsubscribeEntries();
  });

  function applyEntries(selectedId: string, selectedIdx: number) {
    agents = initializeAgents(13);
    text = "";

    for (let i = 0; i <= selectedIdx; i++) {
      const entry = entries[selectedId][i];

      if (i > 0) {
        if (entry.action !== entries[selectedId][i - 1].action) {
          text = "";
          agents = agents.map((p) => ({
            ...p,
            targets: [],
            center: false,
          }));
        }
      }

      agents = agents.map((p) => {
        switch (entry.action) {
          case "execute":
          case "attack":
            if (p.idx === entry.target) {
              text =
                IdxToText(entry.target) +
                ActionPrefixMap[entry.action] +
                ActionMap[entry.action];
              return {
                ...p,
                disabled:
                  entry.action === "execute" ? true : (entry.result as boolean),
              };
            }
            break;
          case "divine":
          case "guard":
          case "vote":
          case "attackVote":
            if (p.idx === entry.agent && entry.target !== undefined) {
              text =
                IdxToText(entry.agent) +
                "が" +
                IdxToText(entry.target) +
                ActionPrefixMap[entry.action] +
                ActionMap[entry.action];
              return {
                ...p,
                targets: [
                  {
                    targetIdx: entry.target,
                    color: "red",
                  },
                ],
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
              <div>{ActionMap[entry.action]}</div>
              <div class="text-xs uppercase font-semibold opacity-60"></div>
            </div>
            <button
              class="btn btn-square"
              on:click={() => applyEntries(selectedId, idx)}
            >
              <iconify-icon inline icon="mdi:play"></iconify-icon>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</main>
