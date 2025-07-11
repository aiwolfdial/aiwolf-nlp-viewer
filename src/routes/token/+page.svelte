<script lang="ts">
  import { SignJWT } from "jose";
  import { _ } from 'svelte-i18n';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  import "../../app.css";

  let state = $state({
    secret: "",
    role: "PLAYER" as "PLAYER" | "RECEIVER",
    team: "",
    token: "",
  });

  function generateSecret() {
    let randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    state.secret = btoa(String.fromCharCode(...randomBytes));
  }

  $effect(() => {
    generateToken(state.secret, state.role, state.team);
  });

  async function generateToken(
    secret: string,
    role: "PLAYER" | "RECEIVER",
    team: string
  ) {
    if (!secret || !role) {
      state.token = "";
      return;
    }
    if (role === "PLAYER" && !team) {
      state.token = "";
      return;
    }
    const payload =
      role === "PLAYER" ? { role: "PLAYER", team: team } : { role: "RECEIVER" };
    try {
      const secretKey = new TextEncoder().encode(secret);
      const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .sign(secretKey);
      state.token = jwt;
    } catch (error) {
      state.token = $_('token.errorOccurred');
    }
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content">
      <div class="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div>
        <div class="w-md card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="text-xl font-bold text-center">{$_('token.title')}</h2>
            <p class="text-sm">
              {$_('token.description')}
            </p>
            <p class="text-sm">
              {$_('token.agentDescription')}
            </p>
            <button class="btn mt-2" onclick={generateSecret}>
              {$_('token.generateSecret')}
            </button>
            <label class="input w-full mt-2 block">
              <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:key"
              ></iconify-icon>
              <input
                type="text"
                class="grow"
                placeholder={$_('token.secretKey')}
                bind:value={state.secret}
              />
            </label>
            <select class="select w-full mt-2" bind:value={state.role}>
              <option value="PLAYER">{$_('token.agent')}</option>
              <option value="RECEIVER">{$_('token.realtimeLog')}</option>
            </select>
            <label class="input w-full mt-2 block">
              <iconify-icon
                class="h-[1em] opacity-50"
                inline
                icon="mdi:form-textbox"
              ></iconify-icon>
              <input
                type="text"
                class="grow"
                placeholder={$_('token.teamName')}
                bind:value={state.team}
                disabled={state.role !== "PLAYER"}
              />
            </label>
          </div>
        </div>
        {#if state.token}
          <div class="w-md card bg-base-100 shadow-xl mt-4">
            <div class="card-body">
              <pre class="whitespace-pre-wrap break-all">{state.token}</pre>
              <button
                class="btn"
                onclick={() => navigator.clipboard.writeText(state.token)}
              >
                {$_('token.copyToken')}
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
