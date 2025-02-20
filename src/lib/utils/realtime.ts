import { IdxToText } from "$lib/constants/translate";
import type { ReAgent } from "$lib/types/realtime";

export function initializeAgents(length: number): ReAgent[] {
    return Array.from({ length: length }, (_, i) => ({
        idx: i + 1,
        label: IdxToText(i + 1),
        disabled: false,
        targets: [
            // {
            //     targetIdx: 3,
            //     color: "#FF6368AA",
            // },
        ],
        center: false,
    }));
}