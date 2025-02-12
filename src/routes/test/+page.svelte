<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  interface Player {
    id: number;
    name: string;
    isAlive: boolean;
    votes: number[];
    speaking: boolean;
  }

  const activePlayer = writable<number | null>(null);
  const selectedPlayer = writable<number | null>(null);
  const players = writable<Player[]>(
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

  onMount(() => {
    // 初期サイズの設定
    updateContainerSize();

    const resizeObserver = new ResizeObserver(() => {
      updateContainerSize();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  });

  // コンテナサイズの更新関数
  function updateContainerSize() {
    // ビューポートの高さからコントロールパネルの高さ(88px)を引いた値を使用
    const maxHeight = window.innerHeight - 88;
    containerHeight = Math.max(
      600,
      Math.min(maxHeight, container.clientHeight)
    );
    containerWidth = container.clientWidth;
  }

  function getPlayerPosition(index: number, totalPlayers: number) {
    const radiusX = containerWidth * 0.45 - 50;
    const radiusY = containerHeight * 0.45 - 50;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    const angle = (2 * Math.PI * index) / totalPlayers - Math.PI / 2;
    return {
      x: centerX + radiusX * Math.cos(angle),
      y: centerY + radiusY * Math.sin(angle),
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

  let mode: "speak" | "vote" = "speak";

  function handlePlayerClick(index: number) {
    activePlayer.update((current) => {
      if (current === null) {
        return index;
      } else if (index !== current) {
        selectedPlayer.set(current);
        return index;
      }
      return current;
    });
  }

  function resetSelection() {
    activePlayer.set(null);
    selectedPlayer.set(null);
  }
</script>

<div class="w-full h-screen flex flex-col">
  <div
    bind:this={container}
    class="relative flex-1 bg-gray-100 rounded-lg overflow-hidden"
  >
    <svg viewBox="0 0 {containerWidth} {containerHeight}" class="w-full h-full">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={mode === "vote" ? "red" : "blue"}
          />
        </marker>
      </defs>

      {#if $selectedPlayer !== null && $activePlayer !== null && containerWidth > 0 && containerHeight > 0}
        {@const startPos = getPlayerPosition($selectedPlayer, $players.length)}
        {@const endPos = getPlayerPosition($activePlayer, $players.length)}
        <path
          d={createArrowPath(startPos.x, startPos.y, endPos.x, endPos.y)}
          stroke={mode === "vote" ? "red" : "blue"}
          stroke-width="2"
          fill="none"
          marker-end="url(#arrowhead)"
        />
      {/if}

      {#if containerWidth > 0 && containerHeight > 0}
        {#each $players as player, index}
          {@const pos = getPlayerPosition(index, $players.length)}
          <g
            transform="translate({pos.x - 25}, {pos.y - 25})"
            on:click={() => handlePlayerClick(index)}
            class="cursor-pointer"
          >
            <circle
              cx="25"
              cy="25"
              r="25"
              fill={$activePlayer === index ? "rgb(59, 130, 246)" : "white"}
              stroke={player.isAlive ? "black" : "red"}
              stroke-width="2"
            />
            <text
              x="25"
              y="30"
              text-anchor="middle"
              fill={$activePlayer === index ? "white" : "black"}
              font-size="12"
            >
              {player.name}
            </text>
          </g>
        {/each}
      {/if}
    </svg>
  </div>

  <div class="w-full bg-white border-t p-4">
    <div class="flex justify-center gap-4">
      <button
        class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
        class:opacity-50={mode !== "speak"}
        on:click={() => {
          mode = "speak";
          resetSelection();
        }}
      >
        <svg
          class="w-4 h-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          />
        </svg>
        発言モード
      </button>
      <button
        class="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg"
        class:opacity-50={mode !== "vote"}
        on:click={() => {
          mode = "vote";
          resetSelection();
        }}
      >
        <svg
          class="w-4 h-4 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16l4-4M12 16l-4-4" />
        </svg>
        投票モード
      </button>
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
