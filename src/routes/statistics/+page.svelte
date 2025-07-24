<script lang="ts">
  import { base } from "$app/paths";
  import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";
  import { _ } from "svelte-i18n";
  import "../../app.css";

  interface CsvFile {
    name: string;
    path: string;
    content: string[][];
  }

  let csvFiles: CsvFile[] = [];
  let stats: string[][] = [];
  let sortColumn: number | null = null;
  let sortAscending = true;
  let selectedFile: string = "";

  const assetCsvs = Object.entries(
    import.meta.glob("/static/assets/*.csv", { query: "?raw" })
  ).reduce((acc, [path, _]) => {
    const name = path.split("/").pop() || "";
    return {
      ...acc,
      [name]: `${base}${path.replace("/static", "")}`,
    };
  }, {}) as Record<string, string>;

  async function loadCsvFiles() {
    const loadedFiles: CsvFile[] = [];

    for (const [name, path] of Object.entries(assetCsvs)) {
      try {
        const response = await fetch(path);
        const text = await response.text();
        const content = text.split("\n").map((row) => row.split(","));
        loadedFiles.push({ name, path, content });
      } catch (error) {
        console.error(`Failed to load CSV file ${name}:`, error);
      }
    }

    csvFiles = loadedFiles;

    if (csvFiles.length > 0) {
      selectedFile = csvFiles[0].name;
      loadSelectedFile();
    }

    return csvFiles;
  }

  function loadSelectedFile() {
    const file = csvFiles.find((f) => f.name === selectedFile);
    if (file) {
      stats = [...file.content];
      sortColumn = null;
      sortAscending = true;
    }
  }

  function isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && value.trim() !== "";
  }

  function sortTable(columnIndex: number) {
    if (sortColumn === columnIndex) {
      if (!sortAscending) {
        const file = csvFiles.find((f) => f.name === selectedFile);
        if (file) {
          stats = [...file.content];
        }
        sortColumn = null;
        sortAscending = true;
        return;
      }
      sortAscending = false;
    } else {
      sortColumn = columnIndex;
      sortAscending = true;
    }

    const headers = stats[0];
    const data = stats.slice(1);
    data.sort((a, b) => {
      const valueA = columnIndex < a.length ? a[columnIndex] : "";
      const valueB = columnIndex < b.length ? b[columnIndex] : "";

      if (isNumeric(valueA) && isNumeric(valueB)) {
        return sortAscending
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      return sortAscending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    stats = [headers, ...data];
  }

  function getSortIcon(columnIndex: number): string {
    if (sortColumn !== columnIndex) return "";
    const isNumericColumn =
      stats.length > 1 &&
      stats
        .slice(1)
        .some((row) => row.length > columnIndex && isNumeric(row[columnIndex]));
    if (isNumericColumn) {
      return sortAscending
        ? "mdi:sort-numeric-ascending"
        : "mdi:sort-numeric-descending";
    } else {
      return sortAscending
        ? "mdi:sort-alphabetical-ascending"
        : "mdi:sort-alphabetical-descending";
    }
  }

  function handleFileChange() {
    loadSelectedFile();
  }
</script>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center max-w-screen mx-2">
      <div class="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      {#await loadCsvFiles() then}
        {#if csvFiles.length > 0}
          <div class="w-full">
            <div class="mb-4 flex justify-center">
              <div class="form-control">
                <select
                  class="select select-bordered"
                  bind:value={selectedFile}
                  on:change={handleFileChange}
                >
                  {#each csvFiles as file}
                    <option value={file.name}>{file.name}</option>
                  {/each}
                </select>
              </div>
            </div>
            {#if stats.length > 0}
              <div class="max-w-screen overflow-x-auto">
                <table class="table table-zebra">
                  <thead>
                    <tr>
                      {#each stats[0] as header, i}
                        <th
                          on:click={() => sortTable(i)}
                          class="sortable cursor-pointer"
                        >
                          <div class="flex items-center">
                            <pre>{header}</pre>
                            {#if sortColumn === i}
                              <iconify-icon inline icon={getSortIcon(i)}
                              ></iconify-icon>
                            {/if}
                          </div>
                        </th>
                      {/each}
                    </tr>
                  </thead>
                  <tbody>
                    {#each stats.slice(1) as row}
                      <tr>
                        {#each row as cell}
                          <td><pre>{cell}</pre></td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
              <a
                class="btn m-4"
                href={csvFiles.find((f) => f.name === selectedFile)?.path ||
                  "#"}
              >
                {$_("statistics.downloadCsv")}
              </a>
            {/if}
          </div>
        {/if}
      {/await}
    </div>
  </div>
</main>
