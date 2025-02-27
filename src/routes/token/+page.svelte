<script lang="ts">
  import { Buffer } from "buffer";
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
    state.secret = Buffer.from(randomBytes).toString("base64");
  }

  //   $effect(() => {
  //     try {
  //       if (state.secret && state.role) {
  //         const payload =
  //           state.role === "PLAYER"
  //             ? { role: "PLAYER", team: state.team }
  //             : { role: "RECEIVER" };
  //         state.token = jwt.sign(payload, state.secret, { algorithm: "HS256" });
  //       }
  //     } catch (e) {
  //       state.token = "Error generating token";
  //     }
  //   });
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h2 class="text-xl font-bold p-2">トークン生成</h2>

        <button class="btn btn-primary mb-4" on:click={generateSecret}>
          Generate Secret Key
        </button>

        <label class="input mb-4 block">
          <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:key"
          ></iconify-icon>
          <input
            type="text"
            class="grow"
            placeholder="Secret Key"
            bind:value={state.secret}
          />
        </label>

        <select class="select w-full mb-4" bind:value={state.role}>
          <option value="PLAYER">Player</option>
          <option value="RECEIVER">Receiver</option>
        </select>

        {#if state.role === "PLAYER"}
          <input
            type="text"
            class="input w-full mb-4"
            placeholder="Team"
            bind:value={state.team}
          />
        {/if}

        {#if state.token}
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">Generated Token</h3>
              <p class="break-all">{state.token}</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
