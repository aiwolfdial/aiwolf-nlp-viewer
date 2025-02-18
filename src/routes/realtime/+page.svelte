<!-- src/routes/+page.svelte -->
<script lang="ts">
  import Player from "$lib/components/realtime-log/player.svelte";
  import { onMount } from "svelte";
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

  let containerWidth = 0;
  let containerHeight = 0;
  let container: HTMLDivElement;

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

  onMount(() => {
    updateContainerSize();
    const resizeObserver = new ResizeObserver(() => {
      updateContainerSize();
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  });

  function updateContainerSize() {
    const maxHeight = window.innerHeight - 168;
    containerHeight = Math.max(
      600,
      Math.min(maxHeight, container.clientHeight)
    );
    containerWidth = container.clientWidth;
  }

  function calculateOptimalRadius(totalPlayers: number) {
    const playerDiameter = 60;

    const maxAvailableRadiusX = containerWidth / 2 - playerDiameter;
    const maxAvailableRadiusY = containerHeight / 2 - playerDiameter;

    const minCircumference = playerDiameter * totalPlayers;
    const minRadius = minCircumference / (2 * Math.PI);

    const containerRatio = containerWidth / containerHeight;
    let radiusX, radiusY;

    if (containerRatio >= 1) {
      radiusY = maxAvailableRadiusY;
      radiusX = Math.min(maxAvailableRadiusX, radiusY * containerRatio);
    } else {
      radiusX = maxAvailableRadiusX;
      radiusY = Math.min(maxAvailableRadiusY, radiusX / containerRatio);
    }

    const currentScale = Math.min(radiusX / minRadius, radiusY / minRadius);

    if (currentScale < 1) {
      radiusX = minRadius * containerRatio;
      radiusY = minRadius;
    }

    const margin = playerDiameter / 2;
    radiusX = Math.min(radiusX, maxAvailableRadiusX - margin);
    radiusY = Math.min(radiusY, maxAvailableRadiusY - margin);

    return { radiusX, radiusY };
  }

  function approximateEllipseCircumference(a: number, b: number) {
    const h = (a - b) ** 2 / (a + b) ** 2;
    return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  }

  function getPlayerPosition(index: number, totalPlayers: number) {
    const { radiusX: a, radiusY: b } = calculateOptimalRadius(totalPlayers);
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    const ellipseCircumference = approximateEllipseCircumference(a, b);
    const arcLengthPerPlayer = ellipseCircumference / totalPlayers;

    let theta = 0;
    let accumulatedArcLength = 0;
    const step = 0.01;

    while (accumulatedArcLength < index * arcLengthPerPlayer) {
      const dTheta = step;
      const dArc = Math.sqrt(
        Math.pow(-a * Math.sin(theta) * dTheta, 2) +
          Math.pow(b * Math.cos(theta) * dTheta, 2)
      );
      accumulatedArcLength += dArc;
      theta += dTheta;
    }

    return {
      x: centerX + a * Math.cos(theta),
      y: centerY + b * Math.sin(theta),
    };
  }

  function createArrowPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    const dx = endX - startX;
    const dy = endY - startY;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);

    const shortenedLength = length - 40;
    const endPointX = startX + Math.cos(angle) * shortenedLength;
    const endPointY = startY + Math.sin(angle) * shortenedLength;
    return `M ${startX} ${startY} L ${endPointX} ${endPointY}`;
  }

  loadGameLog(JSON.stringify(exampleLog));
</script>

<div class="w-full h-screen flex flex-col">
  <div
    bind:this={container}
    class="relative flex-1 bg-gray-100 rounded-lg overflow-hidden"
  >
    <svg
      viewBox="0 0 {containerWidth} {containerHeight}"
      class="w-full h-full relative z-10"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={"red"} />
        </marker>
      </defs>

      <!-- 投票の矢印を表示 -->
      {#if containerWidth > 0 && containerHeight > 0}
        {#each $players as player}
          {#each player.votes as targetId}
            {@const startPos = getPlayerPosition(
              $players.findIndex((p) => p.id === player.id),
              $players.length
            )}
            {@const endPos = getPlayerPosition(
              $players.findIndex((p) => p.id === targetId),
              $players.length
            )}
            <path
              d={createArrowPath(startPos.x, startPos.y, endPos.x, endPos.y)}
              stroke="red"
              stroke-width="2"
              fill="none"
              marker-end="url(#arrowhead)"
              opacity="0.5"
            />
          {/each}
        {/each}
      {/if}

      <!-- 発言者の吹き出しを表示 -->
      {#if selectedLogIdx >= 0 && logs[selectedLogIdx].type === "speak" && logs[selectedLogIdx].message}
        {@const speaker = $players.find(
          (p) => p.id === logs[selectedLogIdx].from
        )}
        {@const speakerPos = getPlayerPosition(
          $players.findIndex((p) => p.id === logs[selectedLogIdx].from),
          $players.length
        )}
        <line
          x1={speakerPos.x}
          y1={speakerPos.y}
          x2={containerWidth / 2}
          y2={containerHeight / 2}
          stroke="black"
          stroke-width="2"
        />

        <rect
          x={containerWidth / 2 - 150}
          y={containerHeight / 2 - 30}
          width="300"
          height="60"
          fill="white"
          stroke="black"
          stroke-width="2"
          rx="10"
          ry="10"
        />

        <text
          x={containerWidth / 2}
          y={containerHeight / 2}
          font-size="16"
          fill="black"
          text-anchor="middle"
          dominant-baseline="middle"
          font-weight="bold"
        >
          {logs[selectedLogIdx].message}
        </text>
      {/if}

      <!-- プレイヤーを表示 -->
      {#if containerWidth > 0 && containerHeight > 0}
        {#each $players as player, index}
          {@const pos = getPlayerPosition(index, $players.length)}
          <g
            transform="translate({pos.x - 25}, {pos.y - 25})"
            class="cursor-pointer"
          >
            <Player
              agentIdx="Agent[{player.id.toString().padStart(2, '0')}]"
              imageURL="/images/male/{player.id
                .toString()
                .padStart(2, '0')}.png"
              isAlive={player.isAlive}
            />
          </g>
        {/each}
      {/if}
    </svg>
  </div>

  <!-- コントロールパネル -->
  <div class="w-full bg-white border-t p-4">
    <div class="flex flex-col gap-4">
      <!-- ログ操作ボタン -->
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

      <!-- ログ表示 -->
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
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
  }
</style>
