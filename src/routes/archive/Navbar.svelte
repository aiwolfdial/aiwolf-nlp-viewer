<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import { onMount } from "svelte";

  const assetLogs = Object.entries(
    import.meta.glob("/static/assets/**/*.log", { query: "?raw" })
  ).reduce<Record<string, Record<string, string>>>((acc, [path, _]) => {
    const name = path.split("/").pop() || "";
    const folderPath = path
      .replace("/static/assets/", "")
      .replace(`/${name}`, "");
    const folder = folderPath || "root";

    if (!acc[folder]) {
      acc[folder] = {};
    }
    acc[folder][name] = `${base}${path.replace("/static", "")}`;

    return acc;
  }, {});

  let selectedFolder = $state("");
  let selectedLog = $state("");

  let {
    loadAssetLog,
    loadClipboardLog,
    handleFileSelect,
  }: {
    loadAssetLog: (path: string, name: string) => void;
    loadClipboardLog: () => void;
    handleFileSelect: (event: Event) => void;
  } = $props();

  onMount(() => {
    const urlParams = page.url.searchParams;
    const folderParam = urlParams.get("folder");
    const logParam = urlParams.get("log");

    if (folderParam && assetLogs[folderParam]) {
      selectedFolder = folderParam;

      if (logParam && assetLogs[folderParam][logParam]) {
        selectedLog = logParam;
        const logPath = assetLogs[folderParam][logParam];
        loadAssetLog(logPath, logParam);
      }
    }
  });

  function handleFolderChange(e: Event) {
    const target = e.currentTarget as HTMLSelectElement;
    selectedFolder = target.value;
    selectedLog = "";
    updateURL();
  }

  function handleLogChange(e: Event) {
    const target = e.currentTarget as HTMLSelectElement;
    const logName = target.value;
    if (logName && selectedFolder) {
      const logPath = assetLogs[selectedFolder][logName];
      loadAssetLog(logPath, logName);
      selectedLog = logName;
      updateURL();
    }
  }

  function updateURL() {
    const url = new URL(window.location.href);

    if (selectedFolder) {
      url.searchParams.set("folder", selectedFolder);
    } else {
      url.searchParams.delete("folder");
    }

    if (selectedLog) {
      url.searchParams.set("log", selectedLog);
    } else {
      url.searchParams.delete("log");
    }

    window.history.replaceState({}, "", url);
  }
</script>

<div class="navbar bg-base-100 flex justify-start gap-4 overflow-x-auto">
  <a class="text-3xl font-bold text-nowrap ml-2" href="./">
    aiwolf-nlp-viewer
  </a>
  <button class="btn ml-auto" onclick={loadClipboardLog}
    >クリップボードから貼り付け</button
  >

  <select
    class="select min-w-3xs w-3xs"
    bind:value={selectedFolder}
    onchange={handleFolderChange}
  >
    <option value="">フォルダを選択</option>
    {#each Object.keys(assetLogs) as folder}
      <option value={folder}>{folder}</option>
    {/each}
  </select>

  <select
    class="select min-w-3xs w-3xs"
    bind:value={selectedLog}
    onchange={handleLogChange}
    disabled={!selectedFolder}
  >
    <option value="">ログを選択</option>
    {#if selectedFolder && assetLogs[selectedFolder]}
      {#each Object.keys(assetLogs[selectedFolder]) as logName}
        <option value={logName}>{logName}</option>
      {/each}
    {/if}
  </select>

  <input
    class="file-input min-w-3xs w-3xs"
    type="file"
    accept=".log"
    multiple
    onchange={handleFileSelect}
  />
  <label class="flex items-center cursor-pointer gap-2">
    <iconify-icon inline icon="mdi:white-balance-sunny"></iconify-icon>
    <input type="checkbox" value="dark" class="toggle theme-controller" />
    <iconify-icon inline icon="mdi:moon-and-stars"></iconify-icon>
  </label>
</div>
