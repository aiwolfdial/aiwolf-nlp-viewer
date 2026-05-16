import { IdxToName, Role, Species, Status, Teams } from '$lib/constants/common';
import type { DayStatus, Talk } from '$lib/types/archive';


export function processArchiveLog(data: string): Record<string, DayStatus> {
    const lines = data.split(/\r?\n/).filter((line) => line.trim());
    const result: Record<string, DayStatus> = {};

    lines.forEach((log) => {
        const [day, type, ...rest] = log.split(",");
        if (!result[day]) {
            result[day] = initializeDayLog();
        }
        processLogEntry(result[day], type, rest);
    });

    return result;
}

function initializeDayLog(): DayStatus {
    return {
        agents: {},
        beforeWhisper: [],
        talks: [],
        votes: [],
        execution: null,
        divine: null,
        afterWhisper: [],
        guard: null,
        attackVotes: [],
        attack: null,
        result: null,
    };
}

function looksLikeUnixTimestampToken(s: string): boolean {
    return /^\d{10,13}$/.test(s);
}

function parseTalkWithUnixTimestamp(data: string[]): Talk | null {
    if (data.length < 4) return null;

    const talkIdx = data[0];
    const turnIdx = data[1];
    const agentIdx = data[2];

    if (data.length === 4) {
        return { talkIdx, turnIdx, agentIdx, text: data[3] };
    }

    const last = data[data.length - 1];
    if (looksLikeUnixTimestampToken(last)) {
        return {
            talkIdx,
            turnIdx,
            agentIdx,
            text: data.slice(3, -1).join(","),
            timestamp: last,
        }
    }
    return { talkIdx, turnIdx, agentIdx, text: data[3] };
}

function processLogEntry(dayLog: DayStatus, type: string, data: string[]): void {
    const handlers = createLogHandlers(dayLog);
    const handler = handlers[type];
    if (handler) {
        handler(data);
    }
}

function createLogHandlers(dayLog: DayStatus): Record<string, (data: string[]) => void> {
    return {
        status: ([idx, role, status, originalName, gameName]) => {
            dayLog.agents[idx] = {
                role: Role[role as keyof typeof Role],
                status: Status[status as keyof typeof Status],
                originalName: originalName || "",
                gameName: gameName || IdxToName(idx)
            };
        },
        talk: (data: string[]) => {
            const talkEntry = parseTalkWithUnixTimestamp(data);
            if (!talkEntry) return;
            dayLog.talks.push(talkEntry);
        },
        vote: ([voteAgentIdx, targetAgentIdx]) => {
            dayLog.votes.push({ agentIdx: voteAgentIdx, targetIdx: targetAgentIdx });
        },
        execute: ([executedAgentIdx, executedRole]) => {
            dayLog.execution = {
                agentIdx: executedAgentIdx,
                role: Role[executedRole as keyof typeof Role]
            };
        },
        divine: ([divineAgentIdx, divineTargetAgentIdx, divineResult]) => {
            dayLog.divine = {
                agentIdx: divineAgentIdx,
                targetIdx: divineTargetAgentIdx,
                result: Species[divineResult as keyof typeof Species],
            };
        },
        whisper: (data: string[]) => {
            const whisperEntry = parseTalkWithUnixTimestamp(data);
            if (!whisperEntry) return;
            if (dayLog.talks.length > 0) {
                dayLog.afterWhisper.push(whisperEntry);
            } else {
                dayLog.beforeWhisper.push(whisperEntry);
            }
        },
        guard: ([agentIdx, targetIdx, result]) => {
            dayLog.guard = { agentIdx, targetIdx, result };
        },
        attackVote: ([attackVoteAgentIdx, attackTargetAgentIdx]) => {
            dayLog.attackVotes.push({
                agentIdx: attackVoteAgentIdx,
                targetIdx: attackTargetAgentIdx,
            });
        },
        attack: ([attackedAgentIdx, isSuccessful]) => {
            dayLog.attack = {
                targetIdx: attackedAgentIdx,
                result: isSuccessful === "true",
            };
        },
        result: ([villagers, werewolves, winSide]) => {
            dayLog.result = {
                villagers,
                werewolves,
                winSide: Teams[winSide as keyof typeof Teams]
            };
        },
    };
}
export function getColorFromName(name: string): string {
    const hash = calculateStringHash(name);
    const h = Math.abs(hash) % 360;
    const s = 85 + (hash % 10);
    const l = 60 + (hash % 10);
    return `hsla(${h}, ${s}%, ${l}%, 0.7)`;
}

function calculateStringHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}