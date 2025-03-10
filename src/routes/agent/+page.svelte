<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { agentSettings } from "$lib/stores/agent-settings";
  import {
    Request,
    Role,
    type Info,
    type Judge,
    type Packet,
    type Setting,
    type Talk,
  } from "$lib/types/agent";
  import { type AgentSettings } from "$lib/types/agent-settings";
  import { agentSocketState } from "$lib/utils/agent-socket";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import "../../app.css";
  import ActionBar from "./ActionBar.svelte";
  import AgentColumn from "./AgentColumn.svelte";
  import Navbar from "./Navbar.svelte";
  import TalkHistory from "./TalkColumn.svelte";

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

  function handleSendMessage(message: string) {
    agentSocketState.send(message);
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main class="h-screen flex flex-col bg-base-300">
  <Navbar />
  {#if $info !== null}
    <div class="overflow-y-hidden flex grow overflox-x-auto gap-4 p-4">
      <AgentColumn
        role={$role}
        request={$request}
        info={$info}
        mediumResults={$mediumResults}
        divineResults={$divineResults}
        executedAgents={$executedAgents}
        attackedAgents={$attackedAgents}
      />
      <TalkHistory header="トーク履歴" talks={$talkHistory} />
      {#if $role === Role.WEREWOLF}
        <TalkHistory header="囁き履歴" talks={$whisperHistory} />
      {/if}
    </div>
    {#if $remain !== null}
      <ActionBar
        remain={$remain}
        setting={$setting}
        request={$request}
        info={$info}
        onSendMessage={handleSendMessage}
      />
    {/if}
  {:else if settings?.display.largeScale}
    <div class="flex items-center justify-center h-full">
      <pre
        class="base-content text-9xl font-bold opacity-70 select-none">未接続</pre>
    </div>
  {:else}
    <div role="alert" class="alert m-4">
      <span class="text-lg font-bold">未接続</span>
    </div>
  {/if}
</main>
