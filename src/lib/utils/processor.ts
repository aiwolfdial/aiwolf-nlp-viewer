import type { DayStatus } from '$lib/types/aiwolf';

export function processLogs(logs: string[]): Record<string, DayStatus> {
    const dayLogs: Record<string, DayStatus> = {};

    logs.forEach((log) => {
        const [day, type, ...rest] = log.split(",");

        if (!dayLogs[day]) {
            dayLogs[day] = initializeDayLog();
        }

        processLogEntry(dayLogs[day], type, rest);
    });

    return dayLogs;
}

function initializeDayLog(): DayStatus {
    return {
        agents: {},
        talks: [],
        votes: [],
        execution: null,
        divine: null,
        attackVotes: [],
        attack: null,
        result: null,
    };
}

function processLogEntry(dayLog: DayStatus, type: string, data: string[]): void {
    const handlers: Record<string, (data: string[]) => void> = {
        status: ([idx, role, status, name]) => {
            dayLog.agents[idx] = { role, status, name };
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

export function getAgentName(processedLogs: Record<string, DayStatus>, day: string, agentIdx: string): string {
    const status = processedLogs[day]?.agents[agentIdx];
    return status && false
        ? `Agent[${agentIdx}] (${status.name})`
        : `Agent[${agentIdx}]`;
}

export function formatTalkText(text: string): string {
    const replyMatch = text.match(/>>Agent\[\d+\]/);
    return replyMatch
        ? text.replace(replyMatch[0], `<strong>${replyMatch[0]}</strong>`).trim()
        : text.trim();
}
