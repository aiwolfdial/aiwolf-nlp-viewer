<script lang="ts">
  import { agentSettings } from "$lib/stores/agent-settings";
  import {
    Request,
    RequestJA,
    Status,
    type Info,
    type Setting,
  } from "$lib/types/agent";
  import type { AgentSettings } from "$lib/types/agent-settings";
  import { runes } from "runes2";
  import { onDestroy, onMount } from "svelte";
  import { derived, writable } from "svelte/store";

  let {
    remain,
    setting,
    request,
    info,
    onSendMessage,
  }: {
    remain: number | null;
    setting: Setting | null;
    request: Request | null;
    info: Info | null;
    onSendMessage: (message: string) => void;
  } = $props();

  const length = writable(0);

  let settings = $state<AgentSettings>();

  onMount(() => {
    const unsubscribeSettings = agentSettings.subscribe((value) => {
      settings = value;
    });

    const unsubscribeLength = derived(message, () => {
      let result = 0;
      if (request === Request.TALK) {
        result += setting?.talk.max_length.base_length ?? 0;
        result += info?.remain_length ?? 0;
        if ($message.indexOf("@") !== -1) {
          result += setting?.talk.max_length.mention_length ?? 0;
        }
        if (setting?.talk.max_length.per_talk) {
          result = Math.min(result, setting.talk.max_length.per_talk);
        }
      }
      if (request === Request.WHISPER) {
        result += setting?.whisper.max_length.base_length ?? 0;
        result += info?.remain_length ?? 0;
        if ($message.indexOf("@") !== -1) {
          result += setting?.talk.max_length.mention_length ?? 0;
        }
        if (setting?.whisper.max_length.per_talk) {
          result = Math.min(result, setting.whisper.max_length.per_talk);
        }
      }
      result -= runes($message).length;
      return result;
    }).subscribe((value) => {
      length.set(value);
    });

    onDestroy(() => {
      unsubscribeSettings();
      unsubscribeLength();
    });
  });

  const message = writable<string>("");

  function setMessage(value: string) {
    $message = value;
    input?.focus();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        onSendMessage($message);
      }
    }
  }

  let input = $state<HTMLInputElement | null>(null);

  function onUse(element: HTMLElement) {
    element.focus();
  }
</script>

