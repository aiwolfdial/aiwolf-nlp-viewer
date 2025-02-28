<script lang="ts">
  import { ReplaceWords } from "$lib/constants/translate";
  import AgentName from "./agent-name.svelte";

  let { text = "" } = $props();

  function formatTalkText(text: string): {
    parts: Array<{
      text: string;
      agentIdx: number | null;
      isAgentTag: boolean;
    }>;
  } {
    const regex = /Agent\[(\d+)\]/g;
    const parts: Array<{
      text: string;
      agentIdx: number | null;
      isAgentTag: boolean;
    }> = [];

    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, match.index),
          agentIdx: null,
          isAgentTag: false,
        });
      }

      parts.push({
        text: match[0],
        agentIdx: parseInt(match[1]),
        isAgentTag: true,
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      var replaceText = text.slice(lastIndex);
      Object.entries(ReplaceWords).forEach(([key, value]: [string, string]) => {
        replaceText = replaceText.replaceAll(key, value);
      });
      parts.push({
        text: replaceText,
        agentIdx: null,
        isAgentTag: false,
      });
    }

    return { parts };
  }
</script>

{#each formatTalkText(text).parts as part}
  {#if part.isAgentTag}
    <AgentName agentIdx={part.agentIdx?.toString() ?? ""} highlight />
  {:else}
    {part.text}
  {/if}
{/each}
