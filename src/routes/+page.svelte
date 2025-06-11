<script lang="ts">
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
        <h1 class="text-5xl font-bold py-8">aiwolf-nlp-viewer</h1>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="card bg-base-100 image-full w-80 shadow-sm">
            <figure>
              <img src="{base}/images/thumbs/realtime.png" alt="realtime" />
            </figure>
            <a href="./realtime" class="card-body">
              <h2 class="card-title">リアルタイムログ</h2>
              <p class="text-left">
                リアルタイムでゲームログを表示します
                JSONL形式のファイルに対応しています
              </p>
            </a>
          </div>
          <div class="card bg-base-100 image-full w-80 shadow-sm">
            <figure>
              <img src="{base}/images/thumbs/archive.png" alt="archive" />
            </figure>
            <a href="./archive" class="card-body">
              <h2 class="card-title">アーカイブログ</h2>
              <p class="text-left">
                アーカイブされたゲームログを表示します
                LOG形式のファイルに対応しています
              </p>
            </a>
          </div>
          <div class="card bg-base-100 image-full w-80 shadow-sm">
            <figure>
              <img src="{base}/images/thumbs/agent.png" alt="agent" />
            </figure>
            <a href="./agent" class="card-body">
              <h2 class="card-title">エージェント</h2>
              <p class="text-left">
                ゲームサーバに接続して、エージェントとして参加します
              </p>
            </a>
          </div>
        </div>
        <div class="flex flex-wrap justify-center gap-4 m-8">
          <a class="btn btn-primary" href="./token">トークン生成</a>
          <a class="btn btn-primary" href="./statistics">統計情報</a>
        </div>
        <div class="divider"></div>
        <h2 class="text-xl font-bold m-2">ソースコード</h2>
        <div class="flex flex-wrap justify-center gap-4 m-4">
          <a class="btn" href="https://github.com/aiwolfdial/aiwolf-nlp-server"
            >ゲームサーバ</a
          >
          <a class="btn" href="https://github.com/aiwolfdial/aiwolf-nlp-agent"
            >サンプルエージェント</a
          >
          <a
            class="btn"
            href="https://github.com/aiwolfdial/aiwolf-nlp-agent-llm"
            >サンプルエージェント (LLM)</a
          >
          <a class="btn" href="https://github.com/aiwolfdial/aiwolf-nlp-viewer"
            >ビューア</a
          >
        </div>
      </div>
    </div>
  </div>
</main>
