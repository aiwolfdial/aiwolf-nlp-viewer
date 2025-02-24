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
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">aiwolf-nlp-viewer</h1>
        <div class="py-6">
          <button
            class="btn btn-primary mx-2"
            on:click={() => goto("/realtime")}>リアルタイムログ</button
          >
          <button class="btn btn-primary mx-2" on:click={() => goto("/archive")}
            >アーカイブログ</button
          >
        </div>
      </div>
    </div>
  </div>
</main>
