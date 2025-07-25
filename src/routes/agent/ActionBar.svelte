<script lang="ts">
  import { Status } from "$lib/constants/common";
  import { agentSettings } from "$lib/stores/agent-settings";
  import {
    Request,
    type Info,
    type Setting,
  } from "$lib/types/agent";
  import type { AgentSettings } from "$lib/types/agent-settings";
  import { runes } from "runes2";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

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

  let message = $state("");
  let remainingLength = $state(0);
  let settings = $state<AgentSettings | undefined>(undefined);
  let input = $state<HTMLInputElement | null>(null);

  const progressValue = $derived(
    remain !== null ? (remain / (setting?.timeout.action ?? 60000)) * 100 : 0
  );

  const remainMinutes = $derived(
    remain !== null ? Math.floor(remain / 60000) : 0
  );

  const remainSeconds = $derived(
    remain !== null ? Math.floor((remain % 60000) / 1000) : 0
  );

  const isTargetSelectionMode = $derived(
    [Request.VOTE, Request.DIVINE, Request.GUARD, Request.ATTACK].includes(
      request as Request
    )
  );

  function calculateRemainingLength(currentMessage: string): number {
    if (!request || !setting) return 0;

    const config =
      request === Request.TALK
        ? setting.talk.max_length
        : request === Request.WHISPER
          ? setting.whisper.max_length
          : null;

    if (!config) return 0;

    let result = config.base_length ?? 0;
    result += info?.remain_length ?? 0;

    if (config.mention_length) {
      for (const agent in info?.status_map ?? {}) {
        if (currentMessage.indexOf("@" + agent) !== -1) {
          result += config.mention_length;
          result += runes("@" + agent).length;
          break;
        }
      }
    }

    if (config.per_talk) {
      result = Math.min(result, config.per_talk);
    }

    result -= runes(currentMessage).length;
    return result;
  }
  $effect(() => {
    remainingLength = calculateRemainingLength(message);
  });

  onMount(() => {
    const settingsUnsubscribe = agentSettings.subscribe((value) => {
      settings = value;
    });

    return () => {
      settingsUnsubscribe();
    };
  });

  function setMessage(value: string) {
    message = value;
    input?.focus();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onSendMessage(message);
    }
  }

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
            style="--value:{remainMinutes};"
            aria-live="polite"
            aria-label={remainMinutes.toString()}>{remainMinutes}</span
          >m
        {/if}
        <span
          style="--value:{remainSeconds};"
          aria-live="polite"
          aria-label={remainSeconds.toString()}>{remainSeconds}</span
        >s
      </span>
      <span
        class="bg-primary text-primary-content w-full py-2 text-3xl font-bold text-nowrap text-center"
      >
        {isTargetSelectionMode
          ? `${$_(`game.request.${request}`)}${$_("agent.selectTarget")}`
          : `${$_(`game.request.${request}`)}${$_("agent.enterContent")}`}
      </span>
    </div>
    <div class="flex gap-2 items-center px-4 pt-2 pb-4 overflow-x-auto">
      {#if isTargetSelectionMode}
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
        bind:value={message}
        list="suggests"
        onkeydown={onKeydown}
        use:onUse
        bind:this={input}
      />
      <datalist id="suggests">
        {#if isTargetSelectionMode}
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
      {#if remainingLength >= 0}
        <pre class="text-2xl">{$_("agent.remainingChars", {
            values: { count: remainingLength },
          })}</pre>
      {:else}
        <pre class="text-2xl bg-error text-error-content">{$_(
            "agent.exceededChars",
            { values: { count: remainingLength * -1 } }
          )}</pre>
      {/if}
      <button
        class="btn btn-xl"
        onclick={() => onSendMessage(message)}
        aria-label="Send"
      >
        <iconify-icon icon="mdi:send"></iconify-icon>
        {$_("agent.send")}
      </button>
    </div>
    <div class="-mt-2 mx-4 mb-2">
      <progress class="progress" value={progressValue} max="100"></progress>
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
      {#if isTargetSelectionMode}
        <span
          class="bg-primary text-primary-content text-lg font-bold text-nowrap"
        >
          {$_(`game.request.${request}`)}{$_("agent.selectTarget")}
        </span>
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
        >
          {$_(`game.request.${request}`)}{$_("agent.enterContent")}
        </span>
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
        bind:value={message}
        list="suggests"
        onkeydown={onKeydown}
        use:onUse
        bind:this={input}
      />
      <datalist id="suggests">
        {#if isTargetSelectionMode}
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
      {#if remainingLength >= 0}
        <pre class="text-md">{$_("agent.remainingChars", {
            values: { count: remainingLength },
          })}</pre>
      {:else}
        <pre class="text-md bg-error text-error-content">{$_(
            "agent.exceededChars",
            { values: { count: remainingLength * -1 } }
          )}</pre>
      {/if}
      <button
        class="btn"
        onclick={() => onSendMessage(message)}
        aria-label="Send"
      >
        <iconify-icon icon="mdi:send"></iconify-icon>
        {$_("agent.send")}
      </button>
    </div>
    <div class="-mt-2 mx-4 mb-2">
      <progress class="progress" value={progressValue} max="100"></progress>
    </div>
  {/if}
</form>
