<script lang="ts">
  import { agentSettings } from "$lib/stores/agent-settings";
  import type { Talk } from "$lib/types/agent";
  import type { AgentSettings } from "$lib/types/agent-settings";
  import { onDestroy, onMount } from "svelte";
  import ChatBubble from "./ChatBubble.svelte";

  let { header, talks }: { header: string; talks: Talk[] } = $props();

  let settings = $state<AgentSettings>();

  onMount(() => {
    const unsubscribe = agentSettings.subscribe((value) => {
      settings = value;
    });

    onDestroy(unsubscribe);
  });
</script>

<div class="flex-[0_0_600px] rounded-lg bg-base-200">
  <div class="flex flex-col h-full p-4">
    {#if settings?.display.largeScale}
      <h2 class="text-3xl font-bold pb-2">{header}</h2>
      <div class="grow overflow-y-auto pr-4">
        {#if talks.length > 0}
          {@const days = [...new Set(talks.map((t) => t.day))].sort(
            (a, b) => b - a
          )}
          <div class="tabs tabs-border">
            {#each days as day}
              <input
                type="radio"
                name="talk_days"
                class="tab text-lg font-bold"
                checked={day === days[0]}
                aria-label={`${day}日目`}
              />
              <div class="tab-content my-4">
                {#each talks.filter((t) => t.day === day) as talk}
                  <ChatBubble {talk}></ChatBubble>
                {/each}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <h2 class="text-xl font-bold pb-2">{header}</h2>
      <div class="grow overflow-y-auto pr-4">
        {#if talks.length > 0}
          {@const days = [...new Set(talks.map((t) => t.day))].sort(
            (a, b) => b - a
          )}
          <div class="tabs tabs-border">
            {#each days as day}
              <input
                type="radio"
                name="talk_days"
                class="tab"
                checked={day === days[0]}
                aria-label={`${day}日目`}
              />
              <div class="tab-content my-4">
                {#each talks.filter((t) => t.day === day) as talk}
                  <ChatBubble {talk}></ChatBubble>
                {/each}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
