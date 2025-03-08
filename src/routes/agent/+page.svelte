<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { agentSettings } from "$lib/stores/agent-settings";
  import {
    Request,
    RequestJA,
    RoleJA,
    Species,
    SpeciesJA,
    Status,
    StatusJA,
    type Info,
    type Judge,
    type Packet,
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
  const deadline = writable<number | null>(null);
  const entries = writable<(Packet | string)[]>([]);
  const role = writable<Role | null>(null);
  const request = writable<Request | null>(null);
  const info = writable<Info | null>(null);
  const mediumResults = writable<Judge[]>([]);
  const divineResults = writable<Judge[]>([]);
  const setting = writable<Setting | null>(null);
  const talkHistory = writable<Talk[]>([]);
  const whisperHistory = writable<Talk[]>([]);
  const executedAgents = writable<string[]>([]);
  const attackedAgents = writable<string[]>([]);

  const remain = writable<number | null>(null);
  const message = writable<string>("");

  let settings = $state<AgentSettings>();
  let animationFrameId: number;

  let width = $state<number>(50);
  let isDragging = false;
  let containerRef: HTMLDivElement | null = null;

  function connectWithParams() {
    if (browser) {
      const params = page.url.searchParams;
      const url = params.get("url");
      const token = params.get("token");

      if (url) {
        agentSettings.update((value) => ({
          ...value,
          connection: {
            url: url ?? "",
            token: token ?? "",
          },
        }));

        agentSocketState.connect();
      }
    }
  }

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

  function updateDeadline() {
    if ($deadline !== null) {
      const now = Date.now();
      const remainingTime = Math.max(0, $deadline - now);
      remain.set(remainingTime);

      if (remainingTime > 0) {
        animationFrameId = requestAnimationFrame(updateDeadline);
      } else {
        remain.set(0);
      }
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }

  onMount(() => {
    connectWithParams();

    const unsubscribeStatus = agentSocketState.subscribe((value) => {
      status.set(value.status);

      if (value.deadline) {
        deadline.set(value.deadline.getTime());
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(updateDeadline);
      } else {
        deadline.set(null);
        remain.set(null);
      }

      entries.set(value.entries);
      role.set(value.role);
      request.set(value.request);
      info.set(value.info);
      mediumResults.set(value.mediumResults);
      divineResults.set(value.divineResults);
      setting.set(value.setting);
      talkHistory.set(value.talkHistory);
      whisperHistory.set(value.whisperHistory);
      executedAgents.set(value.executedAgents);
      attackedAgents.set(value.attackedAgents);
    });

    const unsubscribeSettings = agentSettings.subscribe((value) => {
      settings = value;
    });

    onDestroy(() => {
      unsubscribeStatus();
      unsubscribeSettings();

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    if (browser) {
      window.addEventListener("beforeunload", (e) => {
        if ($status === "connected") {
          e.preventDefault();
        }
      });
      window.addEventListener("popstate", (e) => {
        if ($status === "connected") {
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
    <div class="flex-auto bg-base-300 h-full overflow-hidden">
      <div class="flex flex-row h-full" bind:this={containerRef}>
        <div class="overflow-y-auto px-2 h-full" style="width: {width}%">
          <pre class="font-bold text-xl p-2">{$info?.agent ?? "未接続"} {RoleJA[
              $role!
            ]}</pre>
          {#if $request !== null}
            <pre class="bg-primary text-primary-content p-2">{$info !== null
                ? $info.day + "日目"
                : "ゲーム外"} {RequestJA[$request!]}</pre>
          {/if}
          {#if $info !== null}
            <div class="p-2">
              {#each Object.entries($info.statusMap ?? {}) as [key, value]}
                <div class="flex flex-row gap-2">
                  <pre>{key}</pre>
                  <pre>{RoleJA[($info.roleMap ?? {})[key]] ?? "-"}</pre>
                  {#if value === Status.ALIVE}
                    <pre
                      class="font-bold bg-info text-info-content ml-auto">{StatusJA[
                        value
                      ]}</pre>
                  {:else}
                    <pre
                      class="font-bold bg-error text-error-content ml-auto">{StatusJA[
                        value
                      ]}{$executedAgents.includes(key)
                        ? " (追放)"
                        : $attackedAgents.includes(key)
                          ? " (襲撃)"
                          : ""}</pre>
                  {/if}
                </div>
              {/each}
            </div>
            {#if $mediumResults.length > 0}
              <div class="p-2">
                <h2 class="font-bold text-lg">霊能結果</h2>
                {#each $mediumResults as { day, target, result }}
                  <div class="flex flex-row gap-2">
                    <pre>{target}</pre>
                    <pre>(Day{day})</pre>
                    {#if result === Species.HUMAN}
                      <pre
                        class="font-bold bg-success text-success-content ml-auto">{SpeciesJA[
                          result
                        ]}</pre>{:else}
                      <pre
                        class="font-bold bg-error text-error-content ml-auto">{SpeciesJA[
                          result
                        ]}</pre>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
            {#if $divineResults.length > 0}
              <div class="p-2">
                <h2 class="font-bold text-lg">占い結果</h2>
                {#each $divineResults as { day, target, result }}
                  <div class="flex flex-row gap-2">
                    <pre>{target}</pre>
                    <pre>(Day{day})</pre>
                    {#if result === Species.HUMAN}
                      <pre
                        class="font-bold bg-info text-info-content ml-auto">{SpeciesJA[
                          result
                        ]}</pre>{:else}
                      <pre
                        class="font-bold bg-error text-error-content ml-auto">{SpeciesJA[
                          result
                        ]}</pre>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          {/if}
          {#if $talkHistory.length > 0}
            <div class="p-2">
              <h2 class="font-bold text-lg">トーク履歴</h2>
              {#if $talkHistory.length > 0}
                {@const days = [
                  ...new Set($talkHistory.map((t) => t.day)),
                ].sort((a, b) => b - a)}
                <div class="tabs tabs-border">
                  {#each days as day}
                    <input
                      type="radio"
                      name="talk_days"
                      class="tab"
                      checked={day === days[0]}
                      aria-label={`${day}日目`}
                    />
                    <div
                      class="tab-content bg-base-200 p-2 max-h-96 overflow-y-auto"
                    >
                      {#each $talkHistory.filter((t) => t.day === day) as { agent, idx, text, skip, over }}
                        <div class="chat chat-start">
                          <div class="chat-image avatar avatar-placeholder">
                            <div
                              class="bg-neutral text-neutral-content w-12 rounded-full"
                            >
                              <span class="text-2xl">
                                {Number(agent.match(/Agent\[(\d+)\]/)?.[1]) ??
                                  ""}
                              </span>
                            </div>
                          </div>
                          <div class="chat-header"></div>
                          <div
                            class="chat-bubble bg-base-100 text-pretty break-all"
                          >
                            {text}
                          </div>
                          <pre class="chat-footer opacity-50">{idx}</pre>
                        </div>
                      {/each}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
          {#if $whisperHistory.length > 0}
            <div class="p-2">
              <h2 class="font-bold text-lg">囁き履歴</h2>
              {#if $whisperHistory.length > 0}
                {@const days = [
                  ...new Set($whisperHistory.map((t) => t.day)),
                ].sort((a, b) => b - a)}
                <div class="tabs tabs-border">
                  {#each days as day}
                    <input
                      type="radio"
                      name="whisper_days"
                      class="tab"
                      checked={day === days[0]}
                      aria-label={`${day}日目`}
                    />
                    <div
                      class="tab-content bg-base-200 p-2 max-h-96 overflow-y-auto"
                    >
                      {#each $whisperHistory.filter((t) => t.day === day) as { agent, idx, text, skip, over }}
                        <div class="chat chat-start">
                          <div class="chat-image avatar avatar-placeholder">
                            <div
                              class="bg-neutral text-neutral-content w-12 rounded-full"
                            >
                              <span class="text-2xl">
                                {Number(agent.match(/Agent\[(\d+)\]/)?.[1]) ??
                                  ""}
                              </span>
                            </div>
                          </div>
                          <div class="chat-header"></div>
                          <div
                            class="chat-bubble bg-base-100 text-pretty break-all"
                          >
                            {text}
                          </div>
                          <pre class="chat-footer opacity-50">{idx}</pre>
                        </div>
                      {/each}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
        <button
          class="cursor-ew-resize w-2 rounded bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition-colors border-0 my-2"
          onmousedown={onDragStart}
          ontouchstart={onDragStart}
          aria-label="Resize"
        ></button>
        <div
          class="overflow-y-auto pl-2 h-full"
          style="width: {100 - width - 0.5}%;"
        >
          {#each [...$entries].reverse() as entry}
            <pre class="overflow-x-auto">{JSON.stringify(entry, null, 2)}</pre>
            <div class="divider"></div>
          {/each}
        </div>
      </div>
    </div>
    {#if $remain !== null}
      <div class="m-4">
        <div class="flex gap-2 items-center">
          <span class="countdown font-mono text-2xl">
            {#if $remain > 60000}
              <span
                style="--value:{Math.floor($remain / 60000)};"
                aria-live="polite"
                aria-label={Math.floor($remain / 60000).toString()}
                >{Math.floor($remain / 60000)}</span
              >m
            {/if}
            <span
              style="--value:{Math.floor(($remain % 60000) / 1000)};"
              aria-live="polite"
              aria-label={Math.floor(($remain % 60000) / 1000).toString()}
              >{Math.floor(($remain % 60000) / 1000)}</span
            >s
          </span>
          {#if $request === Request.VOTE || $request === Request.DIVINE || $request === Request.GUARD || $request === Request.ATTACK}
            {#each Object.entries($info?.statusMap ?? {}) as [key, value]}
              {#if value === Status.ALIVE && key !== $info?.agent}
                <button class="btn" onclick={() => ($message = key)}>
                  {key}
                </button>
              {/if}
            {/each}
          {:else}
            {#if $setting?.maxSkip ?? 0 > 0}
              <button
                class="btn btn-square"
                onclick={() => ($message = "Skip")}
                aria-label="Skip"
              >
                <iconify-icon icon="mdi:arrow-u-down-right-bold"></iconify-icon>
              </button>
            {/if}
            <button
              class="btn btn-square"
              onclick={() => ($message = "Over")}
              aria-label="Over"
            >
              <iconify-icon icon="mdi:skip-forward"></iconify-icon>
            </button>
          {/if}
          <input
            type="text"
            class="input flex-1"
            bind:value={$message}
            list="agents"
          />
          <datalist id="agents">
            {#each Object.entries($info?.statusMap ?? {}) as [key, value]}
              {#if value === Status.ALIVE && key !== $info?.agent}
                <option value={key}></option>
              {/if}
            {/each}
          </datalist>
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
        <progress
          class="progress"
          value={$remain !== null
            ? ($remain / ($setting?.actionTimeout ?? 60000)) * 100
            : 0}
          max="100"
        ></progress>
      </div>
    {/if}
  </div>
</main>
