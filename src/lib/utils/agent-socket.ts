import type { Role } from '$lib/constants/common';
import { agentSettings } from '$lib/stores/agent-settings';
import { Request, type Info, type Judge, type Packet, type Setting, type Talk } from '$lib/types/agent';
import type { AgentSettings } from '$lib/types/agent-settings';
import { writable } from 'svelte/store';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface AgentSocket {
    status: ConnectionStatus;
    deadline: Date | null;
    entries: (Packet | string)[];
    agent: string | null;
    role: Role | null;
    profile: string | null;
    request: Request | null;
    info: Info | null;
    mediumResults: Judge[];
    divineResults: Judge[];
    setting: Setting | null;
    talkHistory: Talk[];
    whisperHistory: Talk[];
    executedAgents: string[];
    attackedAgents: string[];
}

const createInitialState = (): AgentSocket => ({
    status: 'disconnected',
    deadline: null,
    entries: [],
    agent: null,
    role: null,
    profile: null,
    request: null,
    info: null,
    mediumResults: [],
    divineResults: [],
    setting: null,
    talkHistory: [],
    whisperHistory: [],
    executedAgents: [],
    attackedAgents: [],
});

function createAgentSocketState() {
    const { subscribe, update } = writable<AgentSocket>(createInitialState());

    let socket: WebSocket | null = null;
    let settings: AgentSettings | null = null;
    let actionTimeout: number | null = null;
    let actionTimer: Timer | null = null;

    const unsubscribe = agentSettings.subscribe((value) => {
        settings = value;
    });

    function disconnect() {
        if (socket) {
            socket.close();
            socket = null;
            update(state => ({ ...state, status: "disconnected" }));
        }
        if (actionTimer) {
            actionTimer.clear();
            actionTimer = null;
        }
    }

    function connect() {
        if (!settings) return;

        if (socket) {
            update(() => createInitialState());
        }

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
            disconnect();
        };

        socket.onerror = () => {
            disconnect();
        };

        socket.onmessage = (event) => {
            try {
                const date = Date.now();
                const packet = JSON.parse(event.data) as Packet;

                update(state => processPacket(state, packet));
                handlePacketRequest(packet, date);
            } catch (e) {
                console.error("Failed to parse message:", e);
            }
        };
    }


    function send(text: string) {
        if (actionTimer) {
            actionTimer.clear();
            actionTimer = null;
            update(state => ({ ...state, deadline: null }));
        }
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

    function processPacket(state: AgentSocket, packet: Packet): AgentSocket {
        const newState = {
            ...state,
            entries: [...state.entries, packet],
            request: packet.request
        };

        if (packet.info) {
            newState.info = packet.info;

            if (packet.info.medium_result) {
                const judge = packet.info.medium_result;
                if (!newState.mediumResults.some(j => j.day === judge.day && j.agent === judge.agent)) {
                    newState.mediumResults.push(judge);
                }
            }

            if (packet.info.divine_result) {
                const judge = packet.info.divine_result;
                if (!newState.divineResults.some(j => j.day === judge.day && j.agent === judge.agent)) {
                    newState.divineResults.push(judge);
                }
            }

            if (packet.info.executed_agent) {
                newState.executedAgents.push(packet.info.executed_agent);
            }

            if (packet.info.attacked_agent) {
                newState.attackedAgents.push(packet.info.attacked_agent);
            }
        }

        if (packet.setting) {
            newState.setting = packet.setting;
            actionTimeout = packet.setting.timeout.action;
        }

        if (packet.talk_history) {
            newState.talkHistory.push(...packet.talk_history);
        }

        if (packet.whisper_history) {
            newState.whisperHistory.push(...packet.whisper_history);
        }

        if (packet.request === Request.INITIALIZE && newState.info) {
            newState.agent = newState.info.agent;
            newState.role = newState.info.role_map[newState.info.agent];
            newState.profile = newState.info.profile || null;
        }

        return newState;
    }

    function handlePacketRequest(packet: Packet, date: number) {
        switch (packet.request) {
            case Request.NAME:
                send(settings?.team || 'viewer' + Math.floor(Math.random() * 1000));
                break;
            case Request.TALK:
            case Request.WHISPER:
            case Request.VOTE:
            case Request.DIVINE:
            case Request.GUARD:
            case Request.ATTACK:
                if (actionTimer) {
                    actionTimer.clear();
                }
                actionTimer = new Timer(() => {
                    send("TIMEOUT");
                }, new Date(date + (actionTimeout ?? 60000)));
                update(state => ({ ...state, deadline: actionTimer?.deadline() ?? null }));
                break;
            case Request.FINISH:
                disconnect();
                break;
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

class Timer {
    private timeout: NodeJS.Timeout;
    private _deadline: Date;

    constructor(callback: () => void, deadline: Date) {
        this.timeout = setTimeout(callback, deadline.getTime() - new Date().getTime());
        this._deadline = deadline;
    }

    deadline() {
        return this._deadline;
    }

    clear() {
        clearTimeout(this.timeout);
    }
}