<script lang="ts">
  import { base } from "$app/paths";

  const assetLogs = Object.entries(
    import.meta.glob("/static/assets/*.log", { query: "?raw" })
  ).reduce((acc, [path, _]) => {
    const name = path.split("/").pop() || "";
    return {
      ...acc,
      [name]: `${base}${path.replace("/static", "")}`,
    };
  }, {}) as Record<string, string>;

  let {
    loadAssetLog,
    handleFileSelect,
  }: {
    loadAssetLog: (path: string, name: string) => void;
    handleFileSelect: (event: Event) => void;
  } = $props();
</script>

<div class="navbar bg-base-100 flex justify-start gap-4 overflow-x-auto">
  <a class="text-3xl font-bold text-nowrap ml-2" href="./">
    aiwolf-nlp-viewer
  </a>
  <select
    class="select min-w-3xs w-3xs ml-auto"
    onchange={(e) => {
      const key = e.currentTarget.value;
      if (key) {
        loadAssetLog(assetLogs[key], key);
        e.currentTarget.value = "";
      }
    }}
  >
    <option value="">サンプルログを選択</option>
    {#each Object.entries(assetLogs) as [key]}
      <option value={key}>{key}</option>
    {/each}
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
