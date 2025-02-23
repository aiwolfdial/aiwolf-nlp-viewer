export interface Packet {
    id: string;
    idx: number;
    day: number;
    isDay: boolean;
    agents: Agent[];
    message: string;
    summary: string;
    isDivider: boolean;
}

export interface Agent {
    idx: number;
    name: string;
    role: string;
    isAlive: boolean;
    targetIdxs: number[];
    isBubble: boolean;
}
