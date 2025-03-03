export interface Packet {
    id: string;
    idx: number;
    day: number;
    isDay: boolean;
    agents: Agent[];
    event: string;
    message: string;
    fromIdx: number;
    toIdx: number;
    bubbleIdx: number;
}

export interface Agent {
    idx: number;
    team: string;
    name: string;
    role: string;
    isAlive: boolean;
}
