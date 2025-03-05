import { agentSettings } from '$lib/stores/agent-settings';
import type { Packet } from '$lib/types/agent';
import type { AgentSettings } from '$lib/types/agent-settings';
import { writable } from 'svelte/store';

export interface AgentSocket {
    status: 'disconnected' | 'connecting' | 'connected';
    entries: Packet[]
}

function createAgentSocketState() {
    const { subscribe, update } = writable<AgentSocket>({
        status: 'disconnected',
        entries: [],
    });

    let socket: WebSocket | null = null;
    let settings: AgentSettings | null = null;

    agentSettings.subscribe((value) => {
        settings = value;
    });

    function connect() {
        if (!settings) return;
        update(state => ({ ...state, status: "connecting" }));
        const socketUrl = new URL(settings.connection.url);
        if (settings.connection.token) {
            socketUrl.searchParams.set('token', settings.connection.token);
        }
        socket = new WebSocket(socketUrl);
        socket.onopen = () => {
            update(state => ({ ...state, status: "connected" }));
        };
        socket.onclose = () => {
            update(state => ({ ...state, status: "disconnected" }));
            socket = null;
        }
        socket.onerror = () => {
            update(state => ({ ...state, status: "disconnected" }));
            socket = null;
        }
        socket.onmessage = (event) => {
            try {
                const packet = JSON.parse(event.data) as Packet;
                update(state => {
                    const newEntries = state.entries.slice();
                    newEntries.push(packet);
                    return { ...state, entries: newEntries };
                });
            } catch (e) {
                console.error("Failed to parse message:", e);
            }
        };
    }

    function disconnect() {
        if (socket) {
            update(state => ({ ...state, status: "disconnected" }));
            socket.close();
            socket = null;
        }
    }

    function send(text: string) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            try {
                socket.send(text);
            } catch (e) {
                console.error("Failed to send message:", e);
            }
        }
    }

    return {
        subscribe,
        connect,
        disconnect,
        send,
        entries: {
            subscribe: (callback: (value: Packet[]) => void) => {
                return subscribe((state) => {
                    callback(state.entries);
                });
            }
        },
    };
}

export const agentSocketState = createAgentSocketState();