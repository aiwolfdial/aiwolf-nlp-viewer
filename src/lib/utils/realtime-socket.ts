import type { ReEntry } from '$lib/types/realtime';
import { writable } from 'svelte/store';

export interface RealTimeSocket {
    status: 'disconnected' | 'connecting' | 'connected';
    url: string;
    socket: WebSocket | null;
    autoReconnect: boolean;
    reconnectInterval: number;
    reconnectTimer: number | null;
}

const DEFAULT_URL = 'ws://localhost:8080/realtime';

function createRealtimeSocket() {
    const { subscribe, set, update } = writable<RealTimeSocket>({
        status: 'disconnected',
        url: DEFAULT_URL,
        socket: null,
        autoReconnect: true,
        reconnectInterval: 3000,
        reconnectTimer: null
    });

    const entries = writable<{ [id: string]: ReEntry[] }>({});
    const selectedId = writable<string>('');
    const selectedIdx = writable<number>(-1);

    function connect(url?: string) {
        return update(state => {
            if (state.socket) {
                state.socket.close();
            }
            if (url) {
                state.url = url;
            }
            try {
                const socket = new WebSocket(state.url);

                socket.onopen = () => {
                    update(s => ({ ...s, status: 'connected' }));
                };

                socket.onclose = () => {
                    update(s => {
                        if (s.autoReconnect && !s.reconnectTimer) {
                            const timer = window.setTimeout(() => connect(), s.reconnectInterval);
                            return { ...s, status: 'disconnected', socket: null, reconnectTimer: timer };
                        }
                        return { ...s, status: 'disconnected', socket: null };
                    });
                };

                socket.onerror = () => {
                    update(s => ({ ...s, status: 'disconnected' }));
                };

                socket.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        const entry = message.data as ReEntry;
                        const id = message.id as string;

                        entries.update(currentEntries => {
                            if (!currentEntries[id]) {
                                currentEntries[id] = [];
                            }
                            currentEntries[id].push(entry);
                            return currentEntries;
                        });

                        selectedId.update(currentId => {
                            if (currentId === '') {
                                return id;
                            }
                            return currentId;
                        });

                        selectedId.subscribe(value => {
                            if (value === id) {
                                entries.subscribe(allEntries => {
                                    if (allEntries[id]) {
                                        selectedIdx.set(allEntries[id].length - 1);
                                    }
                                })();
                            }
                        })();
                    } catch (e) {
                        console.error('Invalid WebSocket data:', e);
                    }
                };

                return {
                    ...state,
                    status: 'connecting',
                    socket,
                    reconnectTimer: null
                };
            } catch (error) {
                console.error('WebSocket connection error:', error);
                return {
                    ...state,
                    status: 'disconnected',
                    socket: null
                };
            }
        });
    }

    function disconnect() {
        return update(state => {
            if (state.socket) {
                state.socket.close();
            }
            if (state.reconnectTimer) {
                clearTimeout(state.reconnectTimer);
            }
            return {
                ...state,
                status: 'disconnected',
                socket: null,
                reconnectTimer: null
            };
        });
    }

    function setAutoReconnect(value: boolean) {
        return update(state => ({
            ...state,
            autoReconnect: value
        }));
    }

    function setUrl(url: string) {
        return update(state => ({
            ...state,
            url
        }));
    }

    return {
        subscribe,
        connect,
        disconnect,
        setAutoReconnect,
        setUrl,
        entries: { subscribe: entries.subscribe },
        selectedId: {
            subscribe: selectedId.subscribe,
            set: selectedId.set
        },
        selectedIdx: {
            subscribe: selectedIdx.subscribe,
            set: selectedIdx.set,
            update: selectedIdx.update
        }
    };
}

export const realtimeSocketState = createRealtimeSocket();