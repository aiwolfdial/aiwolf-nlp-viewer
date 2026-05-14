import type { Agent, Packet } from '$lib/types/realtime';

interface GameLogAgent {
    idx: number;
    role: string;
    status: string;
    originalName: string;
    gameName: string;
}

export function convertGameLogToPackets(text: string, gameId?: string): Packet[] {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length === 0) return [];

    const id = gameId || 'game-log';
    const packets: Packet[] = [];
    let idx = 0;

    const agentsByDay: Record<number, Record<number, GameLogAgent>> = {};

    for (const line of lines) {
        const [dayStr, type, ...rest] = line.split(',');
        const day = parseInt(dayStr, 10);
        if (isNaN(day)) continue;

        if (type === 'status') {
            if (!agentsByDay[day]) agentsByDay[day] = {};
            const [agentIdx, role, status, originalName, gameName] = rest;
            agentsByDay[day][parseInt(agentIdx, 10)] = {
                idx: parseInt(agentIdx, 10),
                role,
                status,
                originalName,
                gameName,
            };
        }
    }

    function getAgentsForDay(day: number): Agent[] {
        const dayAgents = agentsByDay[day] || agentsByDay[0] || {};
        return Object.values(dayAgents).map((a) => ({
            idx: a.idx,
            team: a.originalName,
            name: a.gameName,
            profile: undefined,
            avatar: undefined,
            role: a.role,
            is_alive: a.status === 'ALIVE',
        }));
    }

    let currentDay = -1;
    let isDay = true;

    for (const line of lines) {
        const [dayStr, type, ...rest] = line.split(',');
        const day = parseInt(dayStr, 10);
        if (isNaN(day)) continue;

        if (day !== currentDay) {
            currentDay = day;
            isDay = true;
        }

        const agents = getAgentsForDay(day);

        switch (type) {
            case 'status':
                break;
            case 'talk': {
                const [, , agentIdx, ...textParts] = rest;
                const text = textParts.join(',');
                isDay = true;
                idx++;
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: true,
                    agents,
                    event: 'トーク',
                    message: text,
                    from_idx: undefined,
                    to_idx: undefined,
                    bubble_idx: parseInt(agentIdx, 10),
                });
                break;
            }
            case 'whisper': {
                const [, , agentIdx, ...textParts] = rest;
                const text = textParts.join(',');
                idx++;
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: isDay,
                    agents,
                    event: '囁き',
                    message: text,
                    from_idx: undefined,
                    to_idx: undefined,
                    bubble_idx: parseInt(agentIdx, 10),
                });
                break;
            }
            case 'vote': {
                const [fromIdx, toIdx] = rest;
                idx++;
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: true,
                    agents,
                    event: '投票',
                    message: undefined,
                    from_idx: parseInt(fromIdx, 10),
                    to_idx: parseInt(toIdx, 10),
                    bubble_idx: undefined,
                });
                break;
            }
            case 'execute': {
                const [executedIdx] = rest;
                idx++;
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: true,
                    agents,
                    event: '追放',
                    message: undefined,
                    from_idx: undefined,
                    to_idx: parseInt(executedIdx, 10),
                    bubble_idx: undefined,
                });
                break;
            }
            case 'divine': {
                const [seerIdx, targetIdx] = rest;
                isDay = false;
                idx++;
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: false,
                    agents,
                    event: '占い',
                    message: undefined,
                    from_idx: parseInt(seerIdx, 10),
                    to_idx: parseInt(targetIdx, 10),
                    bubble_idx: undefined,
                });
                break;
            }
            case 'guard': {
                const [guardIdx, targetIdx] = rest;
                isDay = false;
                idx++;
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: false,
                    agents,
                    event: '護衛',
                    message: undefined,
                    from_idx: parseInt(guardIdx, 10),
                    to_idx: parseInt(targetIdx, 10),
                    bubble_idx: undefined,
                });
                break;
            }
            case 'attackVote': {
                const [fromIdx, toIdx] = rest;
                isDay = false;
                idx++;
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: false,
                    agents,
                    event: '襲撃投票',
                    message: undefined,
                    from_idx: parseInt(fromIdx, 10),
                    to_idx: parseInt(toIdx, 10),
                    bubble_idx: undefined,
                });
                break;
            }
            case 'attack': {
                const [targetIdx, isSuccessful] = rest;
                isDay = false;
                idx++;
                const targetIdxNum = parseInt(targetIdx, 10);
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: false,
                    agents,
                    event: '襲撃',
                    message: undefined,
                    from_idx: isSuccessful === 'true' ? undefined : -1,
                    to_idx: targetIdxNum,
                    bubble_idx: undefined,
                });
                break;
            }
            case 'result': {
                const [, , winSide] = rest;
                idx++;
                packets.push({
                    id,
                    idx,
                    day,
                    is_day: true,
                    agents,
                    event: '終了',
                    message: winSide,
                    from_idx: undefined,
                    to_idx: undefined,
                    bubble_idx: undefined,
                });
                break;
            }
        }
    }

    if (packets.length === 0 && Object.keys(agentsByDay).length > 0) {
        const agents = getAgentsForDay(0);
        packets.push({
            id,
            idx: 1,
            day: 0,
            is_day: true,
            agents,
            event: '開始',
            message: 'ゲームが開始されました',
            from_idx: undefined,
            to_idx: undefined,
            bubble_idx: undefined,
        });
    }

    return packets;
}

