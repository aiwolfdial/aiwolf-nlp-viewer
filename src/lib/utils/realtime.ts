import { IdxToName } from "$lib/constants/translate";
import type { Agent, Packet } from "$lib/types/realtime";
import type { Agent as SettingsAgent } from "$lib/types/realtime-settings";

export function initializeAgents(length: number): Agent[] {
    return Array.from({ length: length }, (_, i) => ({
        idx: i + 1,
        team: "Undefined",
        name: IdxToName(i + 1),
        role: "Undefined",
        isAlive: true,
        targetIdxs: [],
        isBubble: false,
    }));
}

export function IdxToCustomName(agent: SettingsAgent | undefined, packet: Packet, idx: number | undefined) {
    if (idx === undefined) return "該当なし";
    let values = [];
    if (agent?.name) {
        values.push(IdxToName(idx));
    }
    if (agent?.team) {
        values.push(packet.agents.find((agent) => agent.idx === idx)?.team);
    }
    if (agent?.role) {
        values.push(packet.agents.find((agent) => agent.idx === idx)?.role);
    }
    return values.join(" ");
}

export function xor(a: boolean, b: boolean) {
    return (a || b) && !(a && b);
}