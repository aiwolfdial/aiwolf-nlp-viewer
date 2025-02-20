<script lang="ts">
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../../app.css";

  let url = "";
  let status = "disconnected";

  const unsubscribe = realtimeSocketState.subscribe((state) => {
    status = state.status;
    url = state.url;
  });

  onDestroy(unsubscribe);

  function handleConnect() {
    if (url) {
      realtimeSocketState.connect(url);
    }
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
    <input type="text" class="grow" placeholder="Authorization Key" />
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
