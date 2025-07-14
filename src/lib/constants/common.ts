export enum Role {
    WEREWOLF = "WEREWOLF",
    POSSESSED = "POSSESSED",
    SEER = "SEER",
    BODYGUARD = "BODYGUARD",
    VILLAGER = "VILLAGER",
    MEDIUM = "MEDIUM"
}

export enum Species {
    HUMAN = "HUMAN",
    WEREWOLF = "WEREWOLF",
}

export enum Status {
    ALIVE = "ALIVE",
    DEAD = "DEAD",
}

export enum Teams {
    VILLAGER = "VILLAGER",
    WEREWOLF = "WEREWOLF",
}

export const RoleToSpecies: Record<Role, Species> = {
    WEREWOLF: Species.WEREWOLF,
    POSSESSED: Species.HUMAN,
    SEER: Species.HUMAN,
    BODYGUARD: Species.HUMAN,
    VILLAGER: Species.HUMAN,
    MEDIUM: Species.HUMAN
}

export function IdxToName(idx: number | string): string {
    return `Agent[${idx.toString().padStart(2, "0")}]`;
}
