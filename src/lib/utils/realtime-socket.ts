import type { ReEntry } from '$lib/types/realtime';
import { writable } from 'svelte/store';

export interface RealTimeSocket {
    status: 'disconnected' | 'connecting' | 'connected' | 'attempting';
    url: string;
    socket: WebSocket | null;
    reconnectTimer?: number | null;
}

function createRealtimeSocket() {
    const { subscribe, set, update } = writable<RealTimeSocket>({
        status: 'disconnected',
        url: '',
        socket: null,
        reconnectTimer: null,
    });

    const entries = writable<{ [id: string]: ReEntry[] }>({});

    function attemptReconnect() {
        update(state => {
            if (state.reconnectTimer) return state;

            const timer = setInterval(() => {
                connect(state.url);
            }, 3000);

            return { ...state, status: 'attempting', reconnectTimer: timer };
        });
    }

    function handleMessage(event: MessageEvent) {
        try {
            const message = JSON.parse(event.data);
            const entry = message.data as ReEntry;
            const id = message.id as string;

            entries.update(currentEntries => {
                const updatedEntries = { ...currentEntries };
                if (!updatedEntries[id]) {
                    updatedEntries[id] = [];
                }
                updatedEntries[id].push(entry);
                return updatedEntries;
            });
        } catch (e) {
        }
    }

    function connect(url: string) {
        update(state => {
            if (state.socket) {
                state.socket.close();
            }

            const socket = new WebSocket(url);
            socket.onopen = () => {
                update(s => ({ ...s, status: 'connected', reconnectTimer: null }));
            };
            socket.onclose = attemptReconnect;
            socket.onerror = () => {
                update(s => ({ ...s, status: 'attempting' }));
            };
            socket.onmessage = handleMessage;

            return { ...state, status: 'connecting', socket, url };
        });
    }

    function disconnect() {
        update(state => {
            if (state.socket) {
                state.socket.close();
            }
            if (state.reconnectTimer) {
                clearInterval(state.reconnectTimer);
            }
            return { ...state, status: 'disconnected', socket: null, reconnectTimer: null };
        });
    }

    function setUrl(newUrl: string) {
        update(state => ({ ...state, url: newUrl }));
    }

    return {
        subscribe,
        connect,
        disconnect,
        setUrl,
        entries: { subscribe: entries.subscribe },
    };
}

export const realtimeSocketState = createRealtimeSocket();
