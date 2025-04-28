<script lang="ts">
  import AgentName from "./AgentName.svelte";
  let { text = "", names = [] as string[] } = $props();

  function formatTalkText(text: string): {
    parts: Array<{
      text: string;
      key: string | undefined;
      tag: boolean;
    }>;
  } {
    const parts: Array<{
      text: string;
      key: string | undefined;
      tag: boolean;
    }> = [];

    let currentIndex = 0;
    while (currentIndex < text.length) {
      let found = false;
      let nearestIndex = text.length;
      let nearestMatch = "";
      let nearestKey = "";

      for (const name of names) {
        const atIndex = text.indexOf("@" + name, currentIndex);
        if (atIndex !== -1 && atIndex < nearestIndex) {
          nearestIndex = atIndex;
          nearestMatch = "@" + name;
          nearestKey = name;
          found = true;
        }

        const arrowIndex = text.indexOf(">>" + name, currentIndex);
        if (arrowIndex !== -1 && arrowIndex < nearestIndex) {
          nearestIndex = arrowIndex;
          nearestMatch = ">>" + name;
          nearestKey = name;
          found = true;
        }

        const nameIndex = text.indexOf(name, currentIndex);
        if (nameIndex !== -1 && nameIndex < nearestIndex) {
          if (
            nameIndex === 0 ||
            (text[nameIndex - 1] !== "@" && text[nameIndex - 1] !== ">")
          ) {
            nearestIndex = nameIndex;
            nearestMatch = name;
            nearestKey = name;
            found = true;
          }
        }
      }

      if (found) {
        if (nearestIndex > currentIndex) {
          parts.push({
            text: text.slice(currentIndex, nearestIndex),
            key: undefined,
            tag: false,
          });
        }
        parts.push({
          text: nearestMatch,
          key: nearestKey,
          tag: true,
        });
        currentIndex = nearestIndex + nearestMatch.length;
      } else {
        parts.push({
          text: text.slice(currentIndex),
          key: undefined,
          tag: false,
        });
        break;
      }
    }

    return { parts };
  }
</script>

{#each formatTalkText(text).parts as part}
  {#if part.tag}
    <AgentName text={part.text ?? ""} key={part.key} highlight />
  {:else}
    {part.text}
  {/if}
{/each}