interface JSONLogEntry {
    agent: string;
    request: string;
    request_timestamp?: number;
    response?: string;
    response_timestamp?: number;
    error?: string;
}

interface JSONLogData {
    game_id: string;
    win_side: string;
    agents: { idx: number; team: string; name: string; role: string }[];
    entries: JSONLogEntry[];
}

export function convertJSONLogToPackets(text: string): Packet[] {
    let data: JSONLogData;
    try {
        data = JSON.parse(text);
    } catch {
        return [];
    }

    if (!data.game_id || !data.agents || !data.entries) return [];

    const packets: Packet[] = [];
    let idx = 0;

    const agentNameToIdx: Record<string, number> = {};
    const agentIdxToRole: Record<number, string> = {};

    for (const agent of data.agents) {
        agentNameToIdx[agent.name] = agent.idx;
        agentIdxToRole[agent.idx] = agent.role;
    }

    const statusByDay: Record<number, Record<number, boolean>> = {};

    function buildAgents(day: number): Agent[] {
        return data.agents.map((a) => ({
            idx: a.idx,
            team: a.team,
            name: a.name,
            profile: undefined,
            avatar: undefined,
            role: a.role,
            is_alive: statusByDay[day]?.[a.idx] ?? true,
        }));
    }

    function parseStatusMap(statusMap: Record<string, string>, day: number) {
        if (!statusByDay[day]) statusByDay[day] = {};
        for (const [name, status] of Object.entries(statusMap)) {
            const agentIdx = agentNameToIdx[name];
            if (agentIdx !== undefined) {
                statusByDay[day][agentIdx] = status === 'ALIVE';
            }
        }
    }

    idx++;
    packets.push({
        id: data.game_id,
        idx,
        day: 0,
        is_day: true,
        agents: buildAgents(0),
        event: '開始',
        message: 'ゲームが開始されました',
        from_idx: undefined,
        to_idx: undefined,
        bubble_idx: undefined,
    });

    for (const entry of data.entries) {
        let request: any;
        try {
            request = JSON.parse(entry.request);
        } catch {
            continue;
        }

        const requestType = request.request;
        const info = request.info;
        const day = info?.day ?? 0;
        const agentName = entry.agent;
        const agentIdx = agentNameToIdx[agentName];

        if (info?.status_map) {
            parseStatusMap(info.status_map, day);
        }

        switch (requestType) {
            case 'TALK': {
                const response = entry.response;
                if (!response) break;
                idx++;
                packets.push({
                    id: data.game_id,
                    idx,
                    day,
                    is_day: true,
                    agents: buildAgents(day),
                    event: 'トーク',
                    message: response,
                    from_idx: undefined,
                    to_idx: undefined,
                    bubble_idx: agentIdx,
                });
                break;
            }
            case 'WHISPER': {
                const response = entry.response;
                if (!response) break;
                idx++;
                packets.push({
                    id: data.game_id,
                    idx,
                    day,
                    is_day: false,
                    agents: buildAgents(day),
                    event: '囁き',
                    message: response,
                    from_idx: undefined,
                    to_idx: undefined,
                    bubble_idx: agentIdx,
                });
                break;
            }
            case 'VOTE': {
                const response = entry.response;
                if (!response) break;
                const targetIdx = agentNameToIdx[response];
                if (targetIdx === undefined) break;
                idx++;
                packets.push({
                    id: data.game_id,
                    idx,
                    day,
                    is_day: true,
                    agents: buildAgents(day),
                    event: '投票',
                    message: undefined,
                    from_idx: agentIdx,
                    to_idx: targetIdx,
                    bubble_idx: undefined,
                });
                break;
            }
            case 'DIVINE': {
                const response = entry.response;
                if (!response) break;
                const targetIdx = agentNameToIdx[response];
                if (targetIdx === undefined) break;
                idx++;
                packets.push({
                    id: data.game_id,
                    idx,
                    day,
                    is_day: false,
                    agents: buildAgents(day),
                    event: '占い',
                    message: undefined,
                    from_idx: agentIdx,
                    to_idx: targetIdx,
                    bubble_idx: undefined,
                });
                break;
            }
            case 'GUARD': {
                const response = entry.response;
                if (!response) break;
                const targetIdx = agentNameToIdx[response];
                if (targetIdx === undefined) break;
                idx++;
                packets.push({
                    id: data.game_id,
                    idx,
                    day,
                    is_day: false,
                    agents: buildAgents(day),
                    event: '護衛',
                    message: undefined,
                    from_idx: agentIdx,
                    to_idx: targetIdx,
                    bubble_idx: undefined,
                });
                break;
            }
            case 'ATTACK_VOTE': {
                const response = entry.response;
                if (!response) break;
                const targetIdx = agentNameToIdx[response];
                if (targetIdx === undefined) break;
                idx++;
                packets.push({
                    id: data.game_id,
                    idx,
                    day,
                    is_day: false,
                    agents: buildAgents(day),
                    event: '襲撃投票',
                    message: undefined,
                    from_idx: agentIdx,
                    to_idx: targetIdx,
                    bubble_idx: undefined,
                });
                break;
            }
        }
    }

    if (data.win_side && data.win_side !== 'T_NONE') {
        const lastDay = packets.length > 0 ? packets[packets.length - 1].day : 0;
        idx++;
        packets.push({
            id: data.game_id,
            idx,
            day: lastDay,
            is_day: true,
            agents: buildAgents(lastDay),
            event: '終了',
            message: data.win_side,
            from_idx: undefined,
            to_idx: undefined,
            bubble_idx: undefined,
        });
    }

    return packets;
}

export function detectLogFormat(text: string): 'jsonl' | 'json' | 'gamelog' | 'unknown' {
    const trimmed = text.trim();

    if (trimmed.startsWith('{') && !trimmed.includes('\n')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (parsed.game_id && parsed.entries) return 'json';
            if (parsed.id && parsed.idx !== undefined) return 'jsonl';
        } catch { /* not single-line JSON */ }
    }

    if (trimmed.startsWith('{')) {
        try {
            const parsed = JSON.parse(trimmed);
            if (parsed.game_id && parsed.entries) return 'json';
        } catch { /* not JSON object */ }
    }

    const lines = trimmed.split('\n');
    if (lines.length > 0) {
        const firstLine = lines[0].trim();

        if (firstLine.startsWith('{')) {
            try {
                const parsed = JSON.parse(firstLine);
                if (parsed.id !== undefined && parsed.idx !== undefined) return 'jsonl';
                if (parsed.game_id && parsed.entries) return 'json';
            } catch { /* not JSONL */ }
        }

        if (/^\d+,(status|talk|whisper|vote|execute|divine|guard|attackVote|attack|result),/.test(firstLine)) {
            return 'gamelog';
        }
    }

    return 'unknown';
}
