import { realtimeSettings } from '$lib/stores/realtime-settings';
import type { Packet } from '$lib/types/realtime';
import type { RealtimeSettings } from '$lib/types/realtime-settings';
import { writable } from 'svelte/store';

export type RealtimeConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'loaded';

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
    lastGameListChecksum: string | null;
}

const createInitialRealtimeState = (): RealtimeSocket => ({
    status: 'disconnected',
    entries: {},
    gameItems: [],
    currentGameId: null,
    lastGameListChecksum: null,
});

function createRealtimeSocketState() {
    const { subscribe, update } = writable<RealtimeSocket>(createInitialRealtimeState());

    let gameListInterval: ReturnType<typeof setInterval> | null = null;
    let gamePollingIntervals: Record<string, ReturnType<typeof setInterval>> = {};
    let lastGameUpdates: Record<string, string> = {};
    let settings: RealtimeSettings | null = null;

    const unsubscribe = realtimeSettings.subscribe((value) => {
        settings = value;
    });

    async function fetchGameList(): Promise<RealtimeGameItem[]> {
        if (!settings) return [];
        try {
            const response = await fetch(`${settings.connection.url}/games.json`);
            if (!response.ok) throw new Error('Failed to fetch game list');
            const games = await response.json() as RealtimeGameItem[];
            return games;
        } catch (error) {
            console.error('Error fetching game list:', error);
            return [];
        }
    }

    async function fetchGamePackets(filename: string): Promise<Packet[]> {
        if (!settings) return [];
        try {
            const response = await fetch(`${settings.connection.url}/${filename}.jsonl`);
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
            const game = currentGame.find(g => g.id === gameId);

            if (game && game.updated_at !== lastGameUpdates[gameId]) {
                const packets = await fetchGamePackets(filename);
                if (packets.length > 0) {
                    update(state => {
                        const newEntries = { ...state.entries };
                        newEntries[gameId] = packets;
                        return { ...state, entries: newEntries };
                    });
                }
                lastGameUpdates[gameId] = game.updated_at;
            }
        };

        // 初回実行のために直接パケットを取得
        const initialFetch = async () => {
            const packets = await fetchGamePackets(filename);
            if (packets.length > 0) {
                update(state => {
                    const newEntries = { ...state.entries };
                    newEntries[gameId] = packets;
                    return { ...state, entries: newEntries };
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
        update(state => ({ ...state, status: "connecting" }));

        const pollGameList = async () => {
            const games = await fetchGameList();
            const gameListChecksum = JSON.stringify(games.map(g => ({ id: g.id, updated_at: g.updated_at })));

            update(state => {
                if (state.lastGameListChecksum === gameListChecksum) {
                    return state;
                }

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

                    if (state.gameItems.length > 0) {
                        const existingGame = state.gameItems.find(g => g.id === mostRecentGame.id);
                        if (!existingGame || new Date(mostRecentGame.updated_at) > new Date(existingGame.updated_at)) {
                            autoSwitchGameId = mostRecentGame.id;
                        }
                    } else if (!state.currentGameId) {
                        autoSwitchGameId = mostRecentGame.id;
                    }
                }

                return {
                    ...state,
                    status: "connected",
                    gameItems: games,
                    currentGameId: autoSwitchGameId,
                    lastGameListChecksum: gameListChecksum
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

        update(state => ({ ...state, status: "disconnected" }));
    }

    function switchToGame(gameId: string) {
        update(state => ({ ...state, currentGameId: gameId }));
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
    };
}

export const realtimeSocketState = createRealtimeSocketState();