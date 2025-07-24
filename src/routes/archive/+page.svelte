<script lang="ts">
  import type { DayStatus } from "$lib/types/archive";
  import { processArchiveLog } from "$lib/utils/archive";
  import "../../app.css";
  import DayColumn from "./DayColumn.svelte";
  import Navbar from "./Navbar.svelte";

  let { records, selectedKey } = $state({
    records: {} as Record<string, Record<string, DayStatus>>,
    selectedKey: "",
  });

  function handleFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = (e.target?.result as string) ?? "";
        records[file.name] = processArchiveLog(data);
        selectedKey = file.name;
      };
      reader.readAsText(file);
    });

    if (target) {
      target.value = "";
    }
  }

  function loadClipboardLog() {
    navigator.clipboard
      .readText()
      .then((text) => {
        const key = "Clipboard" + new Date().toISOString();
        records[key] = processArchiveLog(text);
        selectedKey = key;
      })
      .catch((error) => {
        console.error("Error reading clipboard:", error);
      });
  }

  function closeTab(key: string) {
    delete records[key];
    selectedKey = Object.keys(records)[0] || "";
  }

  async function loadAssetLog(path: string, name: string) {
    try {
      const response = await fetch(path);
      const data = await response.text();
      records[name] = processArchiveLog(data);
      selectedKey = name;
    } catch (error) {
      console.error("Error loading asset log:", error);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = (e.target?.result as string) ?? "";
        records[file.name] = processArchiveLog(data);
        selectedKey = file.name;
      };
      reader.readAsText(file);
    });
  }
</script>

<main class="h-screen flex flex-col">
  <Navbar {loadAssetLog} {loadClipboardLog} {handleFileSelect} />

  <div
    class="w-full h-full flex flex-col overflow-hidden bg-base-300"
    ondragover={handleDragOver}
    ondrop={handleDrop}
    role="region"
  >
    {#if Object.keys(records).length > 0}
      <div class="w-full shrink-0 overflow-x-auto flex gap-4 m-4">
        {#each Object.entries(records) as [key, value]}
          <div class="w-fit shrink-0 flex gap-0">
            <button
              class="btn"
              class:btn-active={selectedKey === key}
              onclick={() => (selectedKey = key)}
            >
              {key}
            </button>
            <button
              class="btn btn-error btn-square"
              onclick={() => closeTab(key)}
              aria-label="Close tab"
            >
              <iconify-icon icon="mdi:close"></iconify-icon>
            </button>
          </div>
        {/each}
      </div>
      <div class="overflow-y-hidden flex grow overflox-x-auto gap-4 p-4">
        {#each Object.entries(records[selectedKey]) as [day, dayLog]}
          <DayColumn dayIdx={day} dayStatus={dayLog} />
        {/each}
      </div>
    {/if}
  </div>
</main>
