<script lang="ts">
  import { realtimeSettings } from "$lib/stores/realtime-settings";
  import type { RealtimeSettings } from "$lib/types/realtime-settings";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../../app.css";

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

  let modal: HTMLDialogElement;
</script>

<div class="navbar bg-base-100 flex justify-start">
  <h1 class="text-3xl font-bold truncate mx-4">aiwolf-nlp-viewer</h1>
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
  <label class="input mx-2">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:link"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder="WebSocket URL"
      value={settings?.connection.url}
      oninput={(e) => updateSettings("connection.url", e.currentTarget.value)}
    />
  </label>
  <label class="input mx-2">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:key"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder="Authorization Key"
      value={settings?.connection.token}
      oninput={(e) => updateSettings("connection.token", e.currentTarget.value)}
    />
    <span class="badge badge-neutral badge-xs">Optional</span>
  </label>
  <button
    class="btn btn-info mx-2"
    onclick={handleConnect}
    disabled={status !== "disconnected"}>接続</button
  >
  <button
    class="btn btn-error mx-2"
    onclick={handleDisconnect}
    disabled={status === "disconnected"}>切断</button
  >
  <button class="btn mx-2" onclick={() => modal.showModal()}>設定</button>
  <dialog class="modal" bind:this={modal}>
    <div class="modal-box">
      <div class="form-control">
        <h3 class="text-lg font-bold my-2">表示設定</h3>
        <h4 class="text-base font-bold my-2">エージェント</h4>
        <div class="flex gap-4 my-2">
          <label class="label cursor-pointer">
            <span class="label-text">名前</span>
            <input
              type="checkbox"
              checked={settings?.display.agent.name}
              onchange={(e) =>
                updateSettings("display.agent.name", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">チーム名</span>
            <input
              type="checkbox"
              checked={settings?.display.agent.team}
              onchange={(e) =>
                updateSettings("display.agent.team", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text">役職</span>
            <input
              type="checkbox"
              checked={settings?.display.agent.role}
              onchange={(e) =>
                updateSettings("display.agent.role", e.currentTarget.checked)}
              class="checkbox"
            />
          </label>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>

  <label class="flex items-center cursor-pointer gap-2 mx-2">
    <iconify-icon inline icon="mdi:white-balance-sunny"></iconify-icon>
    <input type="checkbox" value="dark" class="toggle theme-controller" />
    <iconify-icon inline icon="mdi:moon-and-stars"></iconify-icon>
  </label>
</div>
