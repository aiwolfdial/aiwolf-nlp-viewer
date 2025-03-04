<script lang="ts">
  import {
    RoleMap,
    SpecieMap,
    StatusMap,
    TeamMap,
  } from "$lib/constants/translate";
  import type { DayStatus } from "$lib/types/archive";
  import AgentName from "./AgentName.svelte";
  import FormatText from "./FormatText.svelte";

  let { dayIdx = "", dayStatus = {} as DayStatus } = $props();
</script>

<div class="flex-[0_0_400px] rounded-lg bg-base-200">
  <div class="flex flex-col h-full p-4">
    <h2 class="text-xl font-bold pb-2">
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
    <div class="grow overflow-y-auto pr-4">
      {#if Object.keys(dayStatus.agents).length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">エージェント</h3>
          <ul>
            {#each Object.entries(dayStatus.agents) as [idx, status]}
              <li
                class={"p-2 my-2 border-4 rounded-md agent" +
                  idx.padStart(2, "0")}
                class:opacity-25={status.status !== "ALIVE"}
              >
                <AgentName agentIdx={idx} />
                {RoleMap[status.role as keyof typeof RoleMap] ?? "NULL"} -
                {StatusMap[status.status as keyof typeof StatusMap] ?? "NULL"}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.talks.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">会話</h3>
          <ul>
            {#each dayStatus.talks as talk}
              <li
                class:opacity-25={talk.text === "Over"}
                class={"p-2 my-2 border-4 rounded-md agent" +
                  talk.agentIdx.padStart(2, "0")}
              >
                <AgentName agentIdx={talk.agentIdx} />
                <FormatText text={talk.text} />
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.votes.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">投票</h3>
          <ul>
            {#each dayStatus.votes as vote}
              <li
                class={"p-2 my-2 border-4 rounded-md agent" +
                  vote.agentIdx.padStart(2, "0")}
              >
                <AgentName agentIdx={vote.agentIdx} />
                が
                <AgentName agentIdx={vote.targetIdx} highlight />
                に投票
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.execution}
        <div>
          <h3 class="text-lg font-bold my-2">追放</h3>
          <p>
            <AgentName agentIdx={dayStatus.execution.agentIdx} highlight />
            を追放
          </p>
        </div>
      {/if}
      {#if dayStatus.attackVotes.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">襲撃投票</h3>
          <ul>
            {#each dayStatus.attackVotes as vote}
              <li
                class={"p-2 my-2 border-4 rounded-md agent" +
                  vote.agentIdx.padStart(2, "0")}
              >
                <AgentName agentIdx={vote.agentIdx} />
                が
                <AgentName agentIdx={vote.targetIdx} highlight />
                に投票
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.attack}
        <div>
          <h3 class="text-lg font-bold my-2">襲撃</h3>
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
        </div>
      {/if}
      {#if dayStatus.divine}
        <div>
          <h3 class="text-lg font-bold my-2">占い</h3>
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
        </div>
      {/if}
      {#if dayStatus.result}
        <div>
          <h3 class="text-lg font-bold my-2">結果</h3>
          <p>
            <strong
              >{TeamMap[
                dayStatus.result.winSide as keyof typeof TeamMap
              ]}</strong
            >
            が勝利
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :root {
    --color-agent01: #942d40;
    --color-agent02: #ec754f;
    --color-agent03: #bcdaf2;
    --color-agent04: #062d68;
    --color-agent05: #ebdf83;
  }

  li.agent01 {
    border-color: var(--color-agent01);
  }

  li.agent02 {
    border-color: var(--color-agent02);
  }

  li.agent03 {
    border-color: var(--color-agent03);
  }

  li.agent04 {
    border-color: var(--color-agent04);
  }

  li.agent05 {
    border-color: var(--color-agent05);
  }
</style>
