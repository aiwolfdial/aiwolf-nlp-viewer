import { Convert, type RealtimeSettings } from "$lib/types/realtime-settings";
import { createPersistentStore } from "./store-utils";

const defaultDisplayAgent = {
    name: true,
    team: false,
    role: false
};

const defaultRealtimeSettings: RealtimeSettings = {
    connection: {
        url: "http://localhost:8080",
        token: ""
    },
    display: {
        canvas: defaultDisplayAgent,
        bubble: defaultDisplayAgent,
        text: defaultDisplayAgent,
        largeScale: false,
    }
};

export const realtimeSettings = createPersistentStore<RealtimeSettings>({
    storageKey: 'realtime-settings',
    defaultValue: defaultRealtimeSettings,
    serialize: Convert.toJson,
    deserialize: Convert.fromJson
});