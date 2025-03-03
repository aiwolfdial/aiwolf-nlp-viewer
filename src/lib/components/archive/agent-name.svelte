<script lang="ts">
  import { IdxToName } from "$lib/constants/translate";

  let { agentIdx = "", highlight = false } = $props();
</script>

<strong class={highlight ? "agent" + agentIdx.padStart(2, "0") : ""}
  >{IdxToName(agentIdx)}</strong
>

<style>
  :root {
    --highlight-color-agent01: #942d40bb;
    --highlight-color-agent02: #ec754fbb;
    --highlight-color-agent03: #bcdaf2bb;
    --highlight-color-agent04: #062d68bb;
    --highlight-color-agent05: #ebdf83bb;
  }

  strong.agent01 {
    background: linear-gradient(
      transparent 60%,
      var(--highlight-color-agent01) 60%
    );
  }

  strong.agent02 {
    background: linear-gradient(
      transparent 60%,
      var(--highlight-color-agent02) 60%
    );
  }

  strong.agent03 {
    background: linear-gradient(
      transparent 60%,
      var(--highlight-color-agent03) 60%
    );
  }

  strong.agent04 {
    background: linear-gradient(
      transparent 60%,
      var(--highlight-color-agent04) 60%
    );
  }

  strong.agent05 {
    background: linear-gradient(
      transparent 60%,
      var(--highlight-color-agent05) 60%
    );
  }
</style>
