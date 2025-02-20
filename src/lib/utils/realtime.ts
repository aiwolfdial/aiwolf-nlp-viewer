import type { ReAgent } from "$lib/types/realtime";

export function initializeAgents(length: number): ReAgent[] {
    return Array.from({ length: length }, (_, i) => ({
        idx: i + 1,
        label: `Agent[${(i + 1).toString().padStart(2, "0")}]`,
        disabled: false,
        targets: [
            {
                targetIdx: 3,
                color: "#FF6368AA",
            },
        ],
        center: false,
    }));
}