<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { Role } from "$lib/constants/common";
  import { agentSettings } from "$lib/stores/agent-settings";
  import {
    Request,
    type Info,
    type Judge,
    type Packet,
    type Setting,
    type Talk,
  } from "$lib/types/agent";
  import { type AgentSettings } from "$lib/types/agent-settings";
  import { agentSocketState } from "$lib/utils/agent-socket";
  import { _ } from 'svelte-i18n';
  import { onDestroy } from "svelte";
  import "../../app.css";
  import ActionBar from "./ActionBar.svelte";
  import AgentColumn from "./AgentColumn.svelte";
  import Navbar from "./Navbar.svelte";
  import TalkColumn from "./TalkColumn.svelte";

  let settings = $state<AgentSettings | undefined>(undefined);
  let status = $state("");
  let deadline = $state<number | null>(null);
  let entries = $state<(Packet | string)[]>([]);
  let agent = $state<string | null>(null);
  let role = $state<Role | null>(null);
  let profile = $state<string | null>(null);
  let request = $state<Request | null>(null);
  let info = $state<Info | null>(null);
  let mediumResults = $state<Judge[]>([]);
  let divineResults = $state<Judge[]>([]);
  let setting = $state<Setting | null>(null);
  let talkHistory = $state<Talk[]>([]);
  let whisperHistory = $state<Talk[]>([]);
  let executedAgents = $state<string[]>([]);
  let attackedAgents = $state<string[]>([]);
  let remain = $state<number | null>(null);
  let animationFrameId = $state<number | null>(null);

  let unsubscribeSettings = agentSettings.subscribe((value) => {
    settings = value;
  });

  let unsubscribeSocketState = agentSocketState.subscribe((socketState) => {
    status = socketState.status;

    if (socketState.deadline) {
      deadline = socketState.deadline.getTime();
      updateDeadline();
    } else {
      deadline = null;
      remain = null;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    entries = socketState.entries;
    agent = socketState.agent;
    role = socketState.role;
    profile = socketState.profile;
    request = socketState.request;
    info = socketState.info;
    mediumResults = socketState.mediumResults;
    divineResults = socketState.divineResults;
    setting = socketState.setting;
    talkHistory = socketState.talkHistory;
    whisperHistory = socketState.whisperHistory;
    executedAgents = socketState.executedAgents;
    attackedAgents = socketState.attackedAgents;
  });

  function connectWithParams() {
    if (!browser) return;

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

  function updateDeadline() {
    if (deadline === null) return;

    const calculateRemaining = () => {
      if (deadline === null) return;

      const now = Date.now();
      const remainingTime = Math.max(0, deadline - now);
      remain = remainingTime;

      if (remainingTime > 0) {
        animationFrameId = requestAnimationFrame(calculateRemaining);
      } else {
        remain = 0;
        animationFrameId = null;
      }
    };

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(calculateRemaining);
  }

  function handleSendMessage(message: string) {
    agentSocketState.send(message);
  }

  if (browser) {
    connectWithParams();

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === "connected") {
        e.preventDefault();
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (status === "connected") {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    onDestroy(() => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      unsubscribeSettings();
      unsubscribeSocketState();
    });
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main class="h-screen flex flex-col bg-base-300">
  <Navbar />
  {#if info !== null}
    <div class="overflow-y-hidden flex grow overflox-x-auto gap-4 p-4">
      <AgentColumn
        {agent}
        {role}
        {profile}
        {request}
        {info}
        {mediumResults}
        {divineResults}
        {executedAgents}
        {attackedAgents}
      />
      <TalkColumn
        header={$_('agent.talkHistory')}
        talks={talkHistory}
        agents={Object.keys(info?.status_map ?? {})}
      />
      {#if role === Role.WEREWOLF}
        <TalkColumn
          header={$_('agent.whisperHistory')}
          talks={whisperHistory}
          agents={Object.keys(info?.status_map ?? {})}
        />
      {/if}
    </div>
    {#if remain !== null}
      <ActionBar
        {remain}
        {setting}
        {request}
        {info}
        onSendMessage={handleSendMessage}
      />
    {/if}
  {:else if settings?.display.largeScale}
    <div class="flex items-center justify-center h-full">
      <pre
        class="base-content text-9xl font-bold opacity-70 select-none">{$_('agent.notConnected')}</pre>
    </div>
  {:else}
    <div role="alert" class="alert m-4">
      <span class="text-lg font-bold">{$_('agent.notConnected')}</span>
    </div>
  {/if}
</main>
