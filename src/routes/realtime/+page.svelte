<script lang="ts">
  import { base } from "$app/paths";
  import Agent from "$lib/components/realtime/agent.svelte";
  import AgentsCanvas from "$lib/components/realtime/agents-canvas.svelte";
  import ConnectionPanel from "$lib/components/realtime/connection-panel.svelte";
  import type { ReAgent, ReEntry } from "$lib/types/realtime";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy, onMount } from "svelte";

  const agentCount = 5;
  let text = "";
  let entries: { [id: string]: ReEntry[] } = {};
  let selectedId = "";
  let selectedIdx = -1;

  let agents: ReAgent[] = initializePlayers();

  function initializePlayers(): ReAgent[] {
    return Array.from({ length: agentCount }, (_, i) => ({
      idx: i + 1,
      label: `Player ${i + 1}`,
      disabled: false,
      targetIdx: -1,
      center: false,
    }));
  }

  // ストアからのデータを購読
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

  onMount(() => {
    realtimeSocketState.connect();
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

  function stepForward() {
    if (selectedId && selectedIdx < entries[selectedId].length - 1) {
      realtimeSocketState.selectedIdx.update((idx) => idx + 1);
    }
  }

  function stepBackward() {
    if (selectedIdx > 0) {
      realtimeSocketState.selectedIdx.update((idx) => idx - 1);
    }
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
  <link rel="stylesheet" href="{base}/global.css" />
</svelte:head>

<main>
  <ConnectionPanel />
  <AgentsCanvas {agents} {text}>
    {#each agents as agent, i}
      <Agent {agent} index={i} total={agents.length} />
    {/each}
  </AgentsCanvas>
  {#if selectedId !== ""}
    <div class="controls-container">
      <div class="controls">
        <button
          class="control-btn backward"
          on:click={stepBackward}
          disabled={selectedIdx <= 0}
        >
          前へ
        </button>

        <div class="progress-info">
          {#if entries[selectedId]}
            {selectedIdx + 1} / {entries[selectedId].length}
          {/if}
        </div>

        <button
          class="control-btn forward"
          on:click={stepForward}
          disabled={!entries[selectedId] ||
            selectedIdx >= entries[selectedId].length - 1}
        >
          次へ
        </button>
      </div>
    </div>
  {:else}
    <div class="no-data-message">
      WebSocket接続を待機中...データが到着すると表示されます
    </div>
  {/if}
</main>

<style>
  .controls-container {
    margin-top: 24px;
    padding: 16px;
    background-color: white;
    border-top: 1px solid #eee;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }

  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
  }

  .control-btn {
    padding: 10px 20px;
    background-color: #4a5568;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .control-btn:hover:not(:disabled) {
    background-color: #2d3748;
  }

  .control-btn:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }

  .progress-info {
    font-size: 16px;
    font-weight: 500;
    color: #4a5568;
    min-width: 80px;
    text-align: center;
  }

  .no-data-message {
    text-align: center;
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    color: #666;
  }
</style>
