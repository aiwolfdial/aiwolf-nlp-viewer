<script lang="ts">
  import {
    RoleMap,
    SpecieMap,
    StatusMap,
    TeamMap,
  } from "$lib/constants/translate";
  import type { DayStatus } from "$lib/types/archive";
  import { getColorFromName } from "$lib/utils/archive";
  import AgentName from "./AgentName.svelte";
  import FormatText from "./FormatText.svelte";

  let { dayIdx = "", dayStatus = {} as DayStatus } = $props();
</script>

<div class="flex-[0_0_400px] rounded-lg bg-base-200">
  <div class="flex flex-col h-full p-4">
    <h2 class="text-xl font-bold pb-2">
      Day {dayIdx}
      {#if dayStatus.beforeWhisper.length > 0}
        <iconify-icon inline icon="mdi:conversation-outline"></iconify-icon>
      {/if}
      {#if dayStatus.talks.length > 0}
        <iconify-icon inline icon="mdi:conversation"></iconify-icon>
      {/if}
      {#if dayStatus.votes.length > 0}
        <iconify-icon inline icon="mdi:vote"></iconify-icon>
      {/if}
      {#if dayStatus.execution}
        <iconify-icon inline icon="mdi:exit-run"></iconify-icon>
      {/if}
      {#if dayStatus.divine}
        <iconify-icon inline icon="mdi:eye"></iconify-icon>
      {/if}
      {#if dayStatus.afterWhisper.length > 0}
        <iconify-icon inline icon="mdi:conversation-outline"></iconify-icon>
      {/if}
      {#if dayStatus.attackVotes.length > 0}
        <iconify-icon inline icon="mdi:vote"></iconify-icon>
      {/if}
      {#if dayStatus.guard}
        <iconify-icon inline icon="mdi:shield-account"></iconify-icon>
      {/if}
      {#if dayStatus.attack}
        <iconify-icon inline icon="mdi:sword"></iconify-icon>
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
            {#each Object.entries(dayStatus.agents) as [_, status]}
              <li
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(status.gameName)}`}
                class:opacity-25={status.status !== "ALIVE"}
              >
                <AgentName text={status.gameName} key={status.gameName} />
                {RoleMap[status.role as keyof typeof RoleMap] ?? ""} -
                {StatusMap[status.status as keyof typeof StatusMap] ?? ""}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.beforeWhisper.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">囁き</h3>
          <ul>
            {#each dayStatus.beforeWhisper as whisper}
              <li
                class:opacity-25={whisper.text === "Over"}
                style={`border-color: ${getColorFromName(dayStatus.agents[whisper.agentIdx].gameName)}`}
                class="p-2 my-2 border-4 rounded-md"
              >
                <AgentName text={dayStatus.agents[whisper.agentIdx].gameName} />
                <FormatText
                  text={whisper.text}
                  names={Object.values(dayStatus.agents).map(
                    (agent) => agent.gameName
                  )}
                />
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.talks.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">トーク</h3>
          <ul>
            {#each dayStatus.talks as talk}
              <li
                class:opacity-25={talk.text === "Over"}
                style={`border-color: ${getColorFromName(dayStatus.agents[talk.agentIdx].gameName)}`}
                class="p-2 my-2 border-4 rounded-md"
              >
                <AgentName text={dayStatus.agents[talk.agentIdx].gameName} />
                <FormatText
                  text={talk.text}
                  names={Object.values(dayStatus.agents).map(
                    (agent) => agent.gameName
                  )}
                />
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
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(dayStatus.agents[vote.agentIdx].gameName)}`}
              >
                <AgentName text={dayStatus.agents[vote.agentIdx].gameName} />
                が
                <AgentName
                  text={dayStatus.agents[vote.targetIdx].gameName}
                  highlight
                />
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
            <AgentName
              text={dayStatus.agents[dayStatus.execution.agentIdx].gameName}
              highlight
            />
            を追放
          </p>
        </div>
      {/if}
      {#if dayStatus.divine}
        <div>
          <h3 class="text-lg font-bold my-2">占い</h3>
          <p>
            <AgentName
              text={dayStatus.agents[dayStatus.divine.agentIdx].gameName}
            />
            が
            <AgentName
              text={dayStatus.agents[dayStatus.divine.targetIdx].gameName}
              highlight
            />
            を占い:
            <strong>
              {SpecieMap[dayStatus.divine.result as keyof typeof SpecieMap] ??
                ""}
            </strong>
          </p>
        </div>
      {/if}
      {#if dayStatus.afterWhisper.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">囁き</h3>
          <ul>
            {#each dayStatus.afterWhisper as whisper}
              <li
                class:opacity-25={whisper.text === "Over"}
                style={`border-color: ${getColorFromName(dayStatus.agents[whisper.agentIdx].gameName)}`}
                class="p-2 my-2 border-4 rounded-md"
              >
                <AgentName text={dayStatus.agents[whisper.agentIdx].gameName} />
                <FormatText
                  text={whisper.text}
                  names={Object.values(dayStatus.agents).map(
                    (agent) => agent.gameName
                  )}
                />
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.guard}
        <div>
          <h3 class="text-lg font-bold my-2">護衛</h3>
          <p>
            <AgentName
              text={dayStatus.agents[dayStatus.guard.agentIdx].gameName}
            />
            が
            <AgentName
              text={dayStatus.agents[dayStatus.guard.targetIdx].gameName}
              highlight
            />
            を護衛
          </p>
        </div>
      {/if}
      {#if dayStatus.attackVotes.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">襲撃投票</h3>
          <ul>
            {#each dayStatus.attackVotes as vote}
              <li
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(dayStatus.agents[vote.agentIdx].gameName)}`}
              >
                <AgentName text={dayStatus.agents[vote.agentIdx].gameName} />
                が
                <AgentName
                  text={dayStatus.agents[vote.targetIdx].gameName}
                  highlight
                />
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
              <AgentName
                text={dayStatus.agents[dayStatus.attack.targetIdx].gameName}
                highlight
              />
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
