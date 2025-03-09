<script lang="ts">
  import { Request, Status, type Info, type Setting } from "$lib/types/agent";

  let {
    remain,
    setting,
    request,
    info,
    message,
    onMessageChange,
    onSendMessage,
  }: {
    remain: number | null;
    setting: Setting | null;
    request: Request | null;
    info: Info | null;
    message: string;
    onMessageChange: (value: string) => void;
    onSendMessage: (message: string) => void;
  } = $props();
</script>

<div class="flex-none bg-base-200">
  <div class="flex gap-2 items-center mx-4 mt-4">
    <span class="countdown font-mono text-2xl">
      {#if remain && remain > 60000}
        <span
          style="--value:{Math.floor(remain / 60000)};"
          aria-live="polite"
          aria-label={Math.floor(remain / 60000).toString()}
          >{Math.floor(remain / 60000)}</span
        >m
      {/if}
      <span
        style="--value:{Math.floor((remain ? remain % 60000 : 0) / 1000)};"
        aria-live="polite"
        aria-label={Math.floor((remain ? remain % 60000 : 0) / 1000).toString()}
        >{Math.floor((remain ? remain % 60000 : 0) / 1000)}</span
      >s
    </span>
    {#if request === Request.VOTE || request === Request.DIVINE || request === Request.GUARD || request === Request.ATTACK}
      {#each Object.entries(info?.statusMap ?? {}) as [key, value]}
        {#if value === Status.ALIVE && key !== info?.agent}
          <button class="btn" onclick={() => onMessageChange(key)}>
            {key}
          </button>
        {/if}
      {/each}
    {:else}
      {#if (setting?.maxSkip ?? 0) > 0}
        <button
          class="btn btn-square"
          onclick={() => onMessageChange("Skip")}
          aria-label="Skip"
        >
          <iconify-icon icon="mdi:arrow-u-down-right-bold"></iconify-icon>
        </button>
      {/if}
      <button
        class="btn btn-square"
        onclick={() => onMessageChange("Over")}
        aria-label="Over"
      >
        <iconify-icon icon="mdi:skip-forward"></iconify-icon>
      </button>
    {/if}
    <input
      type="text"
      class="input flex-1"
      bind:value={message}
      list="agents"
    />
    <datalist id="agents">
      {#each Object.entries(info?.statusMap ?? {}) as [key, value]}
        {#if value === Status.ALIVE && key !== info?.agent}
          <option value={key}></option>
        {/if}
      {/each}
    </datalist>
    <button
      class="btn btn-square"
      onclick={() => onSendMessage(message)}
      aria-label="Send"
    >
      <iconify-icon icon="mdi:send"></iconify-icon>
    </button>
  </div>
  <div class="mx-4 mb-2">
    <progress
      class="progress"
      value={remain !== null
        ? (remain / (setting?.actionTimeout ?? 60000)) * 100
        : 0}
      max="100"
    ></progress>
  </div>
</div>
