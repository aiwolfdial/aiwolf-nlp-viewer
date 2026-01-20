<script lang="ts">
  import {
    hierarchicalDisplaySettings,
    type HierarchicalDisplaySettings,
  } from "$lib/stores/hierarchicalDisplaySettings";
  import { _ } from "svelte-i18n";

  let settings = $state($hierarchicalDisplaySettings);
  let expandedSections = $state<Record<string, boolean>>({});

  $effect(() => {
    hierarchicalDisplaySettings.set(settings);
  });

  function toggleSection(key: keyof HierarchicalDisplaySettings) {
    settings = {
      ...settings,
      [key]: {
        ...settings[key],
        visible: !settings[key].visible,
      },
    };
  }

  function toggleField(
    section: keyof HierarchicalDisplaySettings,
    field: string,
  ) {
    if (settings[section].fields) {
      settings = {
        ...settings,
        [section]: {
          ...settings[section],
          fields: {
            ...settings[section].fields!,
            [field]: !settings[section].fields![field],
          },
        },
      };
    }
  }

  function toggleExpanded(section: string) {
    expandedSections[section] = !expandedSections[section];
  }

  function selectAll() {
    const newSettings = { ...settings };
    for (const key in newSettings) {
      const section = newSettings[key as keyof HierarchicalDisplaySettings];
      section.visible = true;
      if (section.fields) {
        for (const field in section.fields) {
          section.fields[field] = true;
        }
      }
    }
    settings = newSettings;
  }

  function deselectAll() {
    const newSettings = { ...settings };
    for (const key in newSettings) {
      const section = newSettings[key as keyof HierarchicalDisplaySettings];
      section.visible = false;
      if (section.fields) {
        for (const field in section.fields) {
          section.fields[field] = false;
        }
      }
    }
    settings = newSettings;
  }

  function resetToDefault() {
    hierarchicalDisplaySettings.reset();
    settings = $hierarchicalDisplaySettings;
  }

  function selectAllInSection(section: keyof HierarchicalDisplaySettings) {
    if (settings[section].fields) {
      settings = {
        ...settings,
        [section]: {
          ...settings[section],
          visible: true,
          fields: Object.keys(settings[section].fields!).reduce(
            (acc, field) => {
              acc[field] = true;
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        },
      };
    }
  }

  function deselectAllInSection(section: keyof HierarchicalDisplaySettings) {
    if (settings[section].fields) {
      settings = {
        ...settings,
        [section]: {
          ...settings[section],
          visible: false,
          fields: Object.keys(settings[section].fields!).reduce(
            (acc, field) => {
              acc[field] = false;
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        },
      };
    }
  }

  const sections = [
    { key: "agents", icon: "mdi:account-group" },
    { key: "beforeWhisper", icon: "mdi:conversation-outline" },
    { key: "talks", icon: "mdi:conversation" },
    { key: "votes", icon: "mdi:vote" },
    { key: "execution", icon: "mdi:exit-run" },
    { key: "divine", icon: "mdi:eye" },
    { key: "afterWhisper", icon: "mdi:conversation-outline" },
    { key: "guard", icon: "mdi:shield-account" },
    { key: "attackVotes", icon: "mdi:vote" },
    { key: "attack", icon: "mdi:sword" },
    { key: "result", icon: "mdi:trophy" },
  ] as const;
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

  <div class="space-y-2 max-h-96 overflow-y-auto pr-2">
    {#each sections as section}
      {@const sectionSettings = settings[section.key]}
      {@const isExpanded = expandedSections[section.key]}
      <div class="card bg-base-200">
        <div class="card-body p-3">
          <!-- Section header -->
          <div class="flex items-center gap-2">
            <label class="label cursor-pointer flex-1 p-0">
              <span class="label-text flex items-center gap-2">
                <iconify-icon icon={section.icon} inline></iconify-icon>
                {#if section.key === "beforeWhisper"}
                  {$_("archive.whispers")} ({$_("displaySettings.before")})
                {:else if section.key === "afterWhisper"}
                  {$_("archive.whispers")} ({$_("displaySettings.after")})
                {:else if section.key === "talks"}
                  {$_("archive.talk")}
                {:else if section.key === "votes"}
                  {$_("archive.voting")}
                {:else if section.key === "execution"}
                  {$_("archive.execute")}
                {:else if section.key === "divine"}
                  {$_("archive.divination")}
                {:else if section.key === "guard"}
                  {$_("archive.guard")}
                {:else if section.key === "attackVotes"}
                  {$_("archive.attackVotes")}
                {:else if section.key === "attack"}
                  {$_("archive.attack")}
                {:else if section.key === "result"}
                  {$_("archive.result")}
                {:else if section.key === "agents"}
                  {$_("archive.agents")}
                {:else}
                  {$_(`archive.${section.key}`)}
                {/if}
              </span>
              <input
                type="checkbox"
                checked={sectionSettings.visible}
                onchange={() => toggleSection(section.key)}
                class="checkbox checkbox-primary"
              />
            </label>
            {#if sectionSettings.fields}
              <button
                class="btn btn-ghost btn-xs"
                onclick={() => toggleExpanded(section.key)}
              >
                <iconify-icon
                  icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
                  inline
                ></iconify-icon>
              </button>
            {/if}
          </div>

          <!-- Field settings (collapsible) -->
          {#if isExpanded && sectionSettings.fields}
            <div class="ml-4 mt-2 space-y-1 border-l-2 border-base-300 pl-4">
              <div class="flex gap-1 mb-1">
                <button
                  class="btn btn-xs"
                  onclick={() => selectAllInSection(section.key)}
                >
                  {$_("displaySettings.allFields")}
                </button>
                <button
                  class="btn btn-xs"
                  onclick={() => deselectAllInSection(section.key)}
                >
                  {$_("displaySettings.noFields")}
                </button>
              </div>
              {#each Object.entries(sectionSettings.fields) as [field, value]}
                <label class="label cursor-pointer py-0">
                  <span class="label-text text-sm">
                    {$_(`displaySettings.fields.${section.key}.${field}`)}
                  </span>
                  <input
                    type="checkbox"
                    checked={value}
                    disabled={!sectionSettings.visible}
                    onchange={() => toggleField(section.key, field)}
                    class="checkbox checkbox-sm"
                  />
                </label>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .card {
    border: 1px solid var(--fallback-bc, oklch(var(--bc) / 0.2));
  }
</style>
