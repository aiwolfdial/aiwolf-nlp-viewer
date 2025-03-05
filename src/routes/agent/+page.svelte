<script lang="ts">
  import { browser } from "$app/environment";
  import { agentSettings } from "$lib/stores/agent-settings";
  import type { Packet } from "$lib/types/agent";
  import { type AgentSettings } from "$lib/types/agent-settings";
  import { agentSocketState } from "$lib/utils/agent-socket";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import "../../app.css";
  import Navbar from "./Navbar.svelte";

  const entries = writable<Packet[]>([]);
  const status = writable("");

  let settings = $state<AgentSettings>();

  onMount(() => {
    const unsubscribeEntries = agentSocketState.subscribe((value) => {
      entries.set(value.entries);
    });

    const unsubscribeStatus = agentSocketState.subscribe((value) => {
      status.set(value.status);
    });

    const unsubscribeSettings = agentSettings.subscribe((value) => {
      settings = value;
    });

    onDestroy(() => {
      unsubscribeEntries();
      unsubscribeStatus();
      unsubscribeSettings();
    });

    if (browser) {
      window.addEventListener("beforeunload", (e) => {
        if ($status === "connecting") {
          e.preventDefault();
        }
      });
    }
  });
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main class="h-screen">
  <Navbar />
  <pre>{JSON.stringify($entries, null, 2)}</pre>
</main>
