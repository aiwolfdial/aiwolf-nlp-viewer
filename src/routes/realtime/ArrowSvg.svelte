<script lang="ts">
  import { calculateAngle, createArrowPath } from "$lib/utils/arrow";

  /**
   * SVGベースの矢印コンポーネント
   * Canvas実装より以下のメリットがあります：
   * - DOM操作が可能
   * - CSSアニメーションが簡単
   * - レスポンシブ対応が容易
   * - アクセシビリティが向上
   */

  let {
    x1,
    y1,
    x2,
    y2,
    colorElement,
    isCenter = false,
    opacity = 1,
  }: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    colorElement: HTMLElement | null | undefined;
    isCenter?: boolean;
    opacity?: number;
  } = $props();

  // 矢印のパスと角度を計算
  let path = $derived(createArrowPath(0, 0, x2 - x1, y2 - y1, isCenter));
  let angle = $derived(calculateAngle(x1, y1, x2, y2));

  // 色を動的に取得（テーマ変更に対応）
  let color = $derived(
    colorElement
      ? getComputedStyle(colorElement).getPropertyValue("background-color")
      : "currentColor"
  );
</script>

<g
  transform="translate({x1}, {y1}) rotate({angle})"
  class="arrow"
  style:opacity
>
  <path d={path} fill={color} class="arrow-path" />
</g>

<style>
  .arrow-path {
    transition: opacity 0.3s ease;
  }

  .arrow {
    pointer-events: none;
  }
</style>
