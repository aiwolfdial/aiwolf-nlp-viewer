<script lang="ts">
  import { base } from "$app/paths";
  import DayColumn from "$lib/components/archive/day-column.svelte";
  import type { Status } from "$lib/types/archive";
  import { processArchiveLog } from "$lib/utils/archive";

  type LogFile = {
    name: string;
    data: Record<string, Status>;
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

  function handleDrop(event: DragEvent) {
    const files = Array.from(event.dataTransfer?.files || []);
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

  let fileInput: HTMLInputElement | null = null;
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
  <link rel="stylesheet" href="{base}/global.css" />
</svelte:head>

<main>
  <div class="input-controls">
    <div class="select-container">
      <select
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
    </div>

    <div
      tabindex="0"
      class="file-input-container"
      role="button"
      on:dragover|preventDefault
      on:drop|preventDefault={handleDrop}
      on:click={() => fileInput?.click()}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          fileInput?.click();
        }
      }}
    >
      <div class="file-input-label">
        ファイルを選択もしくはドラッグアンドドロップしてください
      </div>
    </div>

    <input
      id="fileInput"
      type="file"
      accept=".log"
      multiple
      on:change={handleFileSelect}
      hidden
      bind:this={fileInput}
    />
  </div>

  <style>
  </style>

  {#if logFiles.length > 0}
    <div class="log-container">
      <div class="tabs-container">
        <div class="tabs">
          {#each logFiles as file, i}
            <div class="tab-wrapper" class:active={selectedTabIdx === i}>
              <button class="tab-button" on:click={() => (selectedTabIdx = i)}>
                {file.name}
              </button>
              <button
                class="close-button"
                on:click={() => closeTab(i)}
                aria-label="Close tab"
              >
                ✕
              </button>
            </div>
          {/each}
        </div>
      </div>
      <div class="days-container">
        {#each Object.entries(logFiles[selectedTabIdx].data) as [day, dayLog]}
          <DayColumn dayIdx={day} dayStatus={dayLog} />
        {/each}
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: var(--spacing-md);
    box-sizing: border-box;
  }

  .input-controls {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .select-container {
    width: 100%;
  }

  .select-container select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  .file-input-container {
    flex: 1;
    padding: 1rem;
    border: 2px dashed #ccc;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
  }

  .log-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tabs-container {
    flex-shrink: 0;
    overflow-x: auto;
    width: 100%;
  }

  .days-container {
    display: flex;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    flex-grow: 1;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .file-input-container {
    background-color: var(--color-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-md);
  }

  .file-input-container {
    height: 100%;
    border: 2px dashed #ccc;
    cursor: pointer;
    box-sizing: border-box;
  }

  .file-input-container:hover {
    border-color: var(--color-primary);
    background: var(--color-hover);
  }

  .file-input-label {
    display: block;
    text-align: center;
    cursor: pointer;
  }

  .tabs {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    min-width: 100%;
    width: fit-content;
  }

  .tab-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .tab-wrapper.active {
    background: var(--color-hover);
  }

  .tab-button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: none;
    border: none;
    cursor: pointer;
    white-space: nowrap;
  }

  .tab-wrapper.active .tab-button {
    font-weight: bold;
  }

  .close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px var(--spacing-sm);
    font-size: 0.8em;
    color: #666;
    transition: background-color 0.2s;
  }

  .close-button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
