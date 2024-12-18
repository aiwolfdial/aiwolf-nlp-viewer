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
  export const dayStatuses: Record<string, DayStatus> = {};
</script>

<div class="day-column">
  <div class="day-section">
    <h2>
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
            <AgentName agentIdx={dayStatus.divine.agentIdx} highlight />
            が
            <AgentName agentIdx={dayStatus.divine.targetIdx} highlight />
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

<style>
  li {
    background-color: white;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius);
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  h2 {
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: var(--spacing-sm);
  }

  h3 {
    color: var(--color-secondary);
    margin-top: var(--spacing-md);
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  .over {
    opacity: var(--over-opacity);
  }

  .day-column {
    flex: 0 0 400px;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
    border-radius: var(--border-radius-lg);
  }

  .day-section {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    padding: var(--spacing-md);
  }

  .day-section > h2 {
    margin-top: 0;
    margin-bottom: 0;
  }

  .scrollable-content {
    flex-grow: 1;
    overflow-y: auto;
    padding-right: var(--spacing-sm);
  }

  li.agent01 {
    border-color: var(--color-agent01);
    border-width: var(--border-width-agent);
  }

  li.agent02 {
    border-color: var(--color-agent02);
    border-width: var(--border-width-agent);
  }

  li.agent03 {
    border-color: var(--color-agent03);
    border-width: var(--border-width-agent);
  }

  li.agent04 {
    border-color: var(--color-agent04);
    border-width: var(--border-width-agent);
  }

  li.agent05 {
    border-color: var(--color-agent05);
    border-width: var(--border-width-agent);
  }
</style>