<form class="flex-none bg-base-200" data-sveltekit-keepfocus>
  {#if settings?.display.largeScale}
    <div class="flex gap-2 items-center px-4 pt-4 pb-4 overflow-x-auto">
      <span class="countdown font-mono text-3xl">
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
          aria-label={Math.floor(
            (remain ? remain % 60000 : 0) / 1000
          ).toString()}>{Math.floor((remain ? remain % 60000 : 0) / 1000)}</span
        >s
      </span>
      {#if request === Request.VOTE || request === Request.DIVINE || request === Request.GUARD || request === Request.ATTACK}
        <span
          class="bg-primary text-primary-content w-full py-2 text-3xl font-bold text-nowrap text-center"
          >{RequestJA[request]}対象を選択してください</span
        >
      {:else}
        <span
          class="bg-primary text-primary-content w-full py-2 text-3xl font-bold text-nowrap text-center"
          >{RequestJA[
            request ?? Request.INITIALIZE
          ]}内容を入力してください</span
        >
      {/if}
    </div>
    <div class="flex gap-2 items-center px-4 pt-2 pb-4 overflow-x-auto">
      {#if request === Request.VOTE || request === Request.DIVINE || request === Request.GUARD || request === Request.ATTACK}
        {#each Object.entries(info?.status_map ?? {}) as [key, value]}
          {#if value === Status.ALIVE && key !== info?.agent}
            <button class="btn btn-xl" onclick={() => setMessage(key)}>
              {key}
            </button>
          {/if}
        {/each}
      {:else}
        {#if (info?.remain_skip ?? 0) > 0}
          <button
            class="btn btn-xl"
            onclick={() => setMessage("Skip")}
            aria-label="Skip"
          >
            <iconify-icon icon="mdi:arrow-u-down-right-bold"></iconify-icon>
            SKIP
          </button>
        {/if}
        <button
          class="btn btn-xl"
          onclick={() => setMessage("Over")}
          aria-label="Over"
        >
          <iconify-icon icon="mdi:skip-forward"></iconify-icon>
          OVER
        </button>
      {/if}
      <input
        type="text"
        class="input input-xl min-w-64 flex-1"
        bind:value={$message}
        list="suggests"
        onkeydown={onKeydown}
        use:onUse
        bind:this={input}
      />
      <datalist id="suggests">
        {#if request === Request.VOTE || request === Request.DIVINE || request === Request.GUARD || request === Request.ATTACK}
          {#each Object.entries(info?.status_map ?? {}) as [key, value]}
            {#if value === Status.ALIVE && key !== info?.agent}
              <option value={key}></option>
            {/if}
          {/each}
        {:else}
          {#if (info?.remain_skip ?? 0) > 0}
            <option value="Skip"></option>
          {/if}
          <option value="Over"></option>
        {/if}
      </datalist>
      <button
        class="btn btn-xl"
        onclick={() => onSendMessage($message)}
        aria-label="Send"
      >
        <iconify-icon icon="mdi:send"></iconify-icon>
        送信
      </button>
    </div>
    <div class="-mt-2 mx-4 mb-2">
      <progress
        class="progress"
        value={remain !== null
          ? (remain / (setting?.timeout.action ?? 60000)) * 100
          : 0}
        max="100"
      ></progress>
    </div>
  {:else}
    <div class="flex gap-2 items-center p-4 overflow-x-auto">
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
          aria-label={Math.floor(
            (remain ? remain % 60000 : 0) / 1000
          ).toString()}>{Math.floor((remain ? remain % 60000 : 0) / 1000)}</span
        >s
      </span>
      {#if request === Request.VOTE || request === Request.DIVINE || request === Request.GUARD || request === Request.ATTACK}
        <span
          class="bg-primary text-primary-content text-lg font-bold text-nowrap"
          >{RequestJA[request]}対象を選択してください</span
        >
        {#each Object.entries(info?.status_map ?? {}) as [key, value]}
          {#if value === Status.ALIVE && key !== info?.agent}
            <button class="btn" onclick={() => setMessage(key)}>
              {key}
            </button>
          {/if}
        {/each}
      {:else}
        <span
          class="bg-primary text-primary-content text-lg font-bold text-nowrap"
          >{RequestJA[
            request ?? Request.INITIALIZE
          ]}内容を入力してください</span
        >
        {#if (info?.remain_skip ?? 0) > 0}
          <button
            class="btn"
            onclick={() => setMessage("Skip")}
            aria-label="Skip"
          >
            <iconify-icon icon="mdi:arrow-u-down-right-bold"></iconify-icon>
            SKIP
          </button>
        {/if}
        <button
          class="btn"
          onclick={() => setMessage("Over")}
          aria-label="Over"
        >
          <iconify-icon icon="mdi:skip-forward"></iconify-icon>
          OVER
        </button>
      {/if}
      <input
        type="text"
        class="input min-w-64 flex-1"
        bind:value={$message}
        list="suggests"
        onkeydown={onKeydown}
        use:onUse
        bind:this={input}
      />
      <datalist id="suggests">
        {#if request === Request.VOTE || request === Request.DIVINE || request === Request.GUARD || request === Request.ATTACK}
          {#each Object.entries(info?.status_map ?? {}) as [key, value]}
            {#if value === Status.ALIVE && key !== info?.agent}
              <option value={key}></option>
            {/if}
          {/each}
        {:else}
          {#if (info?.remain_skip ?? 0) > 0}
            <option value="Skip"></option>
          {/if}
          <option value="Over"></option>
        {/if}
      </datalist>
      <button
        class="btn"
        onclick={() => onSendMessage($message)}
        aria-label="Send"
      >
        <iconify-icon icon="mdi:send"></iconify-icon>
        送信
      </button>
      {#if $length > 0}
        <span class="font-mono">{$length}文字</span>
      {/if}
    </div>
    <div class="-mt-2 mx-4 mb-2">
      <progress
        class="progress"
        value={remain !== null
          ? (remain / (setting?.timeout.action ?? 60000)) * 100
          : 0}
        max="100"
      ></progress>
    </div>
  {/if}
</form>
