export interface ReEntry {
    day: number;
    action:
    | "execute"
    | "attack"
    | "divine"
    | "guard"
    | "vote"
    | "attackVote"
    | "talk"
    | "whisper";
    agent?: number;
    target?: number;
    text?: string;
    result?: boolean | string;
}

export interface ReAgent {
    idx: number;
    label: string;
    disabled: boolean;
    targets: ReAgentArrow[];
    center: boolean;
}

export interface ReAgentArrow {
    targetIdx: number;
    color: string;
}

export interface ReMessage {
    id: string;
    data: ReEntry;
}