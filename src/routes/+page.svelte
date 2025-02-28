<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import "../app.css";
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold p-4">aiwolf-nlp-viewer</h1>
        <div class="p-2">
          <h2 class="text-xl font-bold">ログビューア</h2>
          <div class="flex flex-row justify-center gap-4 p-2">
            <button
              class="btn btn-primary"
              onclick={() => goto(base + "/realtime")}>リアルタイムログ</button
            >
            <button
              class="btn btn-primary"
              onclick={() => goto(base + "/archive")}>アーカイブログ</button
            >
          </div>
        </div>
        <div class="p-2">
          <h2 class="text-xl font-bold">ソースコード</h2>
          <div class="flex flex-row justify-center gap-4 p-2">
            <button
              class="btn btn-primary"
              onclick={() =>
                window.open("https://github.com/kano-lab/aiwolf-nlp-server")}
              >対戦サーバ</button
            >
            <button
              class="btn btn-primary"
              onclick={() =>
                window.open("https://github.com/kano-lab/aiwolf-nlp-agent")}
              >エージェント</button
            >
          </div>
        </div>
        <div class="p-2">
          <h2 class="text-xl font-bold">その他</h2>
          <div class="flex flex-row justify-center gap-4 p-2">
            <button
              class="btn btn-primary"
              onclick={() => goto(base + "/token")}>トークン生成</button
            >
            <button
              class="btn btn-primary"
              onclick={() => goto(base + "/statistics")}>統計情報</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
