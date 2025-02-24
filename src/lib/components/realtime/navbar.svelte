<script lang="ts">
  import { browser } from "$app/environment";
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";
  import "../../../app.css";

  let socketUrl = "ws://localhost:8080/realtime";
  let socketToken = "";
  let socketStatus: string;

  $: if (browser) {
    localStorage.setItem("realtime-url", socketUrl);
    localStorage.setItem("realtime-token", socketToken);
  }

  if (browser) {
    socketUrl = localStorage.getItem("realtime-url") || socketUrl;
    socketToken = localStorage.getItem("realtime-token") || socketToken;
  }

  const unsubscribe = realtimeSocketState.subscribe((state) => {
    socketStatus = state.status;
  });

  onDestroy(unsubscribe);

  function handleConnect() {
    realtimeSocketState.connect(socketUrl, socketToken);
  }

  function handleDisconnect() {
    realtimeSocketState.disconnect();
  }
</script>

<div class="navbar bg-base-100 flex justify-start">
  <h1 class="text-3xl font-bold truncate ml-4">aiwolf-nlp-viewer</h1>
  <div class="ml-auto">
    {#if socketStatus === "connected"}
      <div class="inline-grid *:[grid-area:1/1]">
        <div class="status status-success animate-ping"></div>
        <div class="status status-success"></div>
      </div>
    {:else if socketStatus === "connecting"}
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
      bind:value={socketUrl}
    />
  </label>
  <label class="input mx-2">
    <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:key"
    ></iconify-icon>
    <input
      type="text"
      class="grow"
      placeholder="Authorization Key"
      bind:value={socketToken}
    />
    <span class="badge badge-neutral badge-xs">Optional</span>
  </label>
  <button
    class="btn btn-info mx-2"
    on:click={handleConnect}
    disabled={socketStatus !== "disconnected"}>接続</button
  >
  <button
    class="btn btn-error mx-2"
    on:click={handleDisconnect}
    disabled={socketStatus === "disconnected"}>切断</button
  >
  <label class="flex items-center cursor-pointer gap-2">
    <iconify-icon inline icon="mdi:white-balance-sunny"></iconify-icon>
    <input type="checkbox" value="dark" class="toggle theme-controller" />
    <iconify-icon inline icon="mdi:moon-and-stars"></iconify-icon>
  </label>
</div>
