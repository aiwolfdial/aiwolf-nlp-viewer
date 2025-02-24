<script lang="ts">
  import { goto } from "$app/navigation";
  import "../app.css";
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="container">
        <h1 class="text-5xl font-bold">aiwolf-nlp-viewer</h1>
        <div class="flex flex-row gap-4 py-4">
          <button class="btn btn-primary" on:click={() => goto("/realtime")}
            >リアルタイムログ</button
          >
          <button class="btn btn-primary" on:click={() => goto("/archive")}
            >アーカイブログ</button
          >
          <button class="btn btn-primary" on:click={() => goto("/statistics")}
            >統計情報</button
          >
        </div>
      </div>
    </div>
  </div>
</main>
