import { realtimeSettings } from '$lib/stores/realtime-settings';
import type { Packet } from '$lib/types/realtime';
import type { RealtimeSettings } from '$lib/types/realtime-settings';
import { writable } from 'svelte/store';

export const RealtimeConnectionStatus = {
    DISCONNECTED: 'disconnected',
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
} as const;

export type RealtimeConnectionStatus = typeof RealtimeConnectionStatus[keyof typeof RealtimeConnectionStatus];

export interface RealtimeGameItem {
    id: string;
    filename: string;
    updated_at: string;
}

export interface RealtimeSocket {
    status: RealtimeConnectionStatus;
    entries: Record<string, Packet[]>;
    gameItems: RealtimeGameItem[];
    currentGameId: string | null;
    selectedPacketIdx: number | null;
    isManualGameSelection: boolean;
    isManualPacketSelection: boolean;
    previousEntriesLengths: Record<string, number>;
}

const createInitialRealtimeState = (): RealtimeSocket => ({
    status: RealtimeConnectionStatus.DISCONNECTED,
    entries: {},
    gameItems: [],
    currentGameId: null,
    selectedPacketIdx: null,
    isManualGameSelection: false,
    isManualPacketSelection: false,
    previousEntriesLengths: {},
});

function createRealtimeSocketState() {
    const { subscribe, update } = writable<RealtimeSocket>(createInitialRealtimeState());

    let gameListInterval: ReturnType<typeof setInterval> | null = null;
    let gamePollingIntervals: Record<string, ReturnType<typeof setInterval>> = {};
    let lastGameUpdates: Record<string, string> = {};
    let settings: RealtimeSettings | null = null;

    realtimeSettings.subscribe((value) => {
        settings = value;
    });

    async function fetchGameList(): Promise<RealtimeGameItem[] | null> {
        if (!settings) return null;
        try {
            const response = await fetch(`${settings.connection.url}/realtime/games.json`);
            if (!response.ok) throw new Error('Failed to fetch game list');
            const games = await response.json() as RealtimeGameItem[];
            return games;
        } catch (error) {
            console.error('Error fetching game list:', error);
            return null;
        }
    }

    async function fetchGamePackets(filename: string): Promise<Packet[]> {
        if (!settings) return [];
        try {
            const response = await fetch(`${settings.connection.url}/realtime/${filename}.jsonl`);
            if (!response.ok) throw new Error(`Failed to fetch game packets for ${filename}`);
            const text = await response.text();
            return parseJSONLText(text);
        } catch (error) {
            console.error(`Error fetching game packets for ${filename}:`, error);
            return [];
        }
    }

    function startGamePolling(gameId: string, filename: string, updatedAt: string) {
        if (gamePollingIntervals[gameId]) return;

        const pollGame = async () => {
            const currentGame = await fetchGameList();
            if (currentGame === null) return;
            const game = currentGame.find(g => g.id === gameId);

            if (game && game.updated_at !== lastGameUpdates[gameId]) {
                const packets = await fetchGamePackets(filename);
                if (packets.length > 0) {
                    update(state => {
                        const newEntries = { ...state.entries };
                        const previousLength = state.previousEntriesLengths[gameId] || 0;
                        const newLength = packets.length;

                        newEntries[gameId] = packets;

                        let newSelectedIdx = state.selectedPacketIdx;
                        if (gameId === state.currentGameId && newLength > previousLength) {
                            newSelectedIdx = newLength - 1;
                        }

                        return {
                            ...state,
                            entries: newEntries,
                            selectedPacketIdx: newSelectedIdx,
                            previousEntriesLengths: {
                                ...state.previousEntriesLengths,
                                [gameId]: newLength
                            },
                            isManualPacketSelection: false
                        };
                    });
                }
                lastGameUpdates[gameId] = game.updated_at;
            }
        };

        const initialFetch = async () => {
            const packets = await fetchGamePackets(filename);
            if (packets.length > 0) {
                update(state => {
                    const newEntries = { ...state.entries };
                    newEntries[gameId] = packets;

                    let newSelectedIdx = state.selectedPacketIdx;
                    if (gameId === state.currentGameId) {
                        newSelectedIdx = packets.length - 1;
                    }

                    return {
                        ...state,
                        entries: newEntries,
                        selectedPacketIdx: newSelectedIdx,
                        previousEntriesLengths: {
                            ...state.previousEntriesLengths,
                            [gameId]: packets.length
                        }
                    };
                });
            }
            lastGameUpdates[gameId] = updatedAt;
        };

        initialFetch();
        gamePollingIntervals[gameId] = setInterval(pollGame, 1000);
    }

    function stopGamePolling(gameId: string) {
        if (gamePollingIntervals[gameId]) {
            clearInterval(gamePollingIntervals[gameId]);
            delete gamePollingIntervals[gameId];
            delete lastGameUpdates[gameId];
        }
    }

    function connect() {
        if (!settings) return;
        update(state => ({ ...state, status: RealtimeConnectionStatus.CONNECTING }));

        const pollGameList = async () => {
            const games = await fetchGameList();
            if (games === null) {
                update(state => ({ ...state, status: RealtimeConnectionStatus.CONNECTING }));
                return;
            }

            update(state => {
                const currentGameIds = new Set(Object.keys(gamePollingIntervals));
                const newGameIds = new Set(games.map(g => g.id));

                currentGameIds.forEach(gameId => {
                    if (!newGameIds.has(gameId)) {
                        stopGamePolling(gameId);
                    }
                });

                games.forEach(game => {
                    if (!currentGameIds.has(game.id)) {
                        startGamePolling(game.id, game.filename, game.updated_at);
                    }
                });

                let autoSwitchGameId = state.currentGameId;

                if (games.length > 0) {
                    const mostRecentGame = games.reduce((latest, game) => {
                        return new Date(game.updated_at) > new Date(latest.updated_at) ? game : latest;
                    });

                    if (!state.currentGameId || (!state.isManualGameSelection && games.length > state.gameItems.length)) {
                        autoSwitchGameId = mostRecentGame.id;
                    }
                }

                const shouldResetPacketSelection = autoSwitchGameId !== state.currentGameId;

                return {
                    ...state,
                    status: RealtimeConnectionStatus.CONNECTED,
                    gameItems: games,
                    currentGameId: autoSwitchGameId,
                    selectedPacketIdx: shouldResetPacketSelection ? null : state.selectedPacketIdx,
                    isManualGameSelection: shouldResetPacketSelection ? false : state.isManualGameSelection,
                    isManualPacketSelection: shouldResetPacketSelection ? false : state.isManualPacketSelection,
                };
            });
        };

        pollGameList();
        gameListInterval = setInterval(pollGameList, 1000);
    }

    function disconnect() {
        if (gameListInterval) {
            clearInterval(gameListInterval);
            gameListInterval = null;
        }

        Object.keys(gamePollingIntervals).forEach(gameId => {
            stopGamePolling(gameId);
        });

        update(state => ({ ...state, status: RealtimeConnectionStatus.DISCONNECTED }));
    }

    function switchToGame(gameId: string, isManual: boolean = false) {
        update(state => {
            const packets = state.entries[gameId];
            const newSelectedIdx = packets && packets.length > 0 ? packets.length - 1 : null;

            return {
                ...state,
                currentGameId: gameId,
                selectedPacketIdx: newSelectedIdx,
                isManualGameSelection: isManual,
                isManualPacketSelection: false
            };
        });
    }

    function selectPacket(idx: number, isManual: boolean = false) {
        update(state => ({
            ...state,
            selectedPacketIdx: idx,
            isManualPacketSelection: isManual
        }));
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

        update(state => ({
            ...state,
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
        switchToGame,
        selectPacket,
        loadFromClipboard,
        loadFromFiles,
        entries: {
            subscribe: (callback: (value: Record<string, Packet[]>) => void) => {
                return subscribe(state => callback(state.entries));
            },
        },
        gameList: {
            subscribe: (callback: (value: RealtimeGameItem[]) => void) => {
                return subscribe(state => callback(state.gameItems));
            },
        },
        currentGameId: {
            subscribe: (callback: (value: string | null) => void) => {
                return subscribe(state => callback(state.currentGameId));
            },
        },
        selectedPacketIdx: {
            subscribe: (callback: (value: number | null) => void) => {
                return subscribe(state => callback(state.selectedPacketIdx));
            },
        },
        currentPacket: {
            subscribe: (callback: (value: Packet | null) => void) => {
                return subscribe(state => {
                    const { currentGameId, selectedPacketIdx, entries } = state;
                    if (!currentGameId || selectedPacketIdx === null) {
                        callback(null);
                        return;
                    }
                    const packets = entries[currentGameId];
                    if (!packets || selectedPacketIdx < 0 || selectedPacketIdx >= packets.length) {
                        callback(null);
                        return;
                    }
                    callback(packets[selectedPacketIdx]);
                });
            },
        },
    };
}

export const realtimeSocketState = createRealtimeSocketState();