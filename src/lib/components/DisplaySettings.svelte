<script lang="ts">
  import { displaySettings } from "$lib/stores/displaySettings";
  import { _ } from "svelte-i18n";

  let settings = $state($displaySettings);

  $effect(() => {
    displaySettings.set(settings);
  });

  function handleToggle(key: keyof typeof settings) {
    settings = { ...settings, [key]: !settings[key] };
  }

  function selectAll() {
    settings = {
      agents: true,
      beforeWhisper: true,
      talks: true,
      votes: true,
      execution: true,
      divine: true,
      afterWhisper: true,
      guard: true,
      attackVotes: true,
      attack: true,
      result: true,
    };
  }

  function deselectAll() {
    settings = {
      agents: false,
      beforeWhisper: false,
      talks: false,
      votes: false,
      execution: false,
      divine: false,
      afterWhisper: false,
      guard: false,
      attackVotes: false,
      attack: false,
      result: false,
    };
  }

  function resetToDefault() {
    displaySettings.reset();
    settings = $displaySettings;
  }
</script>

<div class="space-y-2">
  <div class="flex gap-2 mb-3">
    <button class="btn btn-sm" onclick={selectAll}>
      {$_("displaySettings.selectAll")}
    </button>
    <button class="btn btn-sm" onclick={deselectAll}>
      {$_("displaySettings.deselectAll")}
    </button>
    <button class="btn btn-sm" onclick={resetToDefault}>
      {$_("displaySettings.reset")}
    </button>
  </div>

  <div class="grid grid-cols-1 gap-2">
    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.agents")}</span>
      <input
        type="checkbox"
        checked={settings.agents}
        onchange={() => handleToggle("agents")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text"
        >{$_("archive.whispers")} ({$_("displaySettings.before")})</span
      >
      <input
        type="checkbox"
        checked={settings.beforeWhisper}
        onchange={() => handleToggle("beforeWhisper")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.talk")}</span>
      <input
        type="checkbox"
        checked={settings.talks}
        onchange={() => handleToggle("talks")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.voting")}</span>
      <input
        type="checkbox"
        checked={settings.votes}
        onchange={() => handleToggle("votes")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.execute")}</span>
      <input
        type="checkbox"
        checked={settings.execution}
        onchange={() => handleToggle("execution")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.divination")}</span>
      <input
        type="checkbox"
        checked={settings.divine}
        onchange={() => handleToggle("divine")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text"
        >{$_("archive.whispers")} ({$_("displaySettings.after")})</span
      >
      <input
        type="checkbox"
        checked={settings.afterWhisper}
        onchange={() => handleToggle("afterWhisper")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.guard")}</span>
      <input
        type="checkbox"
        checked={settings.guard}
        onchange={() => handleToggle("guard")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.attackVotes")}</span>
      <input
        type="checkbox"
        checked={settings.attackVotes}
        onchange={() => handleToggle("attackVotes")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.attack")}</span>
      <input
        type="checkbox"
        checked={settings.attack}
        onchange={() => handleToggle("attack")}
        class="checkbox"
      />
    </label>

    <label class="label cursor-pointer">
      <span class="label-text">{$_("archive.result")}</span>
      <input
        type="checkbox"
        checked={settings.result}
        onchange={() => handleToggle("result")}
        class="checkbox"
      />
    </label>
  </div>
</div>
