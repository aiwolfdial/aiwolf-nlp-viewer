<script lang="ts">
  import { SignJWT } from "jose";
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
      state.token = "エラーが発生しました";
    }
  }
</script>

<svelte:head>
  <title>aiwolf-nlp-viewer</title>
</svelte:head>

<main>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content">
      <div>
        <div class="w-md card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="text-xl font-bold text-center">トークン生成</h2>
            <p class="text-sm">
              対戦サーバにおける接続認証を有効にした場合に必要となるトークンを生成します。秘密鍵はブラウザ上で生成され、サーバには一切送信されません。
            </p>
            <p class="text-sm">
              エージェントとして接続する場合は、チーム名を入力してください。
            </p>
            <button class="btn mt-2" onclick={generateSecret}>
              秘密鍵を生成する
            </button>
            <label class="input w-full mt-2 block">
              <iconify-icon class="h-[1em] opacity-50" inline icon="mdi:key"
              ></iconify-icon>
              <input
                type="text"
                class="grow"
                placeholder="秘密鍵"
                bind:value={state.secret}
              />
            </label>
            <select class="select w-full mt-2" bind:value={state.role}>
              <option value="PLAYER">エージェント</option>
              <option value="RECEIVER">リアルタイムログ</option>
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
                placeholder="チーム名"
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
                トークンをコピーする
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</main>
