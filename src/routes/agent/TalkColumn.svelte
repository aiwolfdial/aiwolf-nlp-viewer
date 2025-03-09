<script lang="ts">
  import type { Talk } from "$lib/types/agent";
  import ChatBubble from "./ChatBubble.svelte";

  let { header, talks }: { header: string; talks: Talk[] } = $props();
</script>

<div class="flex-[0_0_600px] rounded-lg bg-base-200">
  <div class="flex flex-col h-full p-4">
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
                <ChatBubble talk={talk}></ChatBubble>
              {/each}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
