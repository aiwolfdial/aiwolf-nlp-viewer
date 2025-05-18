export interface Agent {
    role: string;
    status: string;
    originalName: string;
    gameName: string;
}

export interface Talk {
    talkIdx: string;
    turnIdx: string;
    agentIdx: string;
    text: string;
}

export interface Vote {
    agentIdx: string;
    targetIdx: string;
}

export interface Execution {
    agentIdx: string;
    role: string;
}

export interface Divine {
    agentIdx: string;
    targetIdx: string;
    result: string;
}

export interface Guard {
    agentIdx: string;
    targetIdx: string;
    result: string;
}

export interface Attack {
    targetIdx: string;
    isSuccessful: boolean;
}

export interface Result {
    villagers: string;
    werewolves: string;
    winSide: string;
}

export interface DayStatus {
    agents: Record<string, Agent>;
    beforeWhisper: Talk[];
    talks: Talk[];
    votes: Vote[];
    execution: Execution | null;
    divine: Divine | null;
    afterWhisper: Talk[];
    guard: Guard | null;
    attackVotes: Vote[];
    attack: Attack | null;
    result: Result | null;
}