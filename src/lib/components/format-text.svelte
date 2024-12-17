<script lang="ts">
  import AgentName from "./agent-name.svelte";

  export let text: string;

  export function formatTalkText(text: string): {
    parts: Array<{
      text: string;
      agentId: number | null;
      isAgentTag: boolean;
    }>;
  } {
    const regex = /Agent\[(\d+)\]/g;
    const parts: Array<{
      text: string;
      agentId: number | null;
      isAgentTag: boolean;
    }> = [];

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, match.index),
          agentId: null,
          isAgentTag: false,
        });
      }

      parts.push({
        text: match[0],
        agentId: parseInt(match[1]),
        isAgentTag: true,
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        agentId: null,
        isAgentTag: false,
      });
    }

    return { parts };
  }
</script>

{#each formatTalkText(text).parts as part}
  {#if part.isAgentTag}
    <AgentName agentIdx={part.agentId?.toString() ?? ""} highlight />
  {:else}
    {part.text}
  {/if}
{/each}
