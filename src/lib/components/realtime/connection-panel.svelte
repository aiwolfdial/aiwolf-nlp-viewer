<script lang="ts">
  import { realtimeSocketState } from "$lib/utils/realtime-socket";
  import { onDestroy } from "svelte";

  let url = "";
  let status = "disconnected";
  let autoReconnect = true;

  const unsubscribe = realtimeSocketState.subscribe((state) => {
    status = state.status;
    url = state.url;
    autoReconnect = state.autoReconnect;
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

  function toggleAutoReconnect() {
    realtimeSocketState.setAutoReconnect(!autoReconnect);
  }
</script>

<div class="connection-controls">
  <div class="connection-form">
    <input
      type="text"
      bind:value={url}
      placeholder="WebSocket URL (e.g. ws://localhost:8080/realtime)"
      class="url-input"
    />

    <div class="button-group">
      <button
        class="connect-btn"
        class:active={status === "connected"}
        on:click={handleConnect}
        disabled={status === "connecting" || status === "connected"}
      >
        接続
      </button>

      <button
        class="disconnect-btn"
        on:click={handleDisconnect}
        disabled={status === "disconnected"}
      >
        切断
      </button>
    </div>

    <div class="auto-reconnect">
      <label>
        <input
          type="checkbox"
          bind:checked={autoReconnect}
          on:change={toggleAutoReconnect}
        />
        自動再接続
      </label>
    </div>
  </div>

  <div class="status-indicator">
    接続状態:
    <span class="status {status}">
      {status === "connected"
        ? "接続済み"
        : status === "connecting"
          ? "接続中..."
          : "未接続"}
    </span>
  </div>
</div>

<style>
  .connection-controls {
    background-color: #f5f5f5;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .connection-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-bottom: 8px;
  }

  .url-input {
    flex: 1;
    min-width: 250px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .button-group {
    display: flex;
    gap: 8px;
  }

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .connect-btn {
    background-color: #4caf50;
    color: white;
  }

  .connect-btn.active {
    background-color: #388e3c;
  }

  .disconnect-btn {
    background-color: #f44336;
    color: white;
  }

  .status-indicator {
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .status {
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }

  .status.connected {
    background-color: #c8e6c9;
    color: #2e7d32;
  }

  .status.connecting {
    background-color: #ffecb3;
    color: #f57f17;
  }

  .status.disconnected {
    background-color: #ffcdd2;
    color: #c62828;
  }

  .auto-reconnect {
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .auto-reconnect input {
    margin-right: 6px;
  }
</style>
