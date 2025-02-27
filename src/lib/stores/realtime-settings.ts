import { browser } from "$app/environment";
import { writable } from "svelte/store";

export interface RealtimeSettings {
    connection: {
        url: string;
        token: string;
    };
    display: {
        agent: {
            name: boolean;
            team: boolean;
            role: boolean;
        }
    };
}

const defaultRealtimeSettings: RealtimeSettings = {
    connection: {
        url: "ws://localhost:8080/realtime",
        token: ""
    },
    display: {
        agent: {
            name: true,
            team: true,
            role: true
        }
    }
}

function load(): RealtimeSettings {
    if (!browser) return defaultRealtimeSettings;
    const value = localStorage.getItem('realtime-settings');
    if (value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.error(e);
        }
    }
    return defaultRealtimeSettings;
}

export const realtimeSettings = writable<RealtimeSettings>(load());

realtimeSettings.subscribe(settings => {
    if (browser) {
        localStorage.setItem('realtime-settings', JSON.stringify(settings));
    }
});