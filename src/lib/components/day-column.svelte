<script lang="ts">
  import { RoleMap, StatusMap } from "$lib/constants/translate";
  import type { DayLog } from "$lib/types/aiwolf";
  import { formatTalkText, getAgentName } from "$lib/utils/processor";

  export let day: string;
  export let dayLog: DayLog;
  export let processedLogs: Record<string, DayLog>;

  function agentColor(idx: string): string {
    switch (idx) {
      case "1":
        return "red";
      case "2":
        return "blue";
      case "3":
        return "green";
      case "4":
        return "yellow";
      case "5":
        return "purple";
      default:
        return "black";
    }
  }
</script>

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
                <strong>{getAgentName(processedLogs, day, idx)}</strong>
                {RoleMap[status.role as keyof typeof RoleMap] ?? "NULL"} -
                {StatusMap[status.status as keyof typeof StatusMap] ?? "NULL"}
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
                {getAgentName(processedLogs, day, dayLog.divine.agentIdx)} が
                {getAgentName(processedLogs, day, dayLog.divine.targetAgentIdx)}
                を占った結果:
                {dayLog.divine.result}
              </p>
            </div>
          {/if}

          {#if dayLog.attack}
            <div class="attack-section">
              <h3>襲撃結果</h3>
              <p>
                {getAgentName(processedLogs, day, dayLog.attack.agentIdx)} への襲撃:
                {dayLog.attack.isSuccessful ? "成功" : "失敗"}
              </p>
            </div>
          {/if}

          {#if dayLog.execution}
            <div class="execution-section">
              <h3>追放結果</h3>
              <p>
                {getAgentName(processedLogs, day, dayLog.execution.agentIdx)} が追放されました
                (役職: {RoleMap[
                  dayLog.execution.role as keyof typeof RoleMap
                ] ?? "NULL"})
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
              <strong>{getAgentName(processedLogs, day, talk.agentIdx)}</strong>
              {@html formatTalkText(talk.text)}
            </div>
          {/each}
        </div>
      </section>

      {#if dayLog.result}
        <section class="game-result-section">
          <h3>ゲーム結果</h3>
          <p>
            村人: {dayLog.result.villagers}人 人狼: {dayLog.result.werewolves}人
            勝利陣営: {dayLog.result.winSide}
          </p>
        </section>
      {/if}
    </div>
  </div>
</div>
