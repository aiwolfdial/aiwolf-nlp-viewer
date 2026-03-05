/**
 * ゲームイベントの種類
 */
export type EventType =
    | "未接続"
    | "トーク"
    | "囁き"
    | "襲撃投票"
    | "投票"
    | "追放"
    | "襲撃"
    | "占い"
    | "護衛"
    | "終了";

/**
 * エージェントの役職
 */
export type Role = "WEREWOLF" | "VILLAGER" | "SEER" | "BODYGUARD" | "POSSESSED";

/**
 * ゲームパケット（イベント情報）
 */
export interface Packet {
    id: string;
    idx: number;
    day: number;
    is_day: boolean;
    agents: Agent[];
    event: EventType;
    message: string | undefined;
    from_idx: number | undefined;
    to_idx: number | undefined;
    bubble_idx: number | undefined;
}

/**
 * エージェント情報
 */
export interface Agent {
    idx: number;
    team: string;
    name: string;
    profile: string | undefined;
    avatar: string | undefined;
    role: string;
    is_alive: boolean;
}
