export interface RePacket {
    id: string;
    idx: number;
    day: number;
    isDay: boolean;
    agents: ReAgent[];
    message: string;
    summary: string;
    isDivider: boolean;
}

export interface ReAgent {
    idx: number;
    name: string;
    role: string;
    isAlive: boolean;
    targetIdxs: number[];
    isBubble: boolean;
}
