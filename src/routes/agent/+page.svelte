<script lang="ts">
  import { browser } from "$app/environment";
  import { agentSettings } from "$lib/stores/agent-settings";
  import type {
    Info,
    Packet,
    Request,
    Role,
    Setting,
    Talk,
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
      <div class="flex flex-row h-full" bind:this={containerRef}>
        <div class="overflow-y-auto pr-2 h-full" style="width: {width}%">
          <div class="grid auto-cols-max grid-flow-row gap-2">
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h2 class="card-title">役職</h2>
                <pre class="overflow-x-auto">{$role}</pre>
              </div>
            </div>
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h2 class="card-title">リクエスト</h2>
                <pre class="overflow-x-auto">{$request}</pre>
              </div>
            </div>
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h2 class="card-title">現状態</h2>
                <pre class="overflow-x-auto">{JSON.stringify(
                    $info,
                    null,
                    2
                  )}</pre>
              </div>
            </div>
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h2 class="card-title">設定</h2>
                <pre class="overflow-x-auto">{JSON.stringify(
                    $setting,
                    null,
                    2
                  )}</pre>
              </div>
            </div>
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h2 class="card-title">トーク履歴</h2>
                <pre class="overflow-x-auto">{JSON.stringify(
                    $talkHistory,
                    null,
                    2
                  )}</pre>
              </div>
            </div>
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h2 class="card-title">囁き履歴</h2>
                <pre class="overflow-x-auto">{JSON.stringify(
                    $whisperHistory,
                    null,
                    2
                  )}</pre>
              </div>
            </div>
          </div>
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
            <pre class="overflow-x-auto">{JSON.stringify(entry, null, 2)}</pre>
            <div class="divider"></div>
          {/each}
        </div>
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
