// src/lib/types/aiwolf.ts
export interface AgentStatus {
    role: string;
    status: string;
    name: string;
}

export interface Talk {
    talkIdx: string;
    turn: string;
    agentIdx: string;
    text: string;
}

export interface Vote {
    voteAgentIdx: string;
    targetAgentIdx: string;
}

export interface Execution {
    agentIdx: string;
    role: string;
}

export interface Divine {
    agentIdx: string;
    targetAgentIdx: string;
    result: string;
}

export interface Attack {
    agentIdx: string;
    isSuccessful: boolean;
}

export interface GameResult {
    villagers: string;
    werewolves: string;
    winSide: string;
}

export interface DayLog {
    status: Record<string, AgentStatus>;
    talks: Talk[];
    votes: Vote[];
    execution: Execution | null;
    divine: Divine | null;
    attackVotes: Vote[];
    attack: Attack | null;
    result: GameResult | null;
}