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

export enum Teams {
    VILLAGER = "VILLAGER",
    WEREWOLF = "WEREWOLF",
}

export const TeamsJA = {
    VILLAGER: "村人陣営",
    WEREWOLF: "人狼陣営",
}

export const RoleToSpecies: Record<Role, Species> = {
    WEREWOLF: Species.WEREWOLF,
    POSSESSED: Species.HUMAN,
    SEER: Species.HUMAN,
    BODYGUARD: Species.HUMAN,
    VILLAGER: Species.HUMAN,
    MEDIUM: Species.HUMAN
}

export function IdxToName(idx: number | string) {
    return `Agent[${idx.toString().padStart(2, "0")}]`
}
