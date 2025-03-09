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

<main class="h-screen flex flex-col bg-base-300">
  <Navbar />
  <div class="flex-1 flex flex-col h-full overflow-hidden">
    <div class="flex flex-row h-full">
      <div class="w-1/3 flex flex-col overflow-y-auto">
        <pre class="font-bold text-3xl p-2">{$info?.agent ?? "未接続"} {RoleJA[
            $role!
          ]}</pre>
        {#if $request !== null}
          <pre
            class="bg-primary text-primary-content text-2xl p-2 m-2">{$info !==
            null
              ? $info.day + "日目"
              : "ゲーム外"} {RequestJA[$request!]}</pre>
        {/if}
        {#if $info !== null}
          <div class="p-2">
            {#each Object.entries($info.statusMap ?? {}) as [key, value]}
              {#if value === Status.ALIVE}
                <div class="bg-info text-info-content flex flex-row gap-2 p-2">
                  <pre class="font-bold text-2xl">{key}</pre>
                  <pre class="font-bold text-2xl">{RoleJA[
                      ($info.roleMap ?? {})[key]
                    ] ?? ""}</pre>
                  <pre class="font-bold text-2xl ml-auto">{StatusJA[
                      value
                    ]}</pre>
                </div>
              {:else}
                <div
                  class="bg-error text-error-content flex flex-row gap-2 p-2"
                >
                  <pre class="font-bold text-2xl">{key}</pre>
                  <pre class="font-bold text-2xl">{RoleJA[
                      ($info.roleMap ?? {})[key]
                    ] ?? ""}</pre>
                  <pre class="font-bold text-2xl ml-auto">{StatusJA[
                      value
                    ]}{$executedAgents.includes(key)
                      ? " (追放)"
                      : $attackedAgents.includes(key)
                        ? " (襲撃)"
                        : ""}</pre>
                </div>
              {/if}
            {/each}
          </div>
          {#if $mediumResults.length > 0}
            <div class="p-2">
              <h2 class="font-bold text-lg">霊能結果</h2>
              {#each $mediumResults as { day, target, result }}
                {#if result !== Species.HUMAN}
                  <div
                    class="bg-error text-error-content flex flex-row gap-2 p-2"
                  >
                    <pre class="font-bold text-2xl">{target}</pre>
                    <pre class="font-bold text-2xl">({day}日目)</pre>
                    <pre class="font-bold text-2xl ml-auto">{SpeciesJA[
                        result
                      ]}</pre>
                  </div>
                {:else}
                  <div
                    class="bg-success text-success-content flex flex-row gap-2 p-2"
                  >
                    <pre class="font-bold text-2xl">{target}</pre>
                    <pre class="font-bold text-2xl">({day}日目)</pre>
                    <pre class="font-bold text-2xl ml-auto">{SpeciesJA[
                        result
                      ]}</pre>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
          {#if $divineResults.length > 0}
            <div class="p-2">
              <h2 class="font-bold text-lg">占い結果</h2>
              {#each $divineResults as { day, target, result }}
                {#if result !== Species.HUMAN}
                  <div
                    class="bg-error text-error-content flex flex-row gap-2 p-2"
                  >
                    <pre class="font-bold text-2xl">{target}</pre>
                    <pre class="font-bold text-2xl">({day}日目)</pre>
                    <pre class="font-bold text-2xl ml-auto">{SpeciesJA[
                        result
                      ]}</pre>
                  </div>
                {:else}
                  <div
                    class="bg-success text-success-content flex flex-row gap-2 p-2"
                  >
                    <pre class="font-bold text-2xl">{target}</pre>
                    <pre class="font-bold text-2xl">({day}日目)</pre>
                    <pre class="font-bold text-2xl ml-auto">{SpeciesJA[
                        result
                      ]}</pre>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        {/if}
      </div>
      <div class="w-1/3 flex flex-col overflow-y-auto">
        <h2 class="font-bold text-lg p-2">トーク履歴</h2>
        {#if $talkHistory.length > 0}
          {@const days = [...new Set($talkHistory.map((t) => t.day))].sort(
            (a, b) => b - a
          )}
          <div class="tabs tabs-border flex-none">
            {#each days as day}
              <input
                type="radio"
                name="talk_days"
                class="tab"
                checked={day === days[0]}
                aria-label={`${day}日目`}
              />
              <div class="tab-content overflow-y-auto h-full">
                {#each $talkHistory.filter((t) => t.day === day) as { agent, idx, text, skip, over }}
                  <div class="chat chat-start">
                    <div class="chat-image avatar avatar-placeholder">
                      <div
                        class="bg-neutral text-neutral-content w-12 rounded-full"
                      >
                        <span class="text-2xl">
                          {Number(agent.match(/Agent\[(\d+)\]/)?.[1]) ?? ""}
                        </span>
                      </div>
                    </div>
                    <div class="chat-header"></div>
                    <div class="chat-bubble bg-base-100 text-pretty break-all">
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
      <div class="w-1/3 flex flex-col overflow-y-auto">
        <h2 class="font-bold text-lg">囁き履歴</h2>
        {#if $whisperHistory.length > 0}
          {@const days = [...new Set($whisperHistory.map((t) => t.day))].sort(
            (a, b) => b - a
          )}
          <div class="tabs tabs-border flex-none">
            {#each days as day}
              <input
                type="radio"
                name="whisper_days"
                class="tab"
                checked={day === days[0]}
                aria-label={`${day}日目`}
              />
              <div class="tab-content overflow-y-auto h-full">
                {#each $whisperHistory.filter((t) => t.day === day) as { agent, idx, text, skip, over }}
                  <div class="chat chat-start">
                    <div class="chat-image avatar avatar-placeholder">
                      <div
                        class="bg-neutral text-neutral-content w-12 rounded-full"
                      >
                        <span class="text-2xl">
                          {Number(agent.match(/Agent\[(\d+)\]/)?.[1]) ?? ""}
                        </span>
                      </div>
                    </div>
                    <div class="chat-header"></div>
                    <div class="chat-bubble bg-base-100 text-pretty break-all">
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
    </div>
  </div>

  {#if $remain !== null}
    <div class="flex-none bg-base-200">
      <div class="flex gap-2 items-center mx-4 mt-4">
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
      <div class="mx-4 mb-2">
        <progress
          class="progress"
          value={$remain !== null
            ? ($remain / ($setting?.actionTimeout ?? 60000)) * 100
            : 0}
          max="100"
        ></progress>
      </div>
    </div>
  {/if}
</main>
