<script lang="ts">
  interface AgentStatus {
    role: string;
    status: string;
    name: string;
  }

  interface Talk {
    talkIdx: string;
    turn: string;
    agentIdx: string;
    text: string;
  }

  interface Vote {
    voteAgentIdx: string;
    targetAgentIdx: string;
  }

  interface Execution {
    agentIdx: string;
    role: string;
  }

  interface Divine {
    agentIdx: string;
    targetAgentIdx: string;
    result: string;
  }

  interface Attack {
    agentIdx: string;
    isSuccessful: boolean;
  }

  interface GameResult {
    villagers: string;
    werewolves: string;
    winSide: string;
  }

  interface DayLog {
    status: Record<string, AgentStatus>;
    talks: Talk[];
    votes: Vote[];
    execution: Execution | null;
    divine: Divine | null;
    attackVotes: Vote[];
    attack: Attack | null;
    result: GameResult | null;
  }

  export let logData: string[] = [];
  let selectedFile: File | null = null;

  $: processedLogs = processLogs(logData);

  function handleFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    selectedFile = file ?? null;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) ?? "";
        logData = content.split("\n").filter((line) => line.trim());
      };
      reader.readAsText(file);
    }
  }

  function processLogs(logs: string[]): Record<string, DayLog> {
    const dayLogs: Record<string, DayLog> = {};

    logs.forEach((log) => {
      const [day, type, ...rest] = log.split(",");

      if (!dayLogs[day]) {
        dayLogs[day] = initializeDayLog();
      }

      processLogEntry(dayLogs[day], type, rest);
    });

    return dayLogs;
  }

  function initializeDayLog(): DayLog {
    return {
      status: {},
      talks: [],
      votes: [],
      execution: null,
      divine: null,
      attackVotes: [],
      attack: null,
      result: null,
    };
  }

  function processLogEntry(dayLog: DayLog, type: string, data: string[]): void {
    const handlers: Record<string, (data: string[]) => void> = {
      status: ([idx, role, status, name]) => {
        dayLog.status[idx] = { role, status, name };
      },
      talk: ([talkIdx, turn, agentIdx, text]) => {
        dayLog.talks.push({ talkIdx, turn, agentIdx, text });
      },
      vote: ([voteAgentIdx, targetAgentIdx]) => {
        dayLog.votes.push({ voteAgentIdx, targetAgentIdx });
      },
      execute: ([executedAgentIdx, executedRole]) => {
        dayLog.execution = { agentIdx: executedAgentIdx, role: executedRole };
      },
      divine: ([divineAgentIdx, divineTargetAgentIdx, divineResult]) => {
        dayLog.divine = {
          agentIdx: divineAgentIdx,
          targetAgentIdx: divineTargetAgentIdx,
          result: divineResult,
        };
      },
      attackVote: ([attackVoteAgentIdx, attackTargetAgentIdx]) => {
        dayLog.attackVotes.push({
          voteAgentIdx: attackVoteAgentIdx,
          targetAgentIdx: attackTargetAgentIdx,
        });
      },
      attack: ([attackedAgentIdx, isSuccessful]) => {
        dayLog.attack = {
          agentIdx: attackedAgentIdx,
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

  function getAgentName(day: string, agentIdx: string): string {
    const status = processedLogs[day]?.status[agentIdx];
    return status
      ? `Agent[${agentIdx}] (${status.name})`
      : `Agent[${agentIdx}]`;
  }

  function formatTalkText(text: string): string {
    const replyMatch = text.match(/>>Agent\[\d+\]/);
    return replyMatch
      ? text.replace(replyMatch[0], `<strong>${replyMatch[0]}</strong>`).trim()
      : text.trim();
  }
</script>

<svelte:head>
  <title>AIWolf Log Viewer</title>
</svelte:head>

<main>
  <div class="file-input">
    <input type="file" accept=".log" on:change={handleFileSelect} />
  </div>
  {#if selectedFile}
    <div class="werewolf-log-viewer">
      <div class="days-container">
        {#each Object.entries(processedLogs) as [day, dayLog]}
          <div class="day-column">
            <div class="day-section">
              <h2>Day {day}</h2>
              <div class="scrollable-content">
                {#if Object.keys(dayLog.status).length > 0}
                  <section class="status-section">
                    <h3>エージェント</h3>
                    <ul>
                      {#each Object.entries(dayLog.status) as [idx, status]}
                        <li class:over={status.status !== "ALIVE"}>
                          <strong>{getAgentName(day, idx)}</strong>
                          {status.role} -
                          {status.status === "ALIVE" ? "生存" : "死亡"}
                        </li>
                      {/each}
                    </ul>
                  </section>
                {/if}

                {#if dayLog.divine || dayLog.attack || dayLog.execution}
                  <section class="game-events">
                    {#if dayLog.divine}
                      <div class="divine-section">
                        <h3>占い結果</h3>
                        <p>
                          {getAgentName(day, dayLog.divine.agentIdx)} が
                          {getAgentName(day, dayLog.divine.targetAgentIdx)} を占った結果:
                          {dayLog.divine.result}
                        </p>
                      </div>
                    {/if}

                    {#if dayLog.attack}
                      <div class="attack-section">
                        <h3>襲撃結果</h3>
                        <p>
                          {getAgentName(day, dayLog.attack.agentIdx)} への襲撃:
                          {dayLog.attack.isSuccessful ? "成功" : "失敗"}
                        </p>
                      </div>
                    {/if}

                    {#if dayLog.execution}
                      <div class="execution-section">
                        <h3>追放結果</h3>
                        <p>
                          {getAgentName(day, dayLog.execution.agentIdx)} が追放されました
                          (役職: {dayLog.execution.role})
                        </p>
                      </div>
                    {/if}
                  </section>
                {/if}

                <section class="talks-section">
                  <h3>会話ログ</h3>
                  <div class="talks">
                    {#each dayLog.talks as talk}
                      <div class="talk" class:over={talk.text === "Over"}>
                        <strong>{getAgentName(day, talk.agentIdx)}</strong>
                        {@html formatTalkText(talk.text)}
                      </div>
                    {/each}
                  </div>
                </section>

                {#if dayLog.result}
                  <section class="game-result-section">
                    <h3>ゲーム結果</h3>
                    <p>
                      村人: {dayLog.result.villagers}人 人狼: {dayLog.result
                        .werewolves}人 勝利陣営: {dayLog.result.winSide}
                    </p>
                  </section>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</main>

<style lang="css">
  .werewolf-log-viewer {
    width: 100%;
    overflow-x: auto;
  }

  .days-container {
    display: flex;
    gap: 20px;
    padding: 20px;
  }

  .day-column {
    flex: 0 0 400px;
  }

  .scrollable-content {
    height: calc(100vh - 200px);
    overflow-y: auto;
    padding-right: 10px;
  }

  .file-input {
    margin-bottom: 20px;
  }

  .day-section {
    background-color: #f4f4f4;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
  }

  section {
    margin: 15px 0;
  }

  .talk {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .over {
    background-color: #f0f0f0;
    color: #666;
  }

  h2 {
    color: #333;
    border-bottom: 2px solid #666;
    padding-bottom: 10px;
  }

  h3 {
    color: #555;
    margin-top: 15px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    padding: 8px;
    margin-bottom: 5px;
  }
</style>
