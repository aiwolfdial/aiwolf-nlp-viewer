<script lang="ts">
  import { base } from "$app/paths";
  import { onMount } from "svelte";

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
  <link rel="stylesheet" href="{base}/global.css" />
</svelte:head>

<div class="container">
  {#if stats.length > 0}
    <table class="table">
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
  {/if}
</div>

<style>
  .container {
    margin: 1rem;
  }
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  .table th,
  .table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  .table th {
    background-color: #f2f2f2;
  }
  .sortable {
    cursor: pointer;
    user-select: none;
  }
  .sortable:hover {
    background-color: #e6e6e6;
  }
</style>
