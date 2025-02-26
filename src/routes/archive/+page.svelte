<script lang="ts">
  import { base } from "$app/paths";
  import DayColumn from "$lib/components/archive/day-column.svelte";
  import type { DayStatus } from "$lib/types/archive";
  import { processArchiveLog } from "$lib/utils/archive";
  import "../../app.css";

  type LogFile = {
    name: string;
    data: Record<string, DayStatus>;
  };

  let logFiles: LogFile[] = [];
  let selectedTabIdx = 0;

  function handleFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = (e.target?.result as string) ?? "";
        logFiles = [
          ...logFiles,
          {
            name: file.name,
            data: processArchiveLog(data),
          },
        ];
        selectedTabIdx = logFiles.length - 1;
      };
      reader.readAsText(file);
    });

    if (target) {
      target.value = "";
    }
  }

  function closeTab(idx: number) {
    logFiles = logFiles.filter((_, index) => index !== idx);
    if (selectedTabIdx >= logFiles.length) {
      selectedTabIdx = logFiles.length - 1;
    }
  }

  const assetLogs = Object.entries(
    import.meta.glob("/static/assets/*.log", { query: "?raw" })
  ).map(([path, _]) => ({
    name: path.split("/").pop() || "",
    path: `${base}${path.replace("/static", "")}`,
  }));

  async function loadAssetLog(path: string, name: string) {
    try {
      const response = await fetch(path);
      const data = await response.text();
      logFiles = [
        ...logFiles,
        {
          name,
          data: processArchiveLog(data),
        },
      ];
      selectedTabIdx = logFiles.length - 1;
    } catch (error) {
      console.error("Error loading asset log:", error);
    }
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main class="h-screen flex flex-col">
  <div class="navbar bg-base-100 flex justify-start">
    <h1 class="text-3xl font-bold truncate mx-4">aiwolf-nlp-viewer</h1>
    <select
      class="select w-full max-w-xs ml-auto"
      on:change={(e) => {
        const path = e.currentTarget.value;
        if (path) {
          const selected = assetLogs.find((log) => log.path === path);
          if (selected) {
            loadAssetLog(selected.path, selected.name);
          }
          e.currentTarget.value = "";
        }
      }}
    >
      <option value="">サンプルログを選択</option>
      {#each assetLogs as log}
        <option value={log.path}>{log.name}</option>
      {/each}
    </select>
    <input
      class="file-input w-full max-w-xs mx-2"
      type="file"
      accept=".log"
      multiple
      on:change={handleFileSelect}
    />
    <label class="flex items-center cursor-pointer gap-2 mx-2">
      <iconify-icon inline icon="mdi:white-balance-sunny"></iconify-icon>
      <input type="checkbox" value="dark" class="toggle theme-controller" />
      <iconify-icon inline icon="mdi:moon-and-stars"></iconify-icon>
    </label>
  </div>

  <div class="w-full h-full flex flex-col overflow-hidden bg-base-300">
    {#if logFiles.length > 0}
      <div class="w-full shrink-0 overflow-x-auto flex gap-4 m-4">
        {#each logFiles as file, i}
          <div class="w-fit shrink-0 flex gap-0">
            <button
              class="btn"
              class:btn-active={selectedTabIdx === i}
              on:click={() => (selectedTabIdx = i)}
            >
              {file.name}
            </button>
            <button
              class="btn btn-error btn-square"
              on:click={() => closeTab(i)}
              aria-label="Close tab"
            >
              <iconify-icon icon="mdi:close"></iconify-icon>
            </button>
          </div>
        {/each}
      </div>
      <div class="overflow-y-hidden flex grow overflox-x-auto gap-4 p-4">
        {#each Object.entries(logFiles[selectedTabIdx].data) as [day, dayLog]}
          <DayColumn dayIdx={day} dayStatus={dayLog} />
        {/each}
      </div>
    {/if}
  </div>
</main>
