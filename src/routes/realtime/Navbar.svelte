<script lang="ts">
  import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";
  import { realtimeSettings } from "$lib/stores/realtime-settings";
  import type { RealtimeSettings } from "$lib/types/realtime-settings";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";

  let settings = $state<RealtimeSettings>();
  let status = $state<string>();

  const unsubscribeSettings = realtimeSettings.subscribe((value) => {
    settings = value;
  });

  const unsubscribeStatus = realtimeSocketState.subscribe((state) => {
    status = state.status;
  });

  onDestroy(() => {
    unsubscribeSettings();
    unsubscribeStatus();
  });

  function updateSettings(path: string, value: any) {
    realtimeSettings.update((current) => {
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
    realtimeSocketState.connect();
  }

  function handleDisconnect() {
    realtimeSocketState.disconnect();
  }

  async function loadClipboardLog() {
    await realtimeSocketState.loadFromClipboard();
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
    disabled={status !== "disconnected" && status !== "loaded"}
    >{$_("realtime.connect")}</button
  >
  <button
    class="btn btn-error"
    onclick={handleDisconnect}
    disabled={status === "disconnected" || status === "loaded"}
    >{$_("realtime.disconnect")}</button
  >
  <button class="btn" onclick={loadClipboardLog}>
    {$_("realtime.pasteFromClipboard")}
  </button>
  <button class="btn" onclick={() => modal.showModal()}
    >{$_("realtime.settings")}</button
  >
  <dialog class="modal" bind:this={modal}>
    <div class="modal-box">
      <div class="form-control my-2">
        <h3 class="text-lg font-bold">{$_("realtime.displaySettings")}</h3>
        <h4 class="text-base font-bold mt-2">
          {$_("realtime.canvasAgentInfo")}
        </h4>
        <div class="flex gap-4 my-2">
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.name")}</span>
            <input
              type="checkbox"
              checked={settings?.display.canvas.name}
              onchange={(e) =>
                updateSettings("display.canvas.name", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.teamName")}</span>
            <input
              type="checkbox"
              checked={settings?.display.canvas.team}
              onchange={(e) =>
                updateSettings("display.canvas.team", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.role")}</span>
            <input
              type="checkbox"
              checked={settings?.display.canvas.role}
              onchange={(e) =>
                updateSettings("display.canvas.role", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
        </div>
        <h4 class="text-base font-bold mt-2">
          {$_("realtime.messageBoxAgentInfo")}
        </h4>
        <div class="flex gap-4 my-2">
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.name")}</span>
            <input
              type="checkbox"
              checked={settings?.display.bubble.name}
              onchange={(e) =>
                updateSettings("display.bubble.name", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.teamName")}</span>
            <input
              type="checkbox"
              checked={settings?.display.bubble.team}
              onchange={(e) =>
                updateSettings("display.bubble.team", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.role")}</span>
            <input
              type="checkbox"
              checked={settings?.display.bubble.role}
              onchange={(e) =>
                updateSettings("display.bubble.role", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
        </div>
        <h4 class="text-base font-bold mt-2">{$_("realtime.listAgentInfo")}</h4>
        <div class="flex gap-4 my-2">
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.name")}</span>
            <input
              type="checkbox"
              checked={settings?.display.text.name}
              onchange={(e) =>
                updateSettings("display.text.name", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.teamName")}</span>
            <input
              type="checkbox"
              checked={settings?.display.text.team}
              onchange={(e) =>
                updateSettings("display.text.team", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">{$_("realtime.role")}</span>
            <input
              type="checkbox"
              checked={settings?.display.text.role}
              onchange={(e) =>
                updateSettings("display.text.role", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
        </div>
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
