<script lang="ts">
  import { RoleToSpecies } from "$lib/constants/common";
  import { realtimeSettings } from "$lib/stores/realtime-settings";
  import type { EventType, Packet } from "$lib/types/realtime";
  import type { RealtimeSettings } from "$lib/types/realtime-settings";
  import { IdxToCustomName, xor } from "$lib/utils/realtime";
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";

  /**
   * イベントメッセージ表示コンポーネント
   * Canvas.svelteから抽出し、単一責任の原則に従う
   */

  let {
    packet,
    focusIdx,
  }: {
    packet: Packet;
    focusIdx?: number;
  } = $props();

  let settings = $state<RealtimeSettings>();

  const unsubscribe = realtimeSettings.subscribe((value) => {
    settings = value;
  });

  onDestroy(unsubscribe);

  /**
   * イベントタイプに応じたメッセージを生成
   */
  function getEventMessage(event: EventType): string {
    switch (event) {
      case "未接続":
        return $_("realtime.events.disconnected");

      case "トーク":
        return packet.message ?? "";

      case "囁き":
        if (
          xor(
            focusIdx === undefined,
            packet.agents.find((agent) => agent.idx === focusIdx)?.role ===
              "WEREWOLF"
          )
        ) {
          return packet.message ?? "";
        }
        return $_("realtime.events.whispered");

      case "襲撃投票":
        if (xor(focusIdx === undefined, packet.from_idx === focusIdx)) {
          return $_("realtime.events.attack_voted_with_target", {
            values: {
              from: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.from_idx
              ),
              to: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.to_idx
              ),
            },
          });
        }
        return $_("realtime.events.attack_voted");

      case "投票":
        if (xor(focusIdx === undefined, packet.from_idx === focusIdx)) {
          return $_("realtime.events.voted_with_target", {
            values: {
              from: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.from_idx
              ),
              to: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.to_idx
              ),
            },
          });
        }
        return $_("realtime.events.voted", {
          values: {
            from: IdxToCustomName(
              settings?.display.bubble,
              packet,
              packet.from_idx
            ),
          },
        });

      case "追放":
        if (packet.to_idx === undefined) {
          return $_("realtime.events.no_execute");
        }
        return $_("realtime.events.executed", {
          values: {
            target: IdxToCustomName(
              settings?.display.bubble,
              packet,
              packet.to_idx
            ),
          },
        });

      case "襲撃":
        if (packet.to_idx === undefined) {
          return $_("realtime.events.no_attack");
        }
        if (packet.from_idx === -1) {
          return $_("realtime.events.attacked_but_guarded", {
            values: {
              target: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.to_idx
              ),
            },
          });
        }
        return $_("realtime.events.attacked", {
          values: {
            target: IdxToCustomName(
              settings?.display.bubble,
              packet,
              packet.to_idx
            ),
          },
        });

      case "占い":
        if (xor(focusIdx === undefined, packet.from_idx === focusIdx)) {
          const targetRole = packet.agents.find(
            (agent) => agent.idx === packet.to_idx
          )?.role;
          const species = targetRole
            ? RoleToSpecies[targetRole as keyof typeof RoleToSpecies]
            : undefined;
          return $_("realtime.events.divined_with_result", {
            values: {
              from: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.from_idx
              ),
              to: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.to_idx
              ),
              result: species ? $_(`game.species.${species}`) : "",
            },
          });
        }
        return $_("realtime.events.divined");

      case "護衛":
        if (xor(focusIdx === undefined, packet.from_idx === focusIdx)) {
          return $_("realtime.events.guarded_with_target", {
            values: {
              from: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.from_idx
              ),
              to: IdxToCustomName(
                settings?.display.bubble,
                packet,
                packet.to_idx
              ),
            },
          });
        }
        return $_("realtime.events.guarded");

      case "終了":
        return $_("realtime.events.game_ended", {
          values: {
            winner: packet.message ?? "",
          },
        });

      default:
        return packet.message ?? $_("realtime.events.unknown");
    }
  }

  let message = $derived(getEventMessage(packet.event));
</script>

{#if message}
  <div
    class="w-1/2 h-fit max-h-1/3 card bg-base-100 card-md shadow-md overflow-auto z-20"
  >
    <div class="card-body">
      <p
        class={settings?.display.largeScale
          ? "base-content text-3xl font-bold text-pretty break-all text-center"
          : "base-content text-lg text-pretty break-all text-center"}
      >
        {message}
      </p>
    </div>
  </div>
{/if}
