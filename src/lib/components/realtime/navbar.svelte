<script lang="ts">
  import {
    realtimeSettings,
    type RealtimeSettings,
  } from "$lib/stores/realtime-settings";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../../app.css";

  let settings: RealtimeSettings;
  let status: string;

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

  function updateSettings<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) {
    realtimeSettings.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleConnect() {
    realtimeSocketState.connect();
  }

  function handleDisconnect() {
    realtimeSocketState.disconnect();
  }
</script>

<div class="navbar bg-base-100 flex justify-start">
  <h1 class="text-3xl font-bold truncate mx-4">aiwolf-nlp-viewer</h1>
  <div class="ml-auto">
    <div class="inline-grid *:[grid-area:1/1]">
      <div
        class="status"
        class:status-success={status === "connected"}
        class:status-warning={status === "connecting"}
        class:status-error={status === "disconnected"}
        class:animate-ping={status === "connected" || status === "connecting"}
      ></div>
      <div
        class="status"
        class:status-success={status === "connected"}
        class:status-warning={status === "connecting"}
        hidden={status === "disconnected"}
      ></div>
    </div>
  </div>
  <label class="input mx-2">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:link"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder="WebSocket URL"
      value={settings.url}
      on:input={(e) => updateSettings("url", e.currentTarget.value)}
    />
  </label>
  <label class="input mx-2">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:key"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder="Authorization Key"
      value={settings.token}
      on:input={(e) => updateSettings("token", e.currentTarget.value)}
    />
    <span class="badge badge-neutral badge-xs">Optional</span>
  </label>
  <button
    class="btn btn-info mx-2"
    on:click={handleConnect}
    disabled={status !== "disconnected"}>接続</button
  >
  <button
    class="btn btn-error mx-2"
    on:click={handleDisconnect}
    disabled={status === "disconnected"}>切断</button
  >
</div>
