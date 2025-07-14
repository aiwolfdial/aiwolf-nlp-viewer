import { realtimeSettings } from '$lib/stores/realtime-settings';
import type { Packet } from '$lib/types/realtime';
import type { RealtimeSettings } from '$lib/types/realtime-settings';
import { writable } from 'svelte/store';

export type RealtimeConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'loaded';

export interface RealtimeSocket {
    status: RealtimeConnectionStatus;
    entries: Record<string, Packet[]>;
}

const createInitialRealtimeState = (): RealtimeSocket => ({
    status: 'disconnected',
    entries: {},
});

function createRealtimeSocketState() {
    const { subscribe, update } = writable<RealtimeSocket>(createInitialRealtimeState());

    let socket: WebSocket | null = null;
    let settings: RealtimeSettings | null = null;

    const unsubscribe = realtimeSettings.subscribe((value) => {
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
        };

        socket.onerror = () => {
            update(state => ({ ...state, status: "disconnected" }));
            socket = null;
        };
        socket.onmessage = (event) => {
            try {
                const packet = JSON.parse(event.data) as Packet;
                console.log("Received packet:", packet);
                update(state => addPacketToEntries(state, packet));
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

    async function loadFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            await loadFromText(text);
        } catch (error) {
            console.error('Failed to load JSONL from clipboard:', error);
        }
    }

    async function loadFromText(text: string) {
        if (!text.trim()) {
            return;
        }

        const packets = parseJSONLText(text);
        if (packets.length === 0) {
            console.error('No valid packets found');
            return;
        }

        const newEntries = groupAndSortPackets(packets);

        if (socket) {
            socket.close();
            socket = null;
        }

        update(state => ({
            ...state,
            status: 'loaded',
            entries: newEntries,
        }));

        console.log(`JSONL data loaded: ${packets.length} packets across ${Object.keys(newEntries).length} games`);
    }

    async function loadFromFiles(files: FileList) {
        for (const file of Array.from(files)) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result as string;
                await loadFromText(text);
            };
            reader.readAsText(file);
        }
    }


    function addPacketToEntries(state: RealtimeSocket, packet: Packet): RealtimeSocket {
        const newEntries = { ...state.entries };
        if (!newEntries[packet.id]) {
            newEntries[packet.id] = [];
        }
        newEntries[packet.id].push(packet);
        return { ...state, entries: newEntries };
    }

    function parseJSONLText(text: string): Packet[] {
        const lines = text.trim().split('\n');
        const packets: Packet[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                try {
                    const packet = JSON.parse(line) as Packet;
                    packets.push(packet);
                } catch (e) {
                    console.error(`Line ${i + 1} is not valid JSON:`, line);
                    return [];
                }
            }
        }

        return packets;
    }

    function groupAndSortPackets(packets: Packet[]): Record<string, Packet[]> {
        const newEntries: Record<string, Packet[]> = {};

        packets.forEach(packet => {
            if (!newEntries[packet.id]) {
                newEntries[packet.id] = [];
            }
            newEntries[packet.id].push(packet);
        });

        Object.keys(newEntries).forEach(id => {
            newEntries[id].sort((a, b) => {
                if (a.day !== b.day) return a.day - b.day;
                if (a.is_day !== b.is_day) return a.is_day ? -1 : 1;
                return a.idx - b.idx;
            });
        });

        return newEntries;
    }

    return {
        subscribe,
        connect,
        disconnect,
        loadFromClipboard,
        loadFromFiles,
        entries: {
            subscribe: (callback: (value: Record<string, Packet[]>) => void) => {
                return subscribe(state => callback(state.entries));
            },
        },
    };
}

export const realtimeSocketState = createRealtimeSocketState();