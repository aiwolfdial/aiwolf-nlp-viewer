<script lang="ts">
  import { base } from "$app/paths";
  import { agentSettings } from "$lib/stores/agent-settings";
  import type { Talk } from "$lib/types/agent";
  import type { AgentSettings } from "$lib/types/agent-settings";
  import { onDestroy, onMount } from "svelte";

  let { talk }: { talk: Talk } = $props();

  let settings = $state<AgentSettings>();

  onMount(() => {
    const unsubscribe = agentSettings.subscribe((value) => {
      settings = value;
    });

    onDestroy(unsubscribe);
  });
</script>

<div class="chat chat-start">
  {#if settings?.display.largeScale}
    <div class="chat-image avatar">
      <div class="w-20 rounded-full">
        <img
          src="{base}/images/male/{Number(
            talk.agent.match(/Agent\[(\d+)\]/)?.[1]
          )
            .toString()
            .padStart(2, '0')}.png"
          alt={talk.agent}
        />
      </div>
    </div>
    <pre class="chat-header text-lg">{talk.agent}</pre>
    {#if talk.over}
      <iconify-icon inline icon="mdi:skip-forward"></iconify-icon>
    {:else if talk.skip}
      <iconify-icon inline icon="mdi:arrow-u-down-right-bold"></iconify-icon>
    {:else}
      <div class="chat-bubble bg-base-100 text-xl text-pretty break-all">
        {talk.text}
      </div>
    {/if}
    <pre class="chat-footer opacity-50 text-sm">Idx: {talk.idx}</pre>
  {:else}
    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img
          src="{base}/images/male/{Number(
            talk.agent.match(/Agent\[(\d+)\]/)?.[1]
          )
            .toString()
            .padStart(2, '0')}.png"
          alt={talk.agent}
        />
      </div>
    </div>
    <pre class="chat-header">{talk.agent}</pre>
    {#if talk.over}
      <iconify-icon inline icon="mdi:skip-forward"></iconify-icon>
    {:else if talk.skip}
      <iconify-icon inline icon="mdi:arrow-u-down-right-bold"></iconify-icon>
    {:else}
      <div class="chat-bubble bg-base-100 text-pretty break-all">
        {talk.text}
      </div>
    {/if}
    <pre class="chat-footer opacity-50">Idx: {talk.idx}</pre>
  {/if}
</div>
