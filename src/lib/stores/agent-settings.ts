import { Convert, type AgentSettings } from "$lib/types/agent-settings";
import { createPersistentStore } from "./store-utils";

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

export const agentSettings = createPersistentStore<AgentSettings>({
    storageKey: 'agent-settings',
    defaultValue: defaultAgentSettings,
    serialize: Convert.toJson,
    deserialize: Convert.fromJson
});