<script lang="ts">
  import { browser } from "$app/environment";
  import Hls from "hls.js/dist/hls.js";
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  let {
    url,
    gameId,
  }: {
    url: string;
    gameId: string;
  } = $props();

  let audioElement: HTMLAudioElement;
  let hls: Hls | null = null;

  let isPlaying = $state(false);
  let currentVolume = $state(0.7);

  $effect(() => {
    if (gameId) {
      initializeHLS(gameId);
    }
  });

  async function initializeHLS(gameId: string) {
    if (!browser || !audioElement) return;

    if (hls) {
      hls.destroy();
      hls = null;
    }
    const streamUrl = `${url}/tts/${gameId}/playlist.m3u8`;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        xhrSetup: function (xhr) {
          xhr.setRequestHeader("ngrok-skip-browser-warning", "true");
        },
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(audioElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Received HLS manifest");
        playAudio();
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, trying to recover...");
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, trying to recover...");
              hls?.recoverMediaError();
              break;
            default:
              console.log("Fatal error, destroying HLS instance");
              hls?.destroy();
              hls = null;
              break;
          }
        }
      });
    } else if (audioElement.canPlayType("application/vnd.apple.mpegurl")) {
      audioElement.src = streamUrl;
      playAudio();
    } else {
      console.error("HLS is not supported in this browser");
    }
  }

  function playAudio() {
    if (!audioElement) return;
    audioElement
      .play()
      .then(() => {
        isPlaying = true;
        console.log("Audio playback started");
      })
      .catch((error) => {
        console.error("Failed to play audio:", error);
        isPlaying = false;
      });
  }

  function pauseAudio() {
    if (!audioElement) return;
    audioElement.pause();
    isPlaying = false;
    console.log("Audio playback paused");
  }

  export function toggleAudio() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  export function updateVolume(volume: number) {
    if (!audioElement) return;
    currentVolume = Math.max(0, Math.min(1, volume));
    audioElement.volume = currentVolume;
  }

  function handleAudioPlay() {
    isPlaying = true;
  }

  function handleAudioPause() {
    isPlaying = false;
  }

  function handleAudioEnded() {
    isPlaying = false;
  }

  onDestroy(() => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
</script>

<div class="flex w-full items-center gap-4 py-2">
  <audio
    bind:this={audioElement}
    onplay={handleAudioPlay}
    onpause={handleAudioPause}
    onended={handleAudioEnded}
    preload="none"
    class="hidden"
  ></audio>

  <button
    class="btn btn-sm {isPlaying ? 'btn-error' : 'btn-success'}"
    onclick={toggleAudio}
    disabled={!gameId}
  >
    {isPlaying ? $_("audio.stop") : $_("audio.play")}
  </button>
  <iconify-icon inline icon="mdi:volume"></iconify-icon>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    bind:value={currentVolume}
    class="range range-xs w-full"
  />
</div>
