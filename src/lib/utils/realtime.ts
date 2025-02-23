import { IdxToText } from "$lib/constants/translate";
import type { Agent } from "$lib/types/realtime";

export function initializeAgents(length: number): Agent[] {
    return Array.from({ length: length }, (_, i) => ({
        idx: i + 1,
        name: IdxToText(i + 1),
        role: "",
        isAlive: true,
        targetIdxs: [],
        isBubble: false,
    }));
}