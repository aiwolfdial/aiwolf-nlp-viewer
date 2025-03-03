export const RoleMap = {
    "VILLAGER": "村人",
    "SEER": "占い師",
    "MEDIUM": "霊能者",
    "BODYGUARD": "騎士",
    "WEREWOLF": "人狼",
    "POSSESSED": "狂人",
}

export const StatusMap = {
    "ALIVE": "生存",
    "DEAD": "死亡",
}

export const SpecieMap = {
    "HUMAN": "人間",
    "WEREWOLF": "人狼",
}

export const TeamMap = {
    "VILLAGER": "村人陣営",
    "WEREWOLF": "人狼陣営",
}

export const RoleToSpeciesMap = {
    "VILLAGER": "HUMAN",
    "SEER": "HUMAN",
    "MEDIUM": "HUMAN",
    "BODYGUARD": "HUMAN",
    "WEREWOLF": "WEREWOLF",
    "POSSESSED": "HUMAN",
}

export const ReplaceWords = { "kanolab1": "[チーム名]" }

export function IdxToName(idx: number | string) {
    return `Agent[${idx.toString().padStart(2, "0")}]`
}

export function RoleToSpecieText(role: string | undefined) {
    if (!role) return "不明";
    return SpecieMap[
        RoleToSpeciesMap[
        role as keyof typeof RoleToSpeciesMap
        ] as keyof typeof SpecieMap
    ];
}