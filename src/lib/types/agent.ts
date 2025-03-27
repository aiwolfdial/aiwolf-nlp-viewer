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
    game_id: string;
    day: number;
    agent: string;
    profile: string | undefined;
    medium_result: Judge | undefined;
    divine_result: Judge | undefined;
    executed_agent: string | undefined;
    attacked_agent: string | undefined;
    vote_list: Vote[] | undefined;
    attack_vote_list: Vote[] | undefined;
    status_map: Record<string, Status>;
    role_map: Record<string, Role>;
    remain_count: number | undefined;
    remain_length: number | undefined;
    remain_skip: number | undefined;
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
    agent_count: number;
    role_num_map: Record<Role, number>;
    vote_visibility: boolean;
    talk_on_first_day: boolean;
    talk: {
        max_count: {
            per_agent: number;
            per_day: number;
        }
        max_length: {
            per_talk: number | undefined;
            per_agent: number | undefined;
            base_length: number | undefined;
        }
        max_skip: number;
    }
    whisper: {
        max_count: {
            per_agent: number;
            per_day: number;
        }
        max_length: {
            per_talk: number | undefined;
            per_agent: number | undefined;
            base_length: number | undefined;
        }
        max_skip: number;
    }
    vote: {
        max_count: number;
    }
    attack_vote: {
        max_count: number;
        allow_no_target: boolean;
    }
    timeout: {
        action: number;
        response: number;
    }
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