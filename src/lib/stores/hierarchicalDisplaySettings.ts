import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface FieldSettings {
  visible: boolean;
  fields?: Record<string, boolean>;
}

export interface HierarchicalDisplaySettings {
  agents: FieldSettings;
  beforeWhisper: FieldSettings;
  talks: FieldSettings;
  votes: FieldSettings;
  execution: FieldSettings;
  divine: FieldSettings;
  afterWhisper: FieldSettings;
  guard: FieldSettings;
  attackVotes: FieldSettings;
  attack: FieldSettings;
  result: FieldSettings;
}

const defaultSettings: HierarchicalDisplaySettings = {
  agents: {
    visible: true,
    fields: {
      gameName: true,
      originalName: true,
      role: true,
      status: true
    }
  },
  beforeWhisper: {
    visible: true,
    fields: {
      agentName: true,
      originalName: false,
      text: true,
      talkIdx: false,
      turnIdx: false
    }
  },
  talks: {
    visible: true,
    fields: {
      agentName: true,
      originalName: false,
      text: true,
      talkIdx: false,
      turnIdx: false
    }
  },
  votes: {
    visible: true,
    fields: {
      voterName: true,
      targetName: true
    }
  },
  execution: {
    visible: true,
    fields: {
      agentName: true,
      role: true
    }
  },
  divine: {
    visible: true,
    fields: {
      seerName: true,
      targetName: true,
      result: true
    }
  },
  afterWhisper: {
    visible: true,
    fields: {
      agentName: true,
      originalName: false,
      text: true,
      talkIdx: false,
      turnIdx: false
    }
  },
  guard: {
    visible: true,
    fields: {
      guardName: true,
      targetName: true,
      result: true
    }
  },
  attackVotes: {
    visible: true,
    fields: {
      voterName: true,
      targetName: true
    }
  },
  attack: {
    visible: true,
    fields: {
      targetName: true,
      result: true
    }
  },
  result: {
    visible: true,
    fields: {
      winSide: true,
      villagers: true,
      werewolves: true
    }
  }
};

function createHierarchicalDisplaySettingsStore() {
  const STORAGE_KEY = 'aiwolf-hierarchical-display-settings';

  let initialSettings = defaultSettings;

  if (browser) {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        // Deep merge with defaults to ensure all fields exist
        initialSettings = deepMerge(defaultSettings, parsed);
      } catch (e) {
        console.error('Failed to parse stored settings', e);
      }
    }
  }

  const { subscribe, set, update } = writable<HierarchicalDisplaySettings>(initialSettings);

  return {
    subscribe,
    set: (settings: HierarchicalDisplaySettings) => {
      if (browser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      }
      set(settings);
    },
    update: (fn: (settings: HierarchicalDisplaySettings) => HierarchicalDisplaySettings) => {
      update((settings) => {
        const newSettings = fn(settings);
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
        }
        return newSettings;
      });
    },
    reset: () => {
      if (browser) {
        localStorage.removeItem(STORAGE_KEY);
      }
      set(defaultSettings);
    },
    toggleSection: (section: keyof HierarchicalDisplaySettings) => {
      update((settings) => {
        const newSettings = { ...settings };
        newSettings[section] = {
          ...newSettings[section],
          visible: !newSettings[section].visible
        };
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
        }
        return newSettings;
      });
    },
    toggleField: (section: keyof HierarchicalDisplaySettings, field: string) => {
      update((settings) => {
        const newSettings = { ...settings };
        if (newSettings[section].fields) {
          newSettings[section] = {
            ...newSettings[section],
            fields: {
              ...newSettings[section].fields,
              [field]: !newSettings[section].fields![field]
            }
          };
        }
        if (browser) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
        }
        return newSettings;
      });
    }
  };
}

function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

export const hierarchicalDisplaySettings = createHierarchicalDisplaySettingsStore();