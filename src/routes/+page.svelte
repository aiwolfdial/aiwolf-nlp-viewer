<script lang="ts">
  import { base } from "$app/paths";
  import DayColumn from "$lib/components/day-column.svelte";
  import { processLogs } from "$lib/utils/processor";

  type LogFile = {
    name: string;
    data: string[];
    processed: Record<string, any>;
  };

  let logFiles: LogFile[] = [];
  let selectedTabIndex = 0;

  function handleFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) ?? "";
        const data = content.split(/\r?\n/).filter((line) => line.trim());
        logFiles = [
          ...logFiles,
          {
            name: file.name,
            data: data,
            processed: processLogs(data),
          },
        ];
        selectedTabIndex = logFiles.length - 1;
      };
      reader.readAsText(file);
    });
  }

  function handleDrop(event: DragEvent) {
    const files = Array.from(event.dataTransfer?.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) ?? "";
        const data = content.split("\n").filter((line) => line.trim());
        logFiles = [
          ...logFiles,
          {
            name: file.name,
            data: data,
            processed: processLogs(data),
          },
        ];
        selectedTabIndex = logFiles.length - 1;
      };
      reader.readAsText(file);
    });
  }

  function closeTab(indexToRemove: number) {
    logFiles = logFiles.filter((_, index) => index !== indexToRemove);

    if (selectedTabIndex >= logFiles.length) {
      selectedTabIndex = logFiles.length - 1;
    }
  }

  const assetLogs = Object.entries(
    import.meta.glob("/static/assets/*.log", { eager: true, as: "raw" })
  ).map(([path, _]) => ({
    name: path.split("/").pop() || "",
    path: `${base}${path.replace("/static", "")}`,
  }));

  // アセットのログファイルを読み込む関数
  async function loadAssetLog(path: string, name: string) {
    try {
      const response = await fetch(path);
      const content = await response.text();
      const data = content.split(/\r?\n/).filter((line) => line.trim());
      logFiles = [
        ...logFiles,
        {
          name,
          data,
          processed: processLogs(data),
        },
      ];
      selectedTabIndex = logFiles.length - 1;
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
  <pre class="title">aiwolf-nlp-viewer</pre>
  {#if logFiles.length === 0}
    <div class="input-controls">
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
        <option value="">サンプルログを選択...</option>
        {#each assetLogs as log}
          <option value={log.path}>{log.name}</option>
        {/each}
      </select>
      <input
        id="fileInput"
        type="file"
        accept=".log"
        multiple
        on:change={handleFileSelect}
        hidden
        bind:this={fileInput}
      />
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
        <div class="file-input-label"></div>
        <span>ファイルを選択もしくはドラッグアンドドロップしてください</span>
      </div>
    </div>
  {/if}

  {#if logFiles.length > 0}
    <div class="log-container">
      <div class="tabs-container">
        <div class="tabs">
          {#each logFiles as file, i}
            <div class="tab-wrapper" class:active={selectedTabIndex === i}>
              <button
                class="tab-button"
                on:click={() => (selectedTabIndex = i)}
              >
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
        {#each Object.entries(logFiles[selectedTabIndex].processed) as [day, dayLog]}
          <DayColumn
            dayIdx={day}
            dayStatus={dayLog}
            dayStatuses={logFiles[selectedTabIndex].processed}
          />
        {/each}
      </div>
    </div>
  {/if}
</main>

<style>
  .input-controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  select {
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
</style>
