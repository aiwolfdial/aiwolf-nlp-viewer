import type { Packet } from '$lib/types/realtime';
import { writable } from 'svelte/store';

export interface RealtimeSocket {
    url: string;
    token: string;
    status: 'disconnected' | 'connecting' | 'connected' | 'attempting';
    socket: WebSocket | null;
    reconnectTimer?: number | null;
}

function createRealtimeSocket() {
    const { subscribe, update } = writable<RealtimeSocket>({
        status: 'disconnected',
        url: '',
        token: '',
        socket: null,
        reconnectTimer: null,
    });

    const entries = writable<{ [id: string]: Packet[] }>({});

    function reconnect() {
        update(state => {
            if (state.reconnectTimer) return state;
            const timer = setInterval(() => {
                connect(state.url, state.token);
            }, 3000);
            return { ...state, status: 'attempting', reconnectTimer: timer };
        });
    }

    function handle(event: MessageEvent) {
        try {
            const packet = JSON.parse(event.data) as Packet;

            entries.update(currentEntries => {
                const updatedEntries = { ...currentEntries };
                if (!updatedEntries[packet.id]) {
                    updatedEntries[packet.id] = [];
                }
                updatedEntries[packet.id].push(packet);
                return updatedEntries;
            });
        } catch (e) {
        }
    }

    function connect(url: string, token: string) {
        update(state => {
            if (state.socket) {
                state.socket.close();
            }
            const socket = new WebSocket(url + (token !== "" ? '?token=' + token : ""));
            socket.onopen = () => {
                update(s => ({ ...s, status: 'connected', reconnectTimer: null }));
            };
            socket.onclose = reconnect;
            socket.onerror = () => {
                update(s => ({ ...s, status: 'attempting' }));
            };
            socket.onmessage = handle;
            return { ...state, status: 'connecting', socket };
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

    function set(url: string, token: string) {
        update(state => ({ ...state, url: url, token: token }));
    }

    return {
        subscribe,
        connect,
        disconnect,
        set,
        entries: { subscribe: entries.subscribe },
    };
}

export const realtimeSocketState = createRealtimeSocket();
