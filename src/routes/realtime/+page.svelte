<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { writable } from "svelte/store";

  const exampleLog = [
    {
      type: "speak",
      from: 1,
      timestamp: "2024-02-13 10:00:00",
      message: "おはようございます",
    },
    {
      type: "vote",
      from: 1,
      to: 2,
      timestamp: "2024-02-13 10:01:00",
    },
    {
      type: "death",
      to: 2,
      timestamp: "2024-02-13 10:02:00",
    },
  ];

  interface PlayerEntry {
    id: number;
    name: string;
    isAlive: boolean;
    votes: number[];
    speaking: boolean;
  }

  interface GameLogEntry {
    type: "speak" | "vote" | "death";
    from?: number;
    to?: number;
    timestamp: string;
    message?: string;
  }

  let logs: GameLogEntry[] = [];
  let selectedLogIdx = -1;

  const players = writable<PlayerEntry[]>(
    Array.from({ length: 13 }, (_, i) => ({
      id: i + 1,
      name: `Player ${i + 1}`,
      isAlive: true,
      votes: [],
      speaking: false,
    }))
  );

  function loadGameLog(data: string) {
    try {
      logs = JSON.parse(data) as GameLogEntry[];
      selectedLogIdx = -1;
      resetGameState();
    } catch (e) {
      console.error("Invalid game log format:", e);
    }
  }

  function resetGameState() {
    players.update((players) =>
      players.map((p) => ({
        ...p,
        isAlive: true,
        votes: [],
        speaking: false,
      }))
    );
  }

  function applyLogEntry(entry: GameLogEntry) {
    players.update((players) => {
      const newPlayers = [...players];

      switch (entry.type) {
        case "speak":
          if (entry.from !== undefined) {
            newPlayers.forEach((p) => (p.speaking = false));
            const speaker = newPlayers.find((p) => p.id === entry.from);
            if (speaker) speaker.speaking = true;
          }
          break;

        case "vote":
          if (entry.from !== undefined && entry.to !== undefined) {
            const voter = newPlayers.find((p) => p.id === entry.from);
            if (voter) voter.votes.push(entry.to);
          }
          break;

        case "death":
          if (entry.to !== undefined) {
            const player = newPlayers.find((p) => p.id === entry.to);
            if (player) player.isAlive = false;
          }
          break;
      }

      return newPlayers;
    });
  }

  function stepForward() {
    selectedLogIdx += 1;
    if (selectedLogIdx < logs.length) {
      applyLogEntry(logs[selectedLogIdx]);
    }
  }

  function stepBackward() {
    if (selectedLogIdx > -1) {
      resetGameState();
      for (let i = 0; i <= selectedLogIdx - 1; i++) {
        applyLogEntry(logs[i]);
      }
      selectedLogIdx -= 1;
    }
  }

  loadGameLog(JSON.stringify(exampleLog));
</script>

<main>
  <div class="circle">
    {#each $players as player, i}
      <div class="player" style="--angle: {i * (360 / $players.length)}">
        <img
          src="/images/male/{player.id.toString().padStart(2, '0')}.png"
          alt={player.name}
        />
        <p>{player.name}</p>
      </div>
    {/each}

    <svg class="arrow-layer">
      {#each $players as player}
        {#each player.votes as vote}
          {#if player.isAlive}
            <line stroke="red" stroke-width="2" marker-end="url(#arrowhead)" />
          {/if}
        {/each}
      {/each}
    </svg>
  </div>

  <div class="w-full bg-white border-t p-4">
    <div class="flex flex-col gap-4">
      <div class="flex justify-center gap-4">
        <button
          class="px-4 py-2 bg-gray-500 text-white rounded-lg"
          on:click={stepBackward}
          disabled={selectedLogIdx === -1}
        >
          前へ
        </button>
        <button
          class="px-4 py-2 bg-gray-500 text-white rounded-lg"
          on:click={stepForward}
          disabled={selectedLogIdx === logs.length - 1}
        >
          次へ
        </button>
      </div>

      {#if selectedLogIdx >= 0 && selectedLogIdx < logs.length}
        <div class="text-center">
          <p class="text-gray-600">
            {logs[selectedLogIdx].timestamp}:
            {#if logs[selectedLogIdx].type === "speak"}
              Player {logs[selectedLogIdx].from} が発言
              {#if logs[selectedLogIdx].message}
                「{logs[selectedLogIdx].message}」
              {/if}
            {:else if logs[selectedLogIdx].type === "vote"}
              Player {logs[selectedLogIdx].from} が Player {logs[selectedLogIdx]
                .to} に投票
            {:else if logs[selectedLogIdx].type === "death"}
              Player {logs[selectedLogIdx].to} が死亡
            {/if}
          </p>
        </div>
      {/if}
    </div>
  </div>
</main>

<svg style="display: none">
  <defs>
    <marker
      id="arrowhead"
      markerWidth="10"
      markerHeight="7"
      refX="10"
      refY="3.5"
      orient="auto"
    >
      <polygon points="0 0, 10 3.5, 0 7" fill="red" />
    </marker>
  </defs>
</svg>

<style>
  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: min(80vw, 100vw);
    height: min(64vh, 80vw);
    border: 20px solid #ddd;
    margin: auto;
    margin-top: 120px;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .player {
    position: absolute;
    --angle2: calc(var(--angle) * 1deg - 90deg);
    --x: calc(cos(var(--angle2)) * min(40vw, 50vw));
    --y: calc(sin(var(--angle2)) * min(32vh, 40vw));
    transform: translate(var(--x), var(--y));
    transform-origin: center;
    text-align: center;
  }

  .player > img {
    height: 12lvh;
    border-radius: 12%;
    border: 2px solid #ddd;
  }

  .player > p {
    margin: 0;
  }

  .arrow-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
</style>
