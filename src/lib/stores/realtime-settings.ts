import { browser } from "$app/environment";
import { writable } from "svelte/store";

export interface RealtimeSettings {
    url: string;
    token: string;
}

const defaultRealtimeSettings: RealtimeSettings = {
    url: "ws://localhost:8080/realtime",
    token: ""
}

function load(): RealtimeSettings {
    if (!browser) return defaultRealtimeSettings;
    const value = localStorage.getItem('realtime-settings');
    if (value) {
        return JSON.parse(value);
    }
    return defaultRealtimeSettings;
}

export const realtimeSettings = writable<RealtimeSettings>(load());

realtimeSettings.subscribe(settings => {
    if (browser) {
        localStorage.setItem('realtime-settings', JSON.stringify(settings));
    }
});