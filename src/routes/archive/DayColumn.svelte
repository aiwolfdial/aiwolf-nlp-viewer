<script lang="ts">
  import { hierarchicalDisplaySettings } from "$lib/stores/hierarchicalDisplaySettings";
  import type { DayStatus } from "$lib/types/archive";
  import { getColorFromName } from "$lib/utils/archive";
  import { _, locale } from "svelte-i18n";
  import AgentName from "./AgentName.svelte";
  import FormatText from "./FormatText.svelte";

  const isEnglish = $derived($locale === "en");
  const settings = $derived($hierarchicalDisplaySettings);

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
      {#if settings.agents.visible && Object.keys(dayStatus.agents).length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.agents")}</h3>
          <ul>
            {#each Object.entries(dayStatus.agents) as [_, status]}
              <li
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(status.gameName)}`}
                class:opacity-25={status.status !== "ALIVE"}
              >
                {#if settings.agents.fields?.gameName}
                  <AgentName text={status.gameName} key={status.gameName} />
                {/if}
                {#if settings.agents.fields?.originalName}
                  {status.originalName}
                {/if}
                {#if settings.agents.fields?.role}
                  {getRoleTranslation(status.role)}
                {/if}
                {#if settings.agents.fields?.status}
                  {#if settings.agents.fields?.role}
                    -
                  {/if}
                  {getStatusTranslation(status.status)}
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if settings.beforeWhisper.visible && dayStatus.beforeWhisper.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.whispers")}</h3>
          <ul>
            {#each dayStatus.beforeWhisper as whisper}
              <li
                class:opacity-25={whisper.text === "Over"}
                style={`border-color: ${getColorFromName(dayStatus.agents[whisper.agentIdx].gameName)}`}
                class="p-2 my-2 border-4 rounded-md"
              >
                {#if settings.beforeWhisper.fields?.talkIdx}
                  <span class="text-xs opacity-50">[{whisper.talkIdx}]</span>
                {/if}
                {#if settings.beforeWhisper.fields?.turnIdx}
                  <span class="text-xs opacity-50">T{whisper.turnIdx}</span>
                {/if}
                {#if settings.beforeWhisper.fields?.agentName}
                  <AgentName
                    text={dayStatus.agents[whisper.agentIdx].gameName}
                  />
                {/if}
                {#if settings.beforeWhisper.fields?.originalName && dayStatus.agents[whisper.agentIdx].originalName}
                  <span class="text-sm opacity-75"
                    >({dayStatus.agents[whisper.agentIdx].originalName})</span
                  >
                {/if}
                {#if settings.beforeWhisper.fields?.text}
                  <FormatText
                    text={whisper.text}
                    names={Object.values(dayStatus.agents).map(
                      (agent) => agent.gameName,
                    )}
                  />
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if settings.talks.visible && dayStatus.talks.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.talk")}</h3>
          <ul>
            {#each dayStatus.talks as talk}
              <li
                class:opacity-25={talk.text === "Over"}
                style={`border-color: ${getColorFromName(dayStatus.agents[talk.agentIdx].gameName)}`}
                class="p-2 my-2 border-4 rounded-md"
              >
                {#if settings.talks.fields?.talkIdx}
                  <span class="text-xs opacity-50">[{talk.talkIdx}]</span>
                {/if}
                {#if settings.talks.fields?.turnIdx}
                  <span class="text-xs opacity-50">T{talk.turnIdx}</span>
                {/if}
                {#if settings.talks.fields?.agentName}
                  <AgentName text={dayStatus.agents[talk.agentIdx].gameName} />
                {/if}
                {#if settings.talks.fields?.originalName && dayStatus.agents[talk.agentIdx].originalName}
                  <span class="text-sm opacity-75"
                    >({dayStatus.agents[talk.agentIdx].originalName})</span
                  >
                {/if}
                {#if settings.talks.fields?.text}
                  <FormatText
                    text={talk.text}
                    names={Object.values(dayStatus.agents).map(
                      (agent) => agent.gameName,
                    )}
                  />
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if settings.votes.visible && dayStatus.votes.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.voting")}</h3>
          <ul>
            {#each dayStatus.votes as vote}
              <li
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(dayStatus.agents[vote.agentIdx].gameName)}`}
              >
                {#if isEnglish}
                  {#if settings.votes.fields?.voterName}
                    <AgentName
                      text={dayStatus.agents[vote.agentIdx].gameName}
                    />
                  {/if}
                  {$_("archive.votedFor")}
                  {#if settings.votes.fields?.targetName}
                    <AgentName
                      text={dayStatus.agents[vote.targetIdx].gameName}
                      highlight
                    />
                  {/if}
                {:else}
                  {#if settings.votes.fields?.voterName}
                    <AgentName
                      text={dayStatus.agents[vote.agentIdx].gameName}
                    />
                  {/if}
                  {$_("archive.particle")}
                  {#if settings.votes.fields?.targetName}
                    <AgentName
                      text={dayStatus.agents[vote.targetIdx].gameName}
                      highlight
                    />
                  {/if}
                  {$_("archive.votedFor")}
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if settings.execution.visible && dayStatus.execution}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.execute")}</h3>
          <p>
            {#if settings.execution.fields?.agentName}
              <AgentName
                text={dayStatus.agents[dayStatus.execution.agentIdx].gameName}
                highlight
              />
            {/if}
            {$_("archive.wasExecuted")}
            {#if settings.execution.fields?.role}
              ({getRoleTranslation(dayStatus.execution.role)})
            {/if}
          </p>
        </div>
      {/if}
      {#if settings.divine.visible && dayStatus.divine}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.divination")}</h3>
          <p>
            {#if isEnglish}
              {#if settings.divine.fields?.seerName}
                <AgentName
                  text={dayStatus.agents[dayStatus.divine.agentIdx].gameName}
                />
              {/if}
              {$_("archive.divined")}
              {#if settings.divine.fields?.targetName}
                <AgentName
                  text={dayStatus.agents[dayStatus.divine.targetIdx].gameName}
                  highlight
                />
              {/if}
              {#if settings.divine.fields?.result}
                <strong>{getSpeciesTranslation(dayStatus.divine.result)}</strong
                >
              {/if}
            {:else}
              {#if settings.divine.fields?.seerName}
                <AgentName
                  text={dayStatus.agents[dayStatus.divine.agentIdx].gameName}
                />
              {/if}
              {$_("archive.particle")}
              {#if settings.divine.fields?.targetName}
                <AgentName
                  text={dayStatus.agents[dayStatus.divine.targetIdx].gameName}
                  highlight
                />
              {/if}
              {$_("archive.divined")}
              {#if settings.divine.fields?.result}
                <strong>{getSpeciesTranslation(dayStatus.divine.result)}</strong
                >
              {/if}
            {/if}
          </p>
        </div>
      {/if}
      {#if settings.afterWhisper.visible && dayStatus.afterWhisper.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.whispers")}</h3>
          <ul>
            {#each dayStatus.afterWhisper as whisper}
              <li
                class:opacity-25={whisper.text === "Over"}
                style={`border-color: ${getColorFromName(dayStatus.agents[whisper.agentIdx].gameName)}`}
                class="p-2 my-2 border-4 rounded-md"
              >
                {#if settings.afterWhisper.fields?.talkIdx}
                  <span class="text-xs opacity-50">[{whisper.talkIdx}]</span>
                {/if}
                {#if settings.afterWhisper.fields?.turnIdx}
                  <span class="text-xs opacity-50">T{whisper.turnIdx}</span>
                {/if}
                {#if settings.afterWhisper.fields?.agentName}
                  <AgentName
                    text={dayStatus.agents[whisper.agentIdx].gameName}
                  />
                {/if}
                {#if settings.afterWhisper.fields?.originalName && dayStatus.agents[whisper.agentIdx].originalName}
                  <span class="text-sm opacity-75"
                    >({dayStatus.agents[whisper.agentIdx].originalName})</span
                  >
                {/if}
                {#if settings.afterWhisper.fields?.text}
                  <FormatText
                    text={whisper.text}
                    names={Object.values(dayStatus.agents).map(
                      (agent) => agent.gameName,
                    )}
                  />
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if settings.guard.visible && dayStatus.guard}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.guard")}</h3>
          <p>
            {#if isEnglish}
              {#if settings.guard.fields?.guardName}
                <AgentName
                  text={dayStatus.agents[dayStatus.guard.agentIdx].gameName}
                />
              {/if}
              {$_("archive.protected")}
              {#if settings.guard.fields?.targetName}
                <AgentName
                  text={dayStatus.agents[dayStatus.guard.targetIdx].gameName}
                  highlight
                />
              {/if}
              {#if settings.guard.fields?.result}
                ({dayStatus.guard.result})
              {/if}
            {:else}
              {#if settings.guard.fields?.guardName}
                <AgentName
                  text={dayStatus.agents[dayStatus.guard.agentIdx].gameName}
                />
              {/if}
              {$_("archive.particle")}
              {#if settings.guard.fields?.targetName}
                <AgentName
                  text={dayStatus.agents[dayStatus.guard.targetIdx].gameName}
                  highlight
                />
              {/if}
              {$_("archive.protected")}
              {#if settings.guard.fields?.result}
                ({dayStatus.guard.result})
              {/if}
            {/if}
          </p>
        </div>
      {/if}
      {#if settings.attackVotes.visible && dayStatus.attackVotes.length > 0}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.attackVotes")}</h3>
          <ul>
            {#each dayStatus.attackVotes as vote}
              <li
                class="p-2 my-2 border-4 rounded-md"
                style={`border-color: ${getColorFromName(dayStatus.agents[vote.agentIdx].gameName)}`}
              >
                {#if isEnglish}
                  {#if settings.attackVotes.fields?.voterName}
                    <AgentName
                      text={dayStatus.agents[vote.agentIdx].gameName}
                    />
                  {/if}
                  {$_("archive.votedFor")}
                  {#if settings.attackVotes.fields?.targetName}
                    <AgentName
                      text={dayStatus.agents[vote.targetIdx].gameName}
                      highlight
                    />
                  {/if}
                {:else}
                  {#if settings.attackVotes.fields?.voterName}
                    <AgentName
                      text={dayStatus.agents[vote.agentIdx].gameName}
                    />
                  {/if}
                  {$_("archive.particle")}
                  {#if settings.attackVotes.fields?.targetName}
                    <AgentName
                      text={dayStatus.agents[vote.targetIdx].gameName}
                      highlight
                    />
                  {/if}
                  {$_("archive.votedFor")}
                {/if}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
      {#if settings.attack.visible && dayStatus.attack}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.attack")}</h3>
          {#if dayStatus.attack.targetIdx !== "-1"}
            <p>
              {#if settings.attack.fields?.targetName}
                <AgentName
                  text={dayStatus.agents[dayStatus.attack.targetIdx].gameName}
                  highlight
                />
              {/if}
              {$_("archive.wasAttacked")}
              {#if settings.attack.fields?.result}
                <strong
                  >{dayStatus.attack.result
                    ? $_("archive.success")
                    : $_("archive.failure")}</strong
                >
              {/if}
            </p>
          {:else}
            <p>{$_("archive.noAttackTarget")}</p>
          {/if}
        </div>
      {/if}
      {#if settings.result.visible && dayStatus.result}
        <div>
          <h3 class="text-lg font-bold my-2">{$_("archive.result")}</h3>
          <p>
            {#if settings.result.fields?.winSide}
              <strong>{getTeamTranslation(dayStatus.result.winSide)}</strong>
              {$_("archive.won")}
            {/if}
            {#if settings.result.fields?.villagers}
              <br />村人: {dayStatus.result.villagers}
            {/if}
            {#if settings.result.fields?.werewolves}
              <br />人狼: {dayStatus.result.werewolves}
            {/if}
          </p>
        </div>
      {/if}
    </div>
  </div>
</div>
