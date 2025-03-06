export interface Packet {
    request: Request;
    info: Info | undefined;
    setting: Setting | undefined;
    talkHistory: Talk[] | undefined;
    whisperHistory: Talk[] | undefined;
}

export enum Request {
    NAME = "NAME",
    TALK = "TALK",
    WHISPER = "WHISPER",
    VOTE = "VOTE",
    DIVINE = "DIVINE",
    GUARD = "GUARD",
    ATTACK = "ATTACK",
    INITIALIZE = "INITIALIZE",
    DAILY_INITIALIZE = "DAILY_INITIALIZE",
    DAILY_FINISH = "DAILY_FINISH",
    FINISH = "FINISH"
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
    statusMap: Record<string, Status> | undefined;
    roleMap: Record<string, Role> | undefined;
}

export interface Judge {
    day: number;
    agent: string;
    target: string;
    result: Species;
}

export enum Species {
    HUMAN = "HUMAN",
    WEREWOLF = "WEREWOLF",
}

export enum Status {
    ALIVE = "ALIVE",
    DEAD = "DEAD",
}

export enum Role {
    WEREWOLF = "WEREWOLF",
    POSSESSED = "POSSESSED",
    SEER = "SEER",
    BODYGUARD = "BODYGUARD",
    VILLAGER = "VILLAGER",
    MEDIUM = "MEDIUM"
}

export interface Vote {
    day: number;
    agent: string;
    target: string;
}

export interface Setting {
    playerNum: number;
    roleNumMap: Record<Role, number>;
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