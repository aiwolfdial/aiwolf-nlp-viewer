<script lang="ts">
  import {
    RequestJA,
    RoleJA,
    Species,
    SpeciesJA,
    Status,
    StatusJA,
    type Info,
    type Judge,
    type Request,
  } from "$lib/types/agent";

  let {
    request,
    info,
    mediumResults,
    divineResults,
    executedAgents,
    attackedAgents,
  }: {
    request: Request | null;
    info: Info;
    mediumResults: Judge[];
    divineResults: Judge[];
    executedAgents: string[];
    attackedAgents: string[];
  } = $props();
</script>

<div class="flex-[0_0_400px] rounded-lg bg-base-200">
  <div class="flex flex-col h-full p-4">
    <h2 class="text-xl font-bold pb-2">エージェント</h2>
    <div class="grow overflow-y-auto pr-4">
      <h2 class="text-lg font-bold">リクエスト</h2>
      {#if request !== null}
        <pre class="text-lg">{info !== null
            ? info.day + "日目"
            : "ゲーム外"} {RequestJA[request]}</pre>
      {/if}
      <h2 class="text-lg font-bold pt-2">ステータス</h2>
      {#each Object.entries(info.statusMap ?? {}) as [key, value]}
        {#if value === Status.ALIVE}
          <div class="bg-info text-info-content flex flex-row gap-2">
            <pre class="text-lg">{key}</pre>
            <pre class="text-lg">{RoleJA[(info.roleMap ?? {})[key]] ?? ""}</pre>
            <pre class="text-lg ml-auto">{StatusJA[value]}</pre>
          </div>
        {:else}
          <div class="bg-error text-error-content flex flex-row gap-2">
            <pre class="text-lg">{key}</pre>
            <pre class="text-lg">{RoleJA[(info.roleMap ?? {})[key]] ?? ""}</pre>
            <pre class="text-lg ml-auto">{StatusJA[
                value
              ]}{executedAgents.includes(key)
                ? " (追放)"
                : attackedAgents.includes(key)
                  ? " (襲撃)"
                  : ""}</pre>
          </div>
        {/if}
      {/each}
      {#if mediumResults.length > 0}
        <h2 class="text-lg font-bold pt-2">霊能結果</h2>
        {#each mediumResults as { day, target, result }}
          {#if result !== Species.HUMAN}
            <div class="bg-error text-error-content flex flex-row gap-2">
              <pre class="text-lg">{target}</pre>
              <pre class="text-lg">({day}日目)</pre>
              <pre class="text-lg ml-auto">{SpeciesJA[result]}</pre>
            </div>
          {:else}
            <div class="bg-success text-success-content flex flex-row gap-2">
              <pre class="text-lg">{target}</pre>
              <pre class="text-lg">({day}日目)</pre>
              <pre class="text-lg ml-auto">{SpeciesJA[result]}</pre>
            </div>
          {/if}
        {/each}
      {/if}
      {#if divineResults.length > 0}
        <h2 class="font-bold text-lg pt-2">占い結果</h2>
        {#each divineResults as { day, target, result }}
          {#if result !== Species.HUMAN}
            <div class="bg-error text-error-content flex flex-row gap-2">
              <pre class="text-lg">{target}</pre>
              <pre class="text-lg">({day}日目)</pre>
              <pre class="text-lg ml-auto">{SpeciesJA[result]}</pre>
            </div>
          {:else}
            <div class="bg-success text-success-content flex flex-row gap-2">
              <pre class="text-lg">{target}</pre>
              <pre class="text-lg">({day}日目)</pre>
              <pre class="text-lg ml-auto">{SpeciesJA[result]}</pre>
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</div>
