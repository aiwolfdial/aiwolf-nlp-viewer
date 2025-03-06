<script lang="ts">
  import { agentSettings } from "$lib/stores/agent-settings";
  import type { AgentSettings } from "$lib/types/agent-settings";
  import { agentSocketState } from "$lib/utils/agent-socket";
  import { onDestroy } from "svelte";
  import "../../app.css";

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
  <h1 class="text-3xl font-bold text-nowrap ml-2">aiwolf-nlp-viewer</h1>
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
      placeholder="WebSocket URL"
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
      placeholder="Authorization Key"
      value={settings?.connection.token}
      oninput={(e) => updateSettings("connection.token", e.currentTarget.value)}
    />
    <span class="badge badge-neutral badge-xs">Optional</span>
  </label>
  <button
    class="btn btn-info"
    onclick={handleConnect}
    disabled={status !== "disconnected"}>接続</button
  >
  <button
    class="btn btn-error"
    onclick={handleDisconnect}
    disabled={status === "disconnected"}>切断</button
  >
  <button class="btn" onclick={() => modal.showModal()}>設定</button>
  <dialog class="modal" bind:this={modal}>
    <div class="modal-box">
      <div class="form-control">
        <h3 class="text-lg font-bold mt-2">エージェント設定</h3>
        <h4 class="text-base font-bold mt-4">チーム名</h4>
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
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
  <label class="flex items-center cursor-pointer gap-2">
    <iconify-icon inline icon="mdi:white-balance-sunny"></iconify-icon>
    <input type="checkbox" value="dark" class="toggle theme-controller" />
    <iconify-icon inline icon="mdi:moon-and-stars"></iconify-icon>
  </label>
</div>
