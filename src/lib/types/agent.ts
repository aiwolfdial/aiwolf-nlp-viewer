import { Species, type Role, type Status } from "$lib/constants/common";

export interface Packet {
    request: Request;
    info: Info | undefined;
    setting: Setting | undefined;
    talk_history: Talk[] | undefined;
    whisper_history: Talk[] | undefined;
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
            count_in_word: boolean | undefined;
            per_talk: number | undefined;
            mention_length: number | undefined;
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
            count_in_word: boolean | undefined;
            per_talk: number | undefined;
            mention_length: number | undefined;
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

export const DefaultProfileAvatars = {
    'ミナト': '/images/male/01.png',
    'タクミ': '/images/male/02.png',
    'ケンジ': '/images/male/03.png',
    'リュウジ': '/images/male/04.png',
    'ダイスケ': '/images/male/05.png',
    'シオン': '/images/male/06.png',
    'ベンジャミン': '/images/male/07.png',
    'トシオ': '/images/male/08.png',
    'ジョナサン': '/images/male/09.png',
    'シュンイチ': '/images/male/10.png',
    'ジョージ': '/images/male/11.png',
    'セルヴァス': '/images/male/12.png',
    'サクラ': '/images/female/01.png',
    'リン': '/images/female/02.png',
    'ユミ': '/images/female/03.png',
    'メイ': '/images/female/04.png',
    'ミサキ': '/images/female/05.png',
    'ミオ': '/images/female/06.png',
    'ミヅキ': '/images/female/07.png',
    'ミナコ': '/images/female/08.png',
    'アスカ': '/images/female/09.png',
    'ミドリ': '/images/female/10.png',
    'ヴィクトリア': '/images/female/11.png',
    'シズエ': '/images/female/12.png'
}