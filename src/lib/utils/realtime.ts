import { IdxToName } from "$lib/constants/common";
import type { Agent, Packet } from "$lib/types/realtime";
import type { Agent as SettingsAgent } from "$lib/types/realtime-settings";

export function initializeAgents(length: number): Agent[] {
    return Array.from({ length }, (_, i) => createDefaultAgent(i + 1));
}

function createDefaultAgent(idx: number): Agent {
    return {
        idx,
        team: "Undefined",
        name: IdxToName(idx),
        profile: undefined,
        avatar: undefined,
        role: "Undefined",
        is_alive: true,
    };
}

export function IdxToCustomName(
    agent: SettingsAgent | undefined,
    packet: Packet,
    idx: number | undefined
): string {
    if (idx === undefined) return "該当なし";

    const packetAgent = packet.agents.find((a) => a.idx === idx);
    if (!packetAgent) return "該当なし";

    const values: (string | undefined)[] = [];

    if (agent?.name) {
        values.push(packetAgent.name);
    }
    if (agent?.team) {
        values.push(packetAgent.team);
    }
    if (agent?.role) {
        values.push(packetAgent.role);
    }

    return values.filter(Boolean).join(" ");
}

export function xor(a: boolean, b: boolean): boolean {
    return (a || b) && !(a && b);
}
