import { IdxToName, Role, Species, Status, Teams } from '$lib/constants/common';
import type { DayStatus } from '$lib/types/archive';


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
                originalName,
                gameName: gameName || IdxToName(idx)
            };
        },
        talk: ([talkIdx, turn, agentIdx, text]) => {
            dayLog.talks.push({ talkIdx, turnIdx: turn, agentIdx, text });
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
        whisper: ([talkIdx, turn, agentIdx, text]) => {
            const whisperEntry = { talkIdx, turnIdx: turn, agentIdx, text };
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