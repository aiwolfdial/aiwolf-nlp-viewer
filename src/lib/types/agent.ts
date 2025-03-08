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

export const RequestJA = {
    NAME: "名前",
    TALK: "トーク",
    WHISPER: "囁き",
    VOTE: "投票",
    DIVINE: "占い",
    GUARD: "護衛",
    ATTACK: "襲撃",
    INITIALIZE: "ゲーム開始",
    DAILY_INITIALIZE: "昼開始",
    DAILY_FINISH: "昼終了",
    FINISH: "ゲーム終了"
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

export const SpeciesJA = {
    HUMAN: "人間",
    WEREWOLF: "人狼",
}

export enum Status {
    ALIVE = "ALIVE",
    DEAD = "DEAD",
}

export const StatusJA = {
    ALIVE: "生存",
    DEAD: "死亡",
}

export enum Role {
    WEREWOLF = "WEREWOLF",
    POSSESSED = "POSSESSED",
    SEER = "SEER",
    BODYGUARD = "BODYGUARD",
    VILLAGER = "VILLAGER",
    MEDIUM = "MEDIUM"
}

export const RoleJA = {
    WEREWOLF: "人狼",
    POSSESSED: "狂人",
    SEER: "占い師",
    BODYGUARD: "騎士",
    VILLAGER: "村人",
    MEDIUM: "霊媒師"
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