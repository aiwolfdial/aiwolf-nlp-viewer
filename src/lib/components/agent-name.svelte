<script lang="ts">
  export let agentIdx: string;
  export let highlight = false;

  const padIdx = agentIdx.padStart(2, "0");
</script>

<strong class={highlight ? "agent" + padIdx : ""}>Agent[{padIdx}]</strong>
