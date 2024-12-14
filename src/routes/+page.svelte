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
        const data = content.split("\n").filter((line) => line.trim());
        logFiles = [
          ...logFiles,
          {
            name: file.name,
            data: data,
            processed: processLogs(data),
          },
        ];
        // Automatically select the newly added tab
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
        // Automatically select the newly added tab
        selectedTabIndex = logFiles.length - 1;
      };
      reader.readAsText(file);
    });
  }

  function closeTab(indexToRemove: number) {
    // Remove the tab and adjust the selected tab index
    logFiles = logFiles.filter((_, index) => index !== indexToRemove);

    // Adjust selected tab index
    if (selectedTabIndex >= logFiles.length) {
      selectedTabIndex = logFiles.length - 1;
    }
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
  <link rel="stylesheet" href="{base}/global.css" />
</svelte:head>

<svelte:window on:dragover|preventDefault on:drop|preventDefault={handleDrop} />

<main>
  <pre class="title">aiwolf-nlp-viewer</pre>
  {#if logFiles.length === 0}
    <div
      tabindex="0"
      class="file-input-container"
      role="button"
      on:dragover|preventDefault
      on:drop|preventDefault={handleDrop}
    >
      <label class="file-input-label">
        <input
          type="file"
          accept=".log"
          multiple
          on:change={handleFileSelect}
        />
        <span>ファイルを選択もしくはドラッグアンドドロップしてください</span>
      </label>
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
            {day}
            {dayLog}
            processedLogs={logFiles[selectedTabIndex].processed}
          />
        {/each}
      </div>
    </div>
  {/if}
</main>
