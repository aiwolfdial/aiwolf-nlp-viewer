import { browser } from "$app/environment";
import { Convert, type RealtimeSettings } from "$lib/types/realtime-settings";
import { writable } from "svelte/store";


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
        },
        largeScale: false,
    }
}

function load(): RealtimeSettings {
    if (!browser) return defaultRealtimeSettings;
    const value = localStorage.getItem('realtime-settings');
    if (value) {
        try {
            return Convert.fromJson(value);
        } catch (e) {
            console.error(e);
        }
    }
    localStorage.setItem('realtime-settings', Convert.toJson(defaultRealtimeSettings));
    return defaultRealtimeSettings;
}

export const realtimeSettings = writable<RealtimeSettings>(load());

realtimeSettings.subscribe(_ => {
    if (browser) {
        localStorage.setItem('realtime-settings', Convert.toJson(defaultRealtimeSettings));
    }
});