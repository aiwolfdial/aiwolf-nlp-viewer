import { browser } from "$app/environment";
import { Convert, type AgentSettings } from "$lib/types/agent-settings";
import { writable } from "svelte/store";


const defaultAgentSettings: AgentSettings = {
    connection: {
        url: "ws://localhost:8080/ws",
        token: ""
    },
    team: "aiwolf-nlp-viewer",
    display: {
        largeScale: false
    }
}

function load(): AgentSettings {
    if (!browser) return defaultAgentSettings;
    const value = localStorage.getItem('agent-settings');
    if (value) {
        try {
            return Convert.fromJson(value);
        } catch (e) {
            console.error(e);
        }
    }
    localStorage.setItem('agent-settings', Convert.toJson(defaultAgentSettings));
    return defaultAgentSettings;
}

export const agentSettings = writable<AgentSettings>(load());

agentSettings.subscribe(value => {
    if (browser) {
        localStorage.setItem('agent-settings', Convert.toJson(value));
    }
});