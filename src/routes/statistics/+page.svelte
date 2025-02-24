<script lang="ts">
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import "../../app.css";

  let stats: string[][] = [];
  let sortColumn: number | null = null;
  let sortAscending = true;

  onMount(async () => {
    const response = await fetch(`${base}/assets/stats.csv`);
    const text = await response.text();
    stats = text.split("\n").map((row) => row.split(","));
  });

  function sortTable(columnIndex: number) {
    if (sortColumn === columnIndex) {
      sortAscending = !sortAscending;
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

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortAscending ? numA - numB : numB - numA;
      }

      return sortAscending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    stats = [headers, ...data];
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center max-w-screen">
      {#if stats.length > 0}
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                {#each stats[0] as header, i}
                  <th on:click={() => sortTable(i)} class="sortable">
                    {header}
                    {#if sortColumn === i}
                      {sortAscending ? "▲" : "▼"}
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
      {/if}
    </div>
  </div>
</main>
