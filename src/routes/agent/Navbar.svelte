<script lang="ts">
  import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";
  import { agentSettings } from "$lib/stores/agent-settings";
  import type { AgentSettings } from "$lib/types/agent-settings";
  import { agentSocketState } from "$lib/utils/agent-socket";
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";

  let settings = $state<AgentSettings>();
  let status = $state<string>();

  const unsubscribeSettings = agentSettings.subscribe((value) => {
    settings = value;
  });

  const unsubscribeStatus = agentSocketState.subscribe((state) => {
    status = state.status;
  });

  onDestroy(() => {
    unsubscribeSettings();
    unsubscribeStatus();
  });

  function updateSettings(path: string, value: any) {
    agentSettings.update((current) => {
      const keys = path.split(".");
      const lastKey = keys.pop()!;
      let target = current;

      for (const key of keys) {
        if (key) {
          target = target[key as keyof typeof target] as any;
        }
      }

      target[lastKey as keyof typeof target] = value;
      return { ...current };
    });
  }

  function handleConnect() {
    agentSocketState.connect();
  }

  function handleDisconnect() {
    agentSocketState.disconnect();
  }

  let modal: HTMLDialogElement;
</script>

<div class="navbar bg-base-100 flex justify-start gap-4 overflow-x-auto">
  <a class="text-3xl font-bold text-nowrap ml-2" href="./">
    {$_("appName")}
  </a>
  <div class="ml-auto">
    <div class="inline-grid *:[grid-area:1/1]">
      {#if status === "connected"}<div
          class="status status-success animate-ping"
        ></div>
        <div class="status status-success"></div>
      {:else if status === "connecting"}<div
          class="status status-warning animate-ping"
        ></div>
        <div class="status status-warning"></div>
      {:else}
        <div class="status status-error"></div>
      {/if}
    </div>
  </div>
  <label class="input min-w-3xs w-3xs">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:link"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder={$_("realtime.websocketUrl")}
      value={settings?.connection.url}
      oninput={(e) => updateSettings("connection.url", e.currentTarget.value)}
    />
  </label>
  <label class="input min-w-3xs w-3xs">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:key"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder={$_("realtime.authKey")}
      value={settings?.connection.token}
      oninput={(e) => updateSettings("connection.token", e.currentTarget.value)}
    />
    <span class="badge badge-neutral badge-xs">{$_("realtime.optional")}</span>
  </label>
  <button
    class="btn btn-info"
    onclick={handleConnect}
    disabled={status !== "disconnected"}>{$_("realtime.connect")}</button
  >
  <button
    class="btn btn-error"
    onclick={handleDisconnect}
    disabled={status === "disconnected"}>{$_("realtime.disconnect")}</button
  >
  <button class="btn" onclick={() => modal.showModal()}
    >{$_("realtime.settings")}</button
  >
  <dialog class="modal" bind:this={modal}>
    <div class="modal-box">
      <div class="form-control my-2">
        <h3 class="text-lg font-bold">{$_("agent.agentSettings")}</h3>
        <h4 class="text-base font-bold mt-2">{$_("agent.teamName")}</h4>
        <label class="input min-w-3xs w-3xs my-2">
          <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:rename"
          ></iconify-icon>
          <input
            type="text"
            class="grow"
            value={settings?.team}
            oninput={(e) => updateSettings("team", e.currentTarget.value)}
          />
        </label>
        <h3 class="text-lg font-bold mt-4">{$_("realtime.displaySettings")}</h3>
        <h4 class="text-base font-bold mt-2">{$_("realtime.largeScreen")}</h4>
        <label class="label cursor-pointer my-2">
          <span class="label-text">{$_("realtime.enable")}</span>
          <input
            type="checkbox"
            checked={settings?.display.largeScale}
            onchange={(e) =>
              updateSettings("display.largeScale", e.currentTarget.checked)}
            class="checkbox"
          />
        </label>
        <h4 class="text-base font-bold mt-2">{$_("common.language")}</h4>
        <div class="my-2">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>{$_("common.close")}</button>
    </form>
  </dialog>
  <label class="flex items-center cursor-pointer gap-2">
    <iconify-icon inline icon="mdi:white-balance-sunny"></iconify-icon>
    <input type="checkbox" value="dark" class="toggle theme-controller" />
    <iconify-icon inline icon="mdi:moon-and-stars"></iconify-icon>
  </label>
</div>
