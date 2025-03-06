<script lang="ts">
  import { browser } from "$app/environment";
  import { agentSettings } from "$lib/stores/agent-settings";
  import {
    Species,
    Status,
    type Info,
    type Judge,
    type Packet,
    type Request,
    type Role,
    type Setting,
    type Talk,
  } from "$lib/types/agent";
  import { type AgentSettings } from "$lib/types/agent-settings";
  import { agentSocketState } from "$lib/utils/agent-socket";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import "../../app.css";
  import Navbar from "./Navbar.svelte";

  const status = writable("");
  const entries = writable<(Packet | string)[]>([]);
  const role = writable<Role | null>(null);
  const request = writable<Request | null>(null);
  const info = writable<Info | null>(null);
  const mediumResults = writable<Judge[]>([]);
  const divineResults = writable<Judge[]>([]);
  const setting = writable<Setting | null>(null);
  const talkHistory = writable<Talk[]>([]);
  const whisperHistory = writable<Talk[]>([]);

  const message = writable<string>("");

  let settings = $state<AgentSettings>();

  let width = $state<number>(50);
  let isDragging = false;
  let containerRef: HTMLDivElement | null = null;

  function onMouseMove(clientX: number) {
    if (!isDragging || !containerRef) return;
    const containerRect = containerRef.getBoundingClientRect();
    const relativeX = clientX - containerRect.left;
    const containerWidth = containerRect.width;
    width = Math.min(90, Math.max(10, (relativeX / containerWidth) * 100));
  }

  function onDragStart() {
    isDragging = true;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    const moveHandler = (e: MouseEvent | TouchEvent) => {
      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      onMouseMove(clientX);
    };

    const stopHandler = () => {
      isDragging = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("mouseup", stopHandler);
      window.removeEventListener("touchend", stopHandler);
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("touchmove", moveHandler);
    window.addEventListener("mouseup", stopHandler);
    window.addEventListener("touchend", stopHandler);
  }

  onMount(() => {
    const unsubscribeStatus = agentSocketState.subscribe((value) => {
      status.set(value.status);
      entries.set(value.entries);
      role.set(value.role);
      request.set(value.request);
      info.set(value.info);
      mediumResults.set(value.mediumResults);
      divineResults.set(value.divineResults);
      setting.set(value.setting);
      talkHistory.set(value.talkHistory);
      whisperHistory.set(value.whisperHistory);
    });

    const unsubscribeSettings = agentSettings.subscribe((value) => {
      settings = value;
    });

    onDestroy(() => {
      unsubscribeStatus();
      unsubscribeSettings();
    });

    if (browser) {
      window.addEventListener("beforeunload", (e) => {
        if ($status === "connecting") {
          e.preventDefault();
        }
      });
    }
  });
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main class="h-screen flex flex-col">
  <Navbar />
  <div class="flex flex-1 overflow-hidden w-full flex-col">
    <div class="flex-auto bg-base-300 p-2 h-full overflow-hidden">
      <div class="tabs tabs-border">
        <input type="radio" name="tab" class="tab" aria-label="Tab 1" checked />
        <div class="tab-content">
          <div class="flex flex-row h-full" bind:this={containerRef}>
            <div class="overflow-y-auto px-2 h-full" style="width: {width}%">
              <pre class="font-bold text-xl p-2">{$info?.agent ??
                  "未接続"} {$role}</pre>
              {#if $request !== null}
                <pre
                  class="bg-primary text-primary-content p-2">{$request}</pre>
              {/if}
              {#if $info !== null}
                <div class="p-2">
                  {#each Object.entries($info.statusMap ?? {}) as [key, value]}
                    <div class="flex flex-row gap-2">
                      <pre>{key}</pre>
                      <pre>{($info.roleMap ?? {})[key] ?? "-"}</pre>
                      {#if value === Status.ALIVE}
                        <pre
                          class="font-bold bg-info text-info-content ml-auto">{value}</pre>{:else}
                        <pre
                          class="font-bold bg-error text-error-content ml-auto">{value}</pre>
                      {/if}
                    </div>
                  {/each}
                </div>
                {#if $mediumResults.length > 0}
                  <h2 class="font-bold text-lg p-2">霊能結果</h2>
                  {#each $mediumResults as { day, target, result }}
                    <div class="flex flex-row gap-2">
                      <pre>{target}</pre>
                      <pre>(Day{day})</pre>
                      {#if result === Species.HUMAN}
                        <pre
                          class="font-bold bg-info text-info-content ml-auto">{result}</pre>{:else}
                        <pre
                          class="font-bold bg-error text-error-content ml-auto">{result}</pre>
                      {/if}
                    </div>
                  {/each}
                {/if}
                {#if $divineResults.length > 0}
                  <h2 class="font-bold text-lg p-2">占い結果</h2>
                  {#each $mediumResults as { day, target, result }}
                    <div class="flex flex-row gap-2">
                      <pre>{target}</pre>
                      <pre>(Day{day})</pre>
                      {#if result === Species.HUMAN}
                        <pre
                          class="font-bold bg-info text-info-content ml-auto">{result}</pre>{:else}
                        <pre
                          class="font-bold bg-error text-error-content ml-auto">{result}</pre>
                      {/if}
                    </div>
                  {/each}
                {/if}
              {/if}
              {#if $talkHistory.length > 0}
                <h2 class="font-bold text-lg p-2">トーク履歴</h2>
              {/if}
              {#each $talkHistory as { agent, day, idx, text, skip, over }}
                <div
                  class="chat"
                  class:chat-end={agent === $info?.agent}
                  class:chat-start={agent !== $info?.agent}
                >
                  <div class="chat-image avatar avatar-placeholder">
                    <div
                      class="bg-neutral text-neutral-content w-12 rounded-full"
                    >
                      <span class="text-2xl"
                        >{Number(agent.match(/Agent\[(\d+)\]/)?.[1]) ??
                          ""}</span
                      >
                    </div>
                  </div>
                  <div class="chat-header"></div>
                  <div class="chat-bubble bg-base-100">{text}</div>
                  <div class="chat-footer opacity-50">Day {day} Idx {idx}</div>
                </div>
              {/each}
              {#if $whisperHistory.length > 0}
                <h2 class="font-bold text-lg p-2">囁き履歴</h2>
              {/if}
              {#each $whisperHistory as { agent, day, idx, text, skip, over }}
                <div
                  class="chat"
                  class:chat-end={agent === $info?.agent}
                  class:chat-start={agent !== $info?.agent}
                >
                  <div class="chat-image avatar avatar-placeholder">
                    <div
                      class="bg-neutral text-neutral-content w-12 rounded-full"
                    >
                      <span class="text-2xl"
                        >{Number(agent.match(/Agent\[(\d+)\]/)?.[1]) ??
                          ""}</span
                      >
                    </div>
                  </div>
                  <div class="chat-header"></div>
                  <div class="chat-bubble bg-base-100">{text}</div>
                  <div class="chat-footer opacity-50">Day {day} Idx {idx}</div>
                </div>
              {/each}
              <div class="divider"></div>
              <pre>{JSON.stringify($setting, null, 2)}</pre>
            </div>
            <button
              class="cursor-ew-resize w-2 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition-colors border-0"
              onmousedown={onDragStart}
              ontouchstart={onDragStart}
              aria-label="Resize"
            ></button>
            <div
              class="overflow-y-auto pl-2 h-full"
              style="width: {100 - width - 0.5}%;"
            >
              {#each $entries as entry, i}
                <pre class="overflow-x-auto">{JSON.stringify(
                    entry,
                    null,
                    2
                  )}</pre>
                <div class="divider"></div>
              {/each}
            </div>
          </div>
        </div>
        <input type="radio" name="tab" class="tab" aria-label="Tab 2" />
        <div class="tab-content">Tab content 2</div>
      </div>
    </div>
    <div class="flex gap-2 m-4">
      <input type="text" class="input flex-1" bind:value={$message} />
      <button
        class="btn btn-square"
        onclick={() => {
          agentSocketState.send($message);
          $message = "";
        }}
        aria-label="Send"
      >
        <iconify-icon icon="mdi:send"></iconify-icon>
      </button>
    </div>
  </div>
</main>
