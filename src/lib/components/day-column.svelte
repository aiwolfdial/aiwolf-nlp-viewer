<script lang="ts">
  import {
    RoleMap,
    SpecieMap,
    StatusMap,
    TeamMap,
  } from "$lib/constants/translate";
  import type { DayStatus } from "$lib/types/aiwolf";
  import AgentName from "./agent-name.svelte";
  import FormatText from "./format-text.svelte";

  export let dayIdx: string;
  export let dayStatus: DayStatus;
  export let dayStatuses: Record<string, DayStatus>;
</script>

<div class="day-column">
  <div class="day-section">
    <h2 style="margin-bottom: 0">
      Day {dayIdx}
      {#if dayStatus.talks.length > 0}
        <iconify-icon inline icon="mdi:conversation"></iconify-icon>
      {/if}
      {#if dayStatus.votes.length > 0}
        <iconify-icon inline icon="mdi:vote"></iconify-icon>
      {/if}
      {#if dayStatus.execution}
        <iconify-icon inline icon="mdi:account-remove"></iconify-icon>
      {/if}
      {#if dayStatus.attackVotes.length > 0}
        <iconify-icon inline icon="mdi:vote"></iconify-icon>
      {/if}
      {#if dayStatus.attack}
        <iconify-icon inline icon="mdi:sword"></iconify-icon>
      {/if}
      {#if dayStatus.divine}
        <iconify-icon inline icon="mdi:account-eye"></iconify-icon>
      {/if}
      {#if dayStatus.result}
        <iconify-icon inline icon="mdi:trophy"></iconify-icon>
      {/if}
    </h2>
    <div class="scrollable-content">
      {#if Object.keys(dayStatus.agents).length > 0}
        <section class="agent-section">
          <h3>エージェント</h3>
          <ul>
            {#each Object.entries(dayStatus.agents) as [idx, status]}
              <li
                class:over={status.status !== "ALIVE"}
                class={"agent" + idx.padStart(2, "0")}
              >
                <AgentName agentIdx={idx} />
                {RoleMap[status.role as keyof typeof RoleMap] ?? "NULL"} -
                {StatusMap[status.status as keyof typeof StatusMap] ?? "NULL"}
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if dayStatus.talks.length > 0}
        <section class="talks-section">
          <h3>会話</h3>
          <ul class="talks">
            {#each dayStatus.talks as talk}
              <li
                class:over={talk.text === "Over"}
                class={"talk agent" + talk.agentIdx.padStart(2, "0")}
              >
                <AgentName agentIdx={talk.agentIdx} />
                <FormatText text={talk.text} />
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if dayStatus.votes.length > 0}
        <section class="votes-section">
          <h3>投票</h3>
          <ul>
            {#each dayStatus.votes as vote}
              <li class={"agent" + vote.agentIdx.padStart(2, "0")}>
                <AgentName agentIdx={vote.agentIdx} />
                が
                <AgentName agentIdx={vote.targetIdx} highlight />
                に投票
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if dayStatus.execution}
        <section class="execution-section">
          <h3>追放</h3>
          <p>
            <AgentName agentIdx={dayStatus.execution.agentIdx} highlight />
            を追放
          </p>
        </section>
      {/if}

      {#if dayStatus.attackVotes.length > 0}
        <section class="attack-votes-section">
          <h3>襲撃投票</h3>
          <ul>
            {#each dayStatus.attackVotes as vote}
              <li class={"agent" + vote.agentIdx.padStart(2, "0")}>
                <AgentName agentIdx={vote.agentIdx} />
                が
                <AgentName agentIdx={vote.targetIdx} highlight />
                に投票
              </li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if dayStatus.attack}
        <section class="attack-section">
          <h3>襲撃</h3>
          {#if dayStatus.attack.targetIdx !== "-1"}
            <p>
              <AgentName agentIdx={dayStatus.attack.targetIdx} highlight />
              を襲撃:
              <strong>
                {dayStatus.attack.isSuccessful ? "成功" : "失敗"}
              </strong>
            </p>
          {:else}
            <p>襲撃対象なし</p>
          {/if}
        </section>
      {/if}

      {#if dayStatus.divine}
        <section class="divine-section">
          <h3>占い</h3>
          <p>
            <AgentName agentIdx={dayStatus.divine.agentIdx} />
            が
            <AgentName agentIdx={dayStatus.divine.targetIdx} />
            を占い:
            <strong>
              {SpecieMap[dayStatus.divine.result as keyof typeof SpecieMap] ??
                "NULL"}
            </strong>
          </p>
        </section>
      {/if}

      {#if dayStatus.result}
        <section class="result-section">
          <h3>結果</h3>
          <p>
            <strong
              >{TeamMap[
                dayStatus.result.winSide as keyof typeof TeamMap
              ]}</strong
            >
            が勝利
          </p>
        </section>
      {/if}
    </div>
  </div>
</div>
