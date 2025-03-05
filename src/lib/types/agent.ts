export interface Packet {
    request: string;
    info: Info | undefined;
    setting: Setting | undefined;
    talkHistory: Talk[] | undefined;
    whisperHistory: Talk[] | undefined;
}

export interface Info {
    day: number;
    agent: string | undefined;
    mediumResult: Judge | undefined;
    divineResult: Judge | undefined;
    executedAgent: string | undefined;
    attackedAgent: string | undefined;
    voteList: Vote[] | undefined;
    attackVoteList: Vote[] | undefined;
    statusMap: Record<string, string> | undefined;
    roleMap: Record<string, string> | undefined;
}

export interface Judge {
    day: number;
    agent: string;
    target: string;
    result: string;
}

export interface Vote {
    day: number;
    agent: string;
    target: string;
}

export interface Setting {
    playerNum: number;
    roleNumMap: Record<string, number>;
    maxTalk: number;
    maxTalkTurn: number;
    maxWhisper: number;
    maxWhisperTurn: number;
    maxSkip: number;
    isEnabledNoAttack: boolean;
    isVoteVisible: boolean;
    isTalkOnFirstDay: boolean;
    responseTimeout: number;
    actionTimeout: number;
    maxRevote: number;
    maxAttackRevote: number;
}

export interface Talk {
    idx: number;
    day: number;
    turn: number;
    agent: string;
    text: string;
    skip: boolean;
    over: boolean;
}