<script lang="ts">
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
            <a class="btn btn-primary" href="./realtime">リアルタイムログ</a>
            <a class="btn btn-primary" href="./archive">アーカイブログ</a>
          </div>
        </div>
        <div class="p-2">
          <h2 class="text-xl font-bold">ソースコード</h2>
          <div class="flex flex-row justify-center gap-4 p-2">
            <a
              class="btn btn-primary"
              href="https://github.com/kano-lab/aiwolf-nlp-server">対戦サーバ</a
            >
            <a
              class="btn btn-primary"
              href="https://github.com/kano-lab/aiwolf-nlp-agent"
              >エージェント</a
            >
          </div>
        </div>
        <div class="p-2">
          <h2 class="text-xl font-bold">その他</h2>
          <div class="flex flex-row justify-center gap-4 p-2">
            <a class="btn btn-primary" href="./token">トークン生成</a>
            <a class="btn btn-primary" href="./statistics">統計情報</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
