import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface DisplaySettings {
  agents: boolean;
  beforeWhisper: boolean;
  talks: boolean;
  votes: boolean;
  execution: boolean;
  divine: boolean;
  afterWhisper: boolean;
  guard: boolean;
  attackVotes: boolean;
  attack: boolean;
  result: boolean;
}

const defaultSettings: DisplaySettings = {
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
  result: true
};

function createDisplaySettingsStore() {
  const STORAGE_KEY = 'aiwolf-display-settings';

  let initialSettings = defaultSettings;

  if (browser) {
    const storedSettings = localStorage.getItem(STORAGE_KEY);
    if (storedSettings) {
      try {
        initialSettings = { ...defaultSettings, ...JSON.parse(storedSettings) };
      } catch (e) {
        console.error('Failed to parse stored settings', e);
      }
    }
  }

  const { subscribe, set, update } = writable<DisplaySettings>(initialSettings);

  return {
    subscribe,
    set: (settings: DisplaySettings) => {
      if (browser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      }
      set(settings);
    },
    update: (fn: (settings: DisplaySettings) => DisplaySettings) => {
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
    }
  };
}

export const displaySettings = createDisplaySettingsStore();