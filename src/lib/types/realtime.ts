export interface Packet {
    id: string;
    idx: number;
    day: number;
    is_day: boolean;
    agents: Agent[];
    event: string;
    message: string | undefined;
    from_idx: number | undefined;
    to_idx: number | undefined;
    bubble_idx: number | undefined;
}

export interface Agent {
    idx: number;
    team: string;
    name: string;
    profile: string | undefined;
    avatar: string | undefined;
    role: string;
    is_alive: boolean;
}
