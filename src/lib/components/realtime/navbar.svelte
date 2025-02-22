<script lang="ts">
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../../app.css";

  let url = "ws://localhost:8080/realtime";
  let token = "";
  let status = "disconnected";

  const unsubscribe = realtimeSocketState.subscribe((state) => {
    status = state.status;
  });

  onDestroy(unsubscribe);

  function handleConnect() {
    realtimeSocketState.connect(url, token);
  }

  function handleDisconnect() {
    realtimeSocketState.disconnect();
  }
</script>

<div class="navbar bg-base-100 flex justify-start">
  <h1 class="text-3xl font-bold truncate ml-4">aiwolf-nlp-viewer</h1>
  <div class="ml-auto">
    {#if status === "connected"}
      <div class="inline-grid *:[grid-area:1/1]">
        <div class="status status-success animate-ping"></div>
        <div class="status status-success"></div>
      </div>
    {:else if status === "connecting"}
      <div class="inline-grid *:[grid-area:1/1]">
        <div class="status status-warning animate-ping"></div>
        <div class="status status-warning"></div>
      </div>
    {:else}
      <div class="inline-grid *:[grid-area:1/1]">
        <div class="status status-error"></div>
      </div>
    {/if}
  </div>
  <label class="input ml-4 mr-2">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:link"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder="WebSocket URL"
      bind:value={url}
    />
  </label>
  <label class="input mx-2">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:key"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder="Authorization Key"
      bind:value={token}
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
  <label class="flex items-center cursor-pointer gap-2">
    <iconify-icon inline icon="mdi:white-balance-sunny"></iconify-icon>
    <input type="checkbox" value="dark" class="toggle theme-controller" />
    <iconify-icon inline icon="mdi:moon-and-stars"></iconify-icon>
  </label>
</div>
