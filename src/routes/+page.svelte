<script lang="ts">
  import { base } from "$app/paths";
  import LanguageSwitcher from "$lib/components/LanguageSwitcher.svelte";
  import { _ } from "svelte-i18n";
  import "../app.css";
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-5xl">
        <div class="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <h1 class="text-5xl font-bold py-8">{$_("home.title")}</h1>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="card bg-base-100 image-full w-80 shadow-sm">
            <figure>
              <img src="{base}/images/thumbs/realtime.png" alt="realtime" />
            </figure>
            <a href="./realtime" class="card-body">
              <h2 class="card-title">{$_("home.realtimeLog.title")}</h2>
              <p class="text-left">
                {$_("home.realtimeLog.description")}
              </p>
            </a>
          </div>
          <div class="card bg-base-100 image-full w-80 shadow-sm">
            <figure>
              <img src="{base}/images/thumbs/archive.png" alt="archive" />
            </figure>
            <a href="./archive" class="card-body">
              <h2 class="card-title">{$_("home.archiveLog.title")}</h2>
              <p class="text-left">
                {$_("home.archiveLog.description")}
              </p>
            </a>
          </div>
          <div class="card bg-base-100 image-full w-80 shadow-sm">
            <figure>
              <img src="{base}/images/thumbs/agent.png" alt="agent" />
            </figure>
            <a href="./agent" class="card-body">
              <h2 class="card-title">{$_("home.agent.title")}</h2>
              <p class="text-left">
                {$_("home.agent.description")}
              </p>
            </a>
          </div>
        </div>
        <div class="flex flex-wrap justify-center gap-4 m-8">
          <a class="btn btn-primary" href="./token">{$_("navigation.token")}</a>
          <a class="btn btn-primary" href="./statistics"
            >{$_("navigation.statistics")}</a
          >
        </div>
        <div class="divider"></div>
        <h2 class="text-xl font-bold m-2">{$_("home.sourceCode")}</h2>
        <div class="flex flex-wrap justify-center gap-4 m-4">
          <a class="btn" href="https://github.com/aiwolfdial/aiwolf-nlp-server"
            >{$_("home.gameServer")}</a
          >
          <a class="btn" href="https://github.com/aiwolfdial/aiwolf-nlp-agent"
            >{$_("home.sampleAgent")}</a
          >
          <a
            class="btn"
            href="https://github.com/aiwolfdial/aiwolf-nlp-agent-llm"
            >{$_("home.sampleAgentLLM")}</a
          >
          <a class="btn" href="https://github.com/aiwolfdial/aiwolf-nlp-viewer"
            >{$_("home.viewer")}</a
          >
        </div>
      </div>
    </div>
  </div>
</main>
