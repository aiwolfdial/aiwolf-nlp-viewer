import { IdxToName } from '$lib/constants/translate';
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
    const handlers: Record<string, (data: string[]) => void> = {
        status: ([idx, role, status, originalName, gameName]) => {
            dayLog.agents[idx] = { role, status, originalName, gameName: gameName || IdxToName(idx) };
        },
        talk: ([talkIdx, turn, agentIdx, text]) => {
            dayLog.talks.push({ talkIdx, turnIdx: turn, agentIdx, text });
        },
        vote: ([voteAgentIdx, targetAgentIdx]) => {
            dayLog.votes.push({ agentIdx: voteAgentIdx, targetIdx: targetAgentIdx });
        },
        execute: ([executedAgentIdx, executedRole]) => {
            dayLog.execution = { agentIdx: executedAgentIdx, role: executedRole };
        },
        divine: ([divineAgentIdx, divineTargetAgentIdx, divineResult]) => {
            dayLog.divine = {
                agentIdx: divineAgentIdx,
                targetIdx: divineTargetAgentIdx,
                result: divineResult,
            };
        },
        whisper: ([talkIdx, turn, agentIdx, text]) => {
            if (dayLog.talks.length > 0) {
                dayLog.afterWhisper.push({ talkIdx: talkIdx, turnIdx: turn, agentIdx, text });
            } else {
                dayLog.beforeWhisper.push({ talkIdx: talkIdx, turnIdx: turn, agentIdx, text });
            }
        },
        guard: ([agentIdx, targetIdx, result]) => {
            dayLog.guard = { agentIdx: agentIdx, targetIdx: targetIdx, result: result }
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
                isSuccessful: isSuccessful === "true",
            };
        },
        result: ([villagers, werewolves, winSide]) => {
            dayLog.result = { villagers, werewolves, winSide };
        },
    };

    const handler = handlers[type];
    if (handler) {
        handler(data);
    }
}
export function getColorFromName(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    const s = 85 + (hash % 10);
    const l = 60 + (hash % 10);
    return `hsla(${h}, ${s}%, ${l}%, 0.7)`;
}