import { realtimeSettings } from '$lib/stores/realtime-settings';
import type { Packet } from '$lib/types/realtime';
import type { RealtimeSettings } from '$lib/types/realtime-settings';
import { writable } from 'svelte/store';

export interface RealtimeSocket {
    status: 'disconnected' | 'connecting' | 'connected';
    entries: Record<string, Packet[]>
}

function createRealtimeSocketState() {
    const { subscribe, update } = writable<RealtimeSocket>({
        status: 'disconnected',
        entries: {},
    });

    let socket: WebSocket | null = null;
    let settings: RealtimeSettings | null = null;

    realtimeSettings.subscribe((value) => {
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
                console.log("Received packet:", packet);
                update(state => {
                    const newEntries = { ...state.entries };
                    if (!newEntries[packet.id]) {
                        newEntries[packet.id] = [];
                    }
                    newEntries[packet.id].push(packet);
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

    return {
        subscribe,
        connect,
        disconnect,
        entries: {
            subscribe: (callback: (value: Record<string, Packet[]>) => void) => {
                return subscribe(state => callback(state.entries));
            },
        },
    };
}

export const realtimeSocketState = createRealtimeSocketState();