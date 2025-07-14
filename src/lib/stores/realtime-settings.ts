import { browser } from "$app/environment";
import { Convert, type RealtimeSettings } from "$lib/types/realtime-settings";
import { writable } from "svelte/store";

const STORAGE_KEY = 'realtime-settings';

const defaultDisplayAgent = {
    name: true,
    team: false,
    role: false
};

const defaultRealtimeSettings: RealtimeSettings = {
    connection: {
        url: "ws://localhost:8080/realtime",
        token: ""
    },
    display: {
        canvas: defaultDisplayAgent,
        bubble: defaultDisplayAgent,
        text: defaultDisplayAgent,
        largeScale: false,
    }
};

function loadSettings(): RealtimeSettings {
    if (!browser) return defaultRealtimeSettings;

    const value = localStorage.getItem(STORAGE_KEY);
    if (value) {
        try {
            return Convert.fromJson(value);
        } catch (e) {
            console.error('Failed to parse realtime settings:', e);
        }
    }

    saveSettings(defaultRealtimeSettings);
    return defaultRealtimeSettings;
}

function saveSettings(settings: RealtimeSettings): void {
    if (browser) {
        localStorage.setItem(STORAGE_KEY, Convert.toJson(settings));
    }
}

export const realtimeSettings = writable<RealtimeSettings>(loadSettings());

realtimeSettings.subscribe(saveSettings);