<script lang="ts">
  import { getColorFromName } from "$lib/utils/archive";
  let {
    highlight = false,
    text = "",
    key = undefined,
  }: { highlight?: boolean; text: string; key?: string | undefined } = $props();
</script>

<strong
  style={highlight
    ? `background: linear-gradient(transparent 60%, ${getColorFromName(key ?? text)} 60%)`
    : ""}>{text}</strong
>
