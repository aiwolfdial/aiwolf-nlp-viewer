export interface Packet {
    id: string;
    idx: number;
    day: number;
    isDay: boolean;
    agents: Agent[];
    event: string;
    message: string | undefined;
    fromIdx: number | undefined;
    toIdx: number | undefined;
    bubbleIdx: number | undefined;
}

export interface Agent {
    idx: number;
    team: string;
    name: string;
    role: string;
    isAlive: boolean;
}
