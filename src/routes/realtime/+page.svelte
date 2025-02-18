<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { base } from "$app/paths";

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
  let speechMessage = "";
  let speakingPlayerId: number | null = null;

  let players = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    name: `Player ${i + 1}`,
    isAlive: true,
    votes: [],
    speaking: false,
  }));

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
    players = players.map((p) => ({
      ...p,
      isAlive: true,
      votes: [],
      speaking: false,
    }));
    speechMessage = "";
    speakingPlayerId = null;
    drawArrows();
  }

  function applyLogEntry(entry: GameLogEntry) {
    players = players.map((p) => {
      if (entry.type === "speak" && entry.from !== undefined) {
        speechMessage = entry.message || "";
        speakingPlayerId = entry.from;
        return {
          ...p,
          speaking: p.id === entry.from,
        };
      }

      if (entry.type === "vote") {
        if (p.id === entry.from && entry.to !== undefined) {
          return {
            ...p,
            votes: [...p.votes, entry.to],
          };
        }
      }

      if (entry.type === "death" && entry.to !== undefined) {
        if (p.id === entry.to) {
          return {
            ...p,
            isAlive: false,
          };
        }
      }

      return p;
    });
    drawArrows();
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

  function drawArrows() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const circle = document.querySelector(".circle") as HTMLDivElement;
    const rect = circle.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.fillStyle = "red";

    players.forEach((player) => {
      player.votes.forEach((targetId) => {
        const fromEl = document.getElementById(`player-${player.id}`);
        const toEl = document.getElementById(`player-${targetId}`);
        if (fromEl && toEl) {
          const fromRect = fromEl.getBoundingClientRect();
          const toRect = toEl.getBoundingClientRect();
          const x1 = fromRect.left + fromRect.width / 2 - rect.left;
          const y1 = fromRect.top + fromRect.height / 2 - rect.top;
          const x2 = toRect.left + toRect.width / 2 - rect.left;
          const y2 = toRect.top + toRect.height / 2 - rect.top;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x2, y2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    if (speakingPlayerId !== null) {
      const playerEl = document.getElementById(`player-${speakingPlayerId}`);
      if (playerEl) {
        const playerRect = playerEl.getBoundingClientRect();
        const x1 = playerRect.left + playerRect.width / 2 - rect.left;
        const y1 = playerRect.top + playerRect.height / 2 - rect.top;
        const x2 = rect.width / 2;
        const y2 = rect.height / 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }

  loadGameLog(JSON.stringify(exampleLog));
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
  <link rel="stylesheet" href="{base}/global.css" />
  <!-- <script src="{base}/leader-line.min.js" defer></script> -->
</svelte:head>

<svelte:window on:resize={drawArrows} />

<main>
  <div class="circle">
    <canvas
      id="canvas"
      style="position: absolute; top: 0; left: 0; pointer-events: none;"
    ></canvas>
    <div
      id="speechBubble"
      style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 10px; border-radius: 10px; box-shadow: 0 0 5px rgba(0,0,0,0.3);"
    >
      {speechMessage}
    </div>
    {#each players as player, i}
      <div
        class="player"
        style="--angle: {i * (360 / players.length)}"
        id="player-{player.id}"
      >
        <img
          src="/images/male/{player.id.toString().padStart(2, '0')}.png"
          alt={player.name}
        />
        <p>{player.name}</p>
      </div>
    {/each}
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
    /* border: 20px solid #ddd; */
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
</style>
