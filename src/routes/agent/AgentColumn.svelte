<script lang="ts">
  import { Role, Species, Status } from "$lib/constants/common";
  import { agentSettings } from "$lib/stores/agent-settings";
  import {
    RequestJA,
    type Info,
    type Judge,
    type Request,
  } from "$lib/types/agent";
  import type { AgentSettings } from "$lib/types/agent-settings";
  import { onDestroy, onMount } from "svelte";
  import { _ } from "svelte-i18n";

  let {
    agent,
    role,
    profile,
    request,
    info,
    mediumResults,
    divineResults,
    executedAgents,
    attackedAgents,
  }: {
    agent: String | null;
    role: Role | null;
    profile: string | null;
    request: Request | null;
    info: Info;
    mediumResults: Judge[];
    divineResults: Judge[];
    executedAgents: string[];
    attackedAgents: string[];
  } = $props();

  let settings = $state<AgentSettings>();

  onMount(() => {
    const unsubscribe = agentSettings.subscribe((value) => {
      settings = value;
    });

    onDestroy(unsubscribe);
  });
</script>

<div class="flex-[0_0_400px] rounded-lg bg-base-200">
  <div class="flex flex-col h-full p-4">
    {#if settings?.display.largeScale}
      <div class="grow overflow-y-auto pr-4">
        <pre class="text-3xl font-bold text-center">{agent
            ? agent
            : "ゲーム外"}</pre>
        <pre class="text-3xl font-bold text-center">{role
            ? $_(`game.role.${role}`)
            : "ゲーム外"}</pre>
        <pre class="text-3xl text-center my-2">{info
            ? info.day + "日目"
            : "ゲーム外"}</pre>
        {#if request}
          <pre
            class="bg-primary text-primary-content text-3xl font-bold text-center my-2">{RequestJA[
              request
            ]}</pre>
        {/if}
        {#if profile}
          <pre class="text-md text-pretty break-all my-2">{profile}</pre>
        {/if}
        {#each Object.entries(info.status_map ?? {}) as [key, value]}
          {#if value === Status.ALIVE}
            <div class="bg-info text-success-content flex flex-row gap-2 px-2">
              <pre class="text-2xl font-bold">{key}</pre>
              <pre class="text-2xl">{(info.role_map ?? {})[key]
                  ? $_(`game.role.${(info.role_map ?? {})[key]}`)
                  : ""}</pre>
              <pre class="text-2xl font-bold ml-auto">{$_(
                  `game.status.${value}`
                )}</pre>
            </div>
          {:else}
            <div class="bg-error text-error-content flex flex-row gap-2 px-2">
              <pre class="text-2xl font-bold">{key}</pre>
              <pre class="text-2xl">{(info.role_map ?? {})[key]
                  ? $_(`game.role.${(info.role_map ?? {})[key]}`)
                  : ""}</pre>
              <pre class="text-2xl font-bold ml-auto">{$_(
                  `game.status.${value}`
                )}{executedAgents.includes(key)
                  ? " (追放)"
                  : attackedAgents.includes(key)
                    ? " (襲撃)"
                    : ""}</pre>
            </div>
          {/if}
        {/each}
        {#if mediumResults.length > 0}
          <h2 class="text-2xl font-bold text-center my-2">霊能結果</h2>
          {#each mediumResults as { day, target, result }}
            {#if result !== Species.HUMAN}
              <div class="bg-error text-error-content flex flex-row gap-2 px-2">
                <pre class="text-2xl font-bold">{target}</pre>
                <pre class="text-2xl">({day}日目)</pre>
                <pre class="text-2xl font-bold ml-auto">{$_(
                    `game.species.${result}`
                  )}</pre>
              </div>
            {:else}
              <div
                class="bg-success text-info-content flex flex-row gap-2 px-2"
              >
                <pre class="text-2xl font-bold">{target}</pre>
                <pre class="text-2xl">({day}日目)</pre>
                <pre class="text-2xl font-bold ml-auto">{$_(
                    `game.species.${result}`
                  )}</pre>
              </div>
            {/if}
          {/each}
        {/if}
        {#if divineResults.length > 0}
          <h2 class="text-2xl font-bold text-center my-2">占い結果</h2>
          {#each divineResults as { day, target, result }}
            {#if result !== Species.HUMAN}
              <div class="bg-error text-error-content flex flex-row gap-2 px-2">
                <pre class="text-2xl font-bold">{target}</pre>
                <pre class="text-2xl">({day}日目)</pre>
                <pre class="text-2xl font-bold ml-auto">{$_(
                    `game.species.${result}`
                  )}</pre>
              </div>
            {:else}
              <div
                class="bg-success text-info-content flex flex-row gap-2 px-2"
              >
                <pre class="text-2xl font-bold">{target}</pre>
                <pre class="text-2xl">({day}日目)</pre>
                <pre class="text-2xl font-bold ml-auto">{$_(
                    `game.species.${result}`
                  )}</pre>
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    {:else}
      <h2 class="text-xl font-bold pb-2">エージェント</h2>
      <div class="grow overflow-y-auto pr-4">
        <div class="flex justify-around">
          <div>
            <h2 class="text-lg font-bold text-center">名前</h2>
            <pre class="text-lg text-center">{agent ? agent : "ゲーム外"}</pre>
          </div>
          <div>
            <h2 class="text-lg font-bold text-center">役職</h2>
            <pre class="text-lg text-center">{role
                ? $_(`game.role.${role}`)
                : "ゲーム外"}</pre>
          </div>
          <div>
            <h2 class="text-lg font-bold text-center">日数</h2>
            <pre class="text-lg text-center">{info
                ? info.day + "日目"
                : "ゲーム外"}</pre>
          </div>
          <div>
            <h2 class="text-lg font-bold text-center">リクエスト</h2>
            {#if request}
              <pre class="text-lg text-center">{RequestJA[request]}</pre>
            {/if}
          </div>
        </div>
        {#if profile}
          <h2 class="text-lg font-bold text-center">プロフィール</h2>
          <pre class="text-md text-pretty break-all">{profile}</pre>
        {/if}
        <h2 class="text-lg font-bold pt-2">ステータス</h2>
        {#each Object.entries(info.status_map ?? {}) as [key, value]}
          {#if value === Status.ALIVE}
            <div class="bg-info text-info-content flex flex-row gap-2">
              <pre class="text-lg">{key}</pre>
              <pre class="text-lg">{(info.role_map ?? {})[key]
                  ? $_(`game.role.${(info.role_map ?? {})[key]}`)
                  : ""}</pre>
              <pre class="text-lg ml-auto">{$_(`game.status.${value}`)}</pre>
            </div>
          {:else}
            <div class="bg-error text-error-content flex flex-row gap-2">
              <pre class="text-lg">{key}</pre>
              <pre class="text-lg">{(info.role_map ?? {})[key]
                  ? $_(`game.role.${(info.role_map ?? {})[key]}`)
                  : ""}</pre>
              <pre class="text-lg ml-auto">{$_(
                  `game.status.${value}`
                )}{executedAgents.includes(key)
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
                <pre class="text-lg ml-auto">{$_(
                    `game.species.${result}`
                  )}</pre>
              </div>
            {:else}
              <div class="bg-success text-info-content flex flex-row gap-2">
                <pre class="text-lg">{target}</pre>
                <pre class="text-lg">({day}日目)</pre>
                <pre class="text-lg ml-auto">{$_(
                    `game.species.${result}`
                  )}</pre>
              </div>
            {/if}
          {/each}
        {/if}
        {#if divineResults.length > 0}
          <h2 class="text-lg font-bold pt-2">占い結果</h2>
          {#each divineResults as { day, target, result }}
            {#if result !== Species.HUMAN}
              <div class="bg-error text-error-content flex flex-row gap-2">
                <pre class="text-lg">{target}</pre>
                <pre class="text-lg">({day}日目)</pre>
                <pre class="text-lg ml-auto">{$_(
                    `game.species.${result}`
                  )}</pre>
              </div>
            {:else}
              <div class="bg-success text-info-content flex flex-row gap-2">
                <pre class="text-lg">{target}</pre>
                <pre class="text-lg">({day}日目)</pre>
                <pre class="text-lg ml-auto">{$_(
                    `game.species.${result}`
                  )}</pre>
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</div>
