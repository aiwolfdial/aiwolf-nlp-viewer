<script lang="ts">
  import type { DayStatus } from "$lib/types/archive";
  import { getColorFromName } from "$lib/utils/archive";
  import { _, locale } from "svelte-i18n";
  import AgentName from "./AgentName.svelte";
  import FormatText from "./FormatText.svelte";

  const isEnglish = $derived($locale === "en");

  let { dayIdx = "", dayStatus = {} as DayStatus } = $props();

  function getRoleTranslation(role: string) {
    return $_("game.role." + role);
  }

  function getStatusTranslation(status: string) {
    return $_("game.status." + status);
  }

  function getSpeciesTranslation(species: string) {
    return $_("game.species." + species);
  }

  function getTeamTranslation(team: string) {
    return $_("game.teams." + team);
  }
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
          <h3 class="text-lg font-bold my-2">{$_("archive.agents")}</h3>
          <ul>
            {#each Object.entries(dayStatus.agents) as [_, status]}
              <li
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(status.gameName)}`}
                class:opacity-25={status.status !== "ALIVE"}
              >
                <AgentName text={status.gameName} key={status.gameName} />
                {status.originalName}
                {getRoleTranslation(status.role)} -
                {getStatusTranslation(status.status)}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.beforeWhisper.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.whispers")}</h3>
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
          <h3 class="text-lg font-bold my-2">{$_("archive.talk")}</h3>
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
          <h3 class="text-lg font-bold my-2">{$_("archive.voting")}</h3>
          <ul>
            {#each dayStatus.votes as vote}
              <li
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(dayStatus.agents[vote.agentIdx].gameName)}`}
              >
                {#if isEnglish}
                  <AgentName text={dayStatus.agents[vote.agentIdx].gameName} />
                  {$_("archive.votedFor")}
                  <AgentName
                    text={dayStatus.agents[vote.targetIdx].gameName}
                    highlight
                  />
                {:else}
                  <AgentName text={dayStatus.agents[vote.agentIdx].gameName} />
                  {$_("archive.particle")}
                  <AgentName
                    text={dayStatus.agents[vote.targetIdx].gameName}
                    highlight
                  />
                  {$_("archive.votedFor")}
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.execution}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.execute")}</h3>
          <p>
            <AgentName
              text={dayStatus.agents[dayStatus.execution.agentIdx].gameName}
              highlight
            />
            {$_("archive.wasExecuted")}
          </p>
        </div>
      {/if}
      {#if dayStatus.divine}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.divination")}</h3>
          <p>
            {#if isEnglish}
              <AgentName
                text={dayStatus.agents[dayStatus.divine.agentIdx].gameName}
              />
              {$_("archive.divined")}
              <AgentName
                text={dayStatus.agents[dayStatus.divine.targetIdx].gameName}
                highlight
              />
              <strong>{getSpeciesTranslation(dayStatus.divine.result)}</strong>
            {:else}
              <AgentName
                text={dayStatus.agents[dayStatus.divine.agentIdx].gameName}
              />
              {$_("archive.particle")}
              <AgentName
                text={dayStatus.agents[dayStatus.divine.targetIdx].gameName}
                highlight
              />
              {$_("archive.divined")}
              <strong>{getSpeciesTranslation(dayStatus.divine.result)}</strong>
            {/if}
          </p>
        </div>
      {/if}
      {#if dayStatus.afterWhisper.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.whispers")}</h3>
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
          <h3 class="text-lg font-bold my-2">{$_("archive.guard")}</h3>
          <p>
            {#if isEnglish}
              <AgentName
                text={dayStatus.agents[dayStatus.guard.agentIdx].gameName}
              />
              {$_("archive.protected")}
              <AgentName
                text={dayStatus.agents[dayStatus.guard.targetIdx].gameName}
                highlight
              />
            {:else}
              <AgentName
                text={dayStatus.agents[dayStatus.guard.agentIdx].gameName}
              />
              {$_("archive.particle")}
              <AgentName
                text={dayStatus.agents[dayStatus.guard.targetIdx].gameName}
                highlight
              />
              {$_("archive.protected")}
            {/if}
          </p>
        </div>
      {/if}
      {#if dayStatus.attackVotes.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.attackVotes")}</h3>
          <ul>
            {#each dayStatus.attackVotes as vote}
              <li
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(dayStatus.agents[vote.agentIdx].gameName)}`}
              >
                {#if isEnglish}
                  <AgentName text={dayStatus.agents[vote.agentIdx].gameName} />
                  {$_("archive.votedFor")}
                  <AgentName
                    text={dayStatus.agents[vote.targetIdx].gameName}
                    highlight
                  />
                {:else}
                  <AgentName text={dayStatus.agents[vote.agentIdx].gameName} />
                  {$_("archive.particle")}
                  <AgentName
                    text={dayStatus.agents[vote.targetIdx].gameName}
                    highlight
                  />
                  {$_("archive.votedFor")}
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if dayStatus.attack}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.attack")}</h3>
          {#if dayStatus.attack.targetIdx !== "-1"}
            <p>
              <AgentName
                text={dayStatus.agents[dayStatus.attack.targetIdx].gameName}
                highlight
              />
              {$_("archive.wasAttacked")}
              <strong
                >{dayStatus.attack.result
                  ? $_("archive.success")
                  : $_("archive.failure")}</strong
              >
            </p>
          {:else}
            <p>{$_("archive.noAttackTarget")}</p>
          {/if}
        </div>
      {/if}
      {#if dayStatus.result}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.result")}</h3>
          <p>
            <strong>{getTeamTranslation(dayStatus.result.winSide)}</strong>
            {$_("archive.won")}
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>
