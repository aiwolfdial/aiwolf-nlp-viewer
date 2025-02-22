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

export const ReplaceWords = { "kanolab1": "[チーム名]" }

export const ActionMap = {
    "execute": "追放されました",
    "attack": "襲撃されました",
    "divine": "占いました",
    "guard": "護衛しました",
    "vote": "投票しました",
    "attackVote": "襲撃投票しました",
    "talk": "発言しました",
    "whisper": "囁きました",
}

export const ActionPrefixMap = {
    "execute": "が",
    "attack": "が",
    "divine": "を",
    "guard": "を",
    "vote": "に",
    "attackVote": "に",
}

export function IdxToText(idx: number | string) {
    return `Agent[${idx.toString().padStart(2, "0")}]`
}