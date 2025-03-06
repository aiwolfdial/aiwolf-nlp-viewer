import { agentSettings } from '$lib/stores/agent-settings';
import { Request, Role, type Info, type Judge, type Packet, type Setting, type Talk } from '$lib/types/agent';
import type { AgentSettings } from '$lib/types/agent-settings';
import { writable } from 'svelte/store';

export interface AgentSocket {
    status: 'disconnected' | 'connecting' | 'connected';
    entries: (Packet | string)[];
    role: Role | null;
    request: Request | null;
    info: Info | null;
    mediumResults: Judge[];
    divineResults: Judge[];
    setting: Setting | null;
    talkHistory: Talk[];
    whisperHistory: Talk[];
}

function createAgentSocketState() {
    const { subscribe, update } = writable<AgentSocket>({
        status: 'disconnected',
        entries: [],
        role: null,
        request: null,
        info: null,
        mediumResults: [],
        divineResults: [],
        setting: null,
        talkHistory: [],
        whisperHistory: [],
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

                    const newState = {
                        ...state,
                        entries: newEntries,
                        request: packet.request
                    };

                    if (packet.info) {
                        newState.info = packet.info;
                        if (packet.info.mediumResult) {
                            newState.mediumResults.push(packet.info.mediumResult);
                        }
                        if (packet.info.divineResult) {
                            newState.divineResults.push(packet.info.divineResult);
                        }
                    }
                    if (packet.setting) {
                        newState.setting = packet.setting;
                    }
                    if (packet.talkHistory) {
                        newState.talkHistory.push(...packet.talkHistory);
                    }
                    if (packet.whisperHistory) {
                        newState.whisperHistory.push(...packet.whisperHistory);
                    }
                    if (packet.request === Request.INITIALIZE &&
                        newState.info &&
                        newState.info.roleMap &&
                        newState.info.agent) {
                        newState.role = newState.info.roleMap[newState.info.agent];
                    }
                    return newState;
                });

                switch (packet.request) {
                    case Request.NAME:
                        send(settings?.team || 'viewer' + Math.floor(Math.random() * 1000));
                        break;
                    case Request.FINISH:
                        disconnect();
                        break;
                }
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
                update(state => {
                    const newEntries = state.entries.slice();
                    newEntries.push(text);
                    return { ...state, entries: newEntries };
                });
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
    };
}

export const agentSocketState = createAgentSocketState();