<script lang="ts">
  import type { Talk } from "$lib/types/agent";

  let { talk }: { talk: Talk } = $props();
</script>

<div class="chat chat-start">
  <div class="chat-image avatar avatar-placeholder">
    <div class="bg-neutral text-neutral-content w-12 rounded-full">
      <span class="text-2xl">
        {Number(talk.agent.match(/Agent\[(\d+)\]/)?.[1]) ?? ""}
      </span>
    </div>
  </div>
  <div class="chat-header"></div>
  {#if talk.over}
    <iconify-icon inline icon="mdi:skip-forward"></iconify-icon>
  {:else if talk.skip}
    <iconify-icon inline icon="mdi:arrow-u-down-right-bold"></iconify-icon>
  {:else}
    <div class="chat-bubble bg-base-100 text-pretty break-all">
      {talk.text}
    </div>
  {/if}
  <pre class="chat-footer opacity-50">{talk.idx}</pre>
</div>
