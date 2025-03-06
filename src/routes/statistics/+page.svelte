<script lang="ts">
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import "../../app.css";

  let originalStats: string[][] = [];
  let stats: string[][] = [];
  let sortColumn: number | null = null;
  let sortAscending = true;

  onMount(async () => {
    const response = await fetch(`${base}/assets/stats.csv`);
    const text = await response.text();
    originalStats = text.split("\n").map((row) => row.split(","));
    stats = [...originalStats];
  });

  function isNumeric(value: string): boolean {
    return !isNaN(Number(value));
  }

  function sortTable(columnIndex: number) {
    if (sortColumn === columnIndex) {
      if (!sortAscending) {
        stats = [...originalStats];
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
      const valueA = a[columnIndex];
      const valueB = b[columnIndex];

      const numA = Number(valueA);
      const numB = Number(valueB);

      if (isNumeric(valueA) && isNumeric(valueB)) {
        return sortAscending ? numA - numB : numB - numA;
      }

      return sortAscending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    stats = [headers, ...data];
  }

  function getSortIcon(columnIndex: number): string {
    if (sortColumn !== columnIndex) return "";

    const isNumericColumn = stats
      .slice(1)
      .every((row) => isNumeric(row[columnIndex]));

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
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center max-w-screen">
      {#if stats.length > 0}
        <div>
          <a class="btn m-4" href={`${base}/assets/stats.csv`}
            >CSV形式でダウンロードする</a
          >
          <div class="max-w-screen overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  {#each stats[0] as header, i}
                    <th onclick={() => sortTable(i)} class="sortable">
                      {header}
                      {#if sortColumn === i}
                        <iconify-icon inline icon={getSortIcon(i)}
                        ></iconify-icon>
                      {/if}
                    </th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each stats.slice(1) as row}
                  <tr>
                    {#each row as cell}
                      <td>{cell}</td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </div>
</main>
