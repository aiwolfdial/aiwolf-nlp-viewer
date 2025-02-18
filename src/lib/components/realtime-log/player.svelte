<script lang="ts">
  export let agentIdx: string;
  export let imageURL: string;
  export let isAlive: boolean;
</script>

<g>
  <text
    x="50"
    y="0"
    text-anchor="middle"
    dominant-baseline="middle"
    font-size="12"
  >
    {agentIdx}
  </text>
  <image
    x="0"
    y="10"
    width="100"
    height="100"
    href={imageURL}
    opacity={isAlive ? 1 : 0.5}
  />
</g>
