import { browser } from "$app/environment";
import { Convert, type AgentSettings } from "$lib/types/agent-settings";
import { writable } from "svelte/store";

const STORAGE_KEY = 'agent-settings';

const defaultAgentSettings: AgentSettings = {
    connection: {
        url: "ws://localhost:8080/ws",
        token: ""
    },
    team: "aiwolf-nlp-viewer",
    display: {
        largeScale: false
    }
};

function loadSettings(): AgentSettings {
    if (!browser) return defaultAgentSettings;

    const value = localStorage.getItem(STORAGE_KEY);
    if (value) {
        try {
            return Convert.fromJson(value);
        } catch (e) {
            console.error('Failed to parse agent settings:', e);
        }
    }

    saveSettings(defaultAgentSettings);
    return defaultAgentSettings;
}

function saveSettings(settings: AgentSettings): void {
    if (browser) {
        localStorage.setItem(STORAGE_KEY, Convert.toJson(settings));
    }
}

export const agentSettings = writable<AgentSettings>(loadSettings());

agentSettings.subscribe(saveSettings);