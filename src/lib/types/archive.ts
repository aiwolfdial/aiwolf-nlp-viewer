export interface ArAgent {
    role: string;
    status: string;
    name: string;
}

export interface ArTalk {
    talkIdx: string;
    turnIdx: string;
    agentIdx: string;
    text: string;
}

export interface ArVote {
    agentIdx: string;
    targetIdx: string;
}

export interface ArExecution {
    agentIdx: string;
    role: string;
}

export interface ArDivine {
    agentIdx: string;
    targetIdx: string;
    result: string;
}

export interface ArAttack {
    targetIdx: string;
    isSuccessful: boolean;
}

export interface ArResult {
    villagers: string;
    werewolves: string;
    winSide: string;
}

export interface ArDayStatus {
    agents: Record<string, ArAgent>;
    talks: ArTalk[];
    votes: ArVote[];
    execution: ArExecution | null;
    divine: ArDivine | null;
    attackVotes: ArVote[];
    attack: ArAttack | null;
    result: ArResult | null;
}