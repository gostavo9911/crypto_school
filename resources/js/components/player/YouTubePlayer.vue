<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue';
import AppLogoIcon from '@/components/AppLogoIcon.vue';
import VideoPopup from '@/components/player/VideoPopup.vue';
import Icon from '@/components/ui/Icon.vue';
import VideoControls from '@/components/player/VideoControls.vue';
import { useYouTubePlayer } from '@/composables/useYouTubePlayer';
import { useVideoControls } from '@/composables/useVideoControls';
import { usePopups } from '@/composables/usePopups';


// Define player props
const props = defineProps<{
    videoId: string;
    lessonId?: string;
    poster?: string;
    logo?: string;
    progressBarColor?: string;
    popupContent?: string;
    popupType?: 'quiz' | 'cta';
    autoplay?: boolean;
    title?: string;
    subtitle?: string;
    hideTitle?: boolean;
}>();

const emit = defineEmits(['timeupdate', 'ended', 'play', 'pause', 'ready']);

// DOM References
const iframeRef = ref<HTMLIFrameElement | null>(null);
const playerContainerRef = ref<HTMLDivElement | null>(null);

// UI state
const playerHover = ref(false);
const showControls = ref(true);
const controlsTimeout = ref<number | null>(null);

// Initialize YouTube player
const {
    player,
    playerReady,
    loadingFailed,
    isPlaying,
    currentTime,
    duration,
    bufferedPercentage,
    videoEnded,
    loading,
    initializePlayer,
    sendCommand,
    startTimeTracking,
    stopTimeTracking,
    cleanup: cleanupPlayer
} = useYouTubePlayer(iframeRef, emit);

// Initialize video controls
const {
    volume,
    isMuted,
    isFullscreen,
    playbackRate,
    togglePlay,
    handleSeek,
    setVolume,
    toggleFullscreen,
    handlePlaybackRateChange,
    handleKeyboardShortcuts,
    loadSavedVolume,
    handleFullscreenChange
} = useVideoControls(
    player,
    playerContainerRef,
    playerReady,
    isPlaying,
    currentTime,
    duration,
    videoEnded
);

// Initialize popups
const {
    showPopup,
    currentPopup,
    videoPopups,
    answeredPopupsInSession,
    fetchVideoPopups,
    checkForPopups,
    closePopup,
    handlePopupSubmitted
} = usePopups(
    props.lessonId || null,
    player,
    currentTime,
    duration,
    isPlaying,
    props.popupContent,
    props.popupType
);

// Computed values
const showPlayButton = computed(() => !isPlaying.value && playerReady.value && !videoEnded.value);
const showReplayButton = computed(() => videoEnded.value && playerReady.value);

// Generate YouTube iframe src URL with privacy-enhanced domain
const iframeSrc = computed(() => {
    const params = new URLSearchParams({
        autoplay: props.autoplay ? '1' : '0',
        controls: '0',
        disablekb: '1',
        fs: '1',
        modestbranding: '1',
        playsinline: '1',
        mute: '0',
        loop: '0',
        color: 'white',
        cc_load_policy: '3',
        iv_load_policy: '3',
        origin: typeof window !== 'undefined' ? window.location.origin : '',
        widget_referrer: typeof window !== 'undefined' ? window.location.origin : '',
        hl: 'en-US',
        showinfo: '0',
        playlist: props.videoId, // Repeat videoId to prevent related videos
        endscreen: '0',
        annotations: '0',
        related: '0',
        norelated: '1',
        enablejsapi: '1',
        autohide: '1',
        rel: '0',
    });

    return `https://www.youtube-nocookie.com/embed/${props.videoId}?${params.toString()}`;
});

// Get YouTube thumbnail URL based on video ID and quality
const getYouTubeThumbnail = computed(() => {
    if (props.poster) {
        return props.poster; // Use custom poster if provided
    }
    return `https://img.youtube.com/vi/${props.videoId}/maxresdefault.jpg`;
});

// Show controls temporarily
const showControlsTemporarily = () => {
    showControls.value = true;

    if (controlsTimeout.value) {
        clearTimeout(controlsTimeout.value);
    }

    controlsTimeout.value = window.setTimeout(() => {
        if (isPlaying.value && !playerHover.value) {
            showControls.value = false;
        }
    }, 3000);
};

// Setup time tracking with popup checking
const setupTimeTracking = () => {
    startTimeTracking(checkForPopups);
};

// Lifecycle hooks
onMounted(() => {
    loadSavedVolume();
    initializePlayer(props.videoId, props.autoplay || false, volume.value);
    window.addEventListener('keydown', handleKeyboardShortcuts);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Fetch popups if we have a lesson ID
    if (props.lessonId) {
        fetchVideoPopups();
    }
});

// Clean up resources
const cleanup = () => {
    if (controlsTimeout.value) clearTimeout(controlsTimeout.value);
    cleanupPlayer();
    window.removeEventListener('keydown', handleKeyboardShortcuts);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
};

onBeforeUnmount(cleanup);

// Watch for videoId changes to reload player
watch(() => props.videoId, (newId, oldId) => {
    if (newId !== oldId) {
        // Reset states
        videoEnded.value = false;
        loading.value = true;
        playerReady.value = false;
        currentTime.value = 0;
        duration.value = 0;
        answeredPopupsInSession.value = []; // Reset answered popups tracking

        // Cleanup and reinitialize
        cleanupPlayer();

        // Use nextTick to ensure the DOM has updated
        nextTick(() => {
            initializePlayer(newId, props.autoplay || false, volume.value);

            // Fetch popups for the new video if we have a lesson ID
            if (props.lessonId) {
                fetchVideoPopups();
            }
        });
    }
});

// Start tracking time when playing
watch(() => isPlaying.value, (isPlaying) => {
    if (isPlaying) {
        setupTimeTracking();
    }
});
</script>

<template>
    <div ref="playerContainerRef" class="relative w-full overflow-hidden rounded-lg bg-black aspect-video group"
        @mousemove="showControlsTemporarily" @mouseover="playerHover = true"
        @mouseleave="playerHover = false; isPlaying ? (showControls = false) : null">
        <!-- Custom Video Title Bar -->
        <div v-if="!hideTitle && (title || subtitle)"
            class="absolute left-0 right-0 top-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 text-white transition-opacity duration-300"
            :class="{ 'opacity-0': isPlaying && !showControls, 'opacity-100': !isPlaying || showControls }">
            <h3 v-if="title" class="text-lg font-semibold">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm opacity-80">{{ subtitle }}</p>
        </div>

        <!-- Poster/Thumbnail -->
        <div v-if="!playerReady" class="absolute inset-0 z-[3] bg-black">
            <img :src="getYouTubeThumbnail" class="h-full w-full object-cover" alt="Video thumbnail" />
        </div>

        <!-- YouTube iframe container -->
        <div class="absolute inset-0 w-full h-full">
            <!-- YouTube iframe -->
            <iframe ref="iframeRef" :src="iframeSrc" class="absolute inset-0 w-full h-full" frameborder="0"
                sandbox="allow-same-origin allow-scripts allow-presentation allow-popups allow-popups-to-escape-sandbox allow-forms"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen title="YouTube video player"></iframe>

            <!-- Pause overlay to hide related videos -->
            <div v-if="playerReady && !isPlaying" class="absolute inset-0 z-[6] bg-black/75 pause-overlay"></div>
        </div>

        <!-- Error message overlay -->
        <div v-if="loadingFailed"
            class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 p-4 text-center text-white">
            <Icon name="close" class="mb-4 h-16 w-16 text-red-500" />
            <h3 class="mb-2 text-xl font-bold">Video playback error</h3>
            <p class="mb-4">There was a problem loading this video. Please try again later.</p>
            <button @click="initializePlayer(videoId, autoplay || false)"
                class="rounded bg-primary-500 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-600">
                Retry
            </button>
        </div>

        <!-- Gradient overlay -->
        <div v-if="!loadingFailed"
            class="absolute inset-0 z-[5] bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            @click="togglePlay"></div>

        <!-- Play button overlay -->
        <div v-if="showPlayButton"
            class="absolute left-1/2 top-1/2 z-[6] -translate-x-1/2 -translate-y-1/2 transform cursor-pointer transition-transform duration-200 hover:scale-110"
            @click="togglePlay">
            <div
                class="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/90 backdrop-blur-sm shadow-lg">
                <Icon name="play" class="h-10 w-10 text-white ml-1.5" />
            </div>
        </div>

        <!-- Replay button -->
        <div v-if="showReplayButton"
            class="absolute left-1/2 top-1/2 z-[6] -translate-x-1/2 -translate-y-1/2 transform cursor-pointer transition-transform duration-200 hover:scale-110"
            @click="togglePlay">
            <div
                class="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500/90 backdrop-blur-sm shadow-lg">
                <svg class="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
                </svg>
            </div>
        </div>

        <!-- Loading spinner -->
        <div v-if="loading && !loadingFailed"
            class="absolute left-1/2 top-1/2 z-[6] -translate-x-1/2 -translate-y-1/2 transform">
            <div class="h-14 w-14 animate-spin rounded-full border-4 border-primary-500 border-t-transparent shadow-lg">
            </div>
        </div>

        <!-- Logo overlay -->
        <div v-if="logo" class="absolute left-4 top-4 z-10 size-12">
            <AppLogoIcon class="size-12" />
        </div>

        <!-- Video controls component -->
        <VideoControls :current-time="currentTime" :duration="duration" :buffered-percentage="bufferedPercentage"
            :is-playing="isPlaying" :video-ended="videoEnded" :volume="volume" :is-muted="isMuted"
            :is-fullscreen="isFullscreen" :show-controls="showControls" :playback-rate="playbackRate"
            :progress-bar-color="progressBarColor" @seek="handleSeek" @toggle-play="togglePlay"
            @toggle-fullscreen="toggleFullscreen" @update:volume="setVolume"
            @update:isMuted="(value) => { isMuted = value; sendCommand(value ? 'mute' : 'unMute'); }"
            @update:playback-rate="(value) => { playbackRate = value; }"
            @playback-rate-change="handlePlaybackRateChange" />

        <!-- Optional popup -->
        <VideoPopup v-if="currentPopup" :id="currentPopup.id" :uuid="currentPopup.uuid" :type="currentPopup.type"
            :title="currentPopup.title" :content="currentPopup.content" :visible="showPopup"
            :options="currentPopup.options" :is-skippable="currentPopup.is_skippable" @close="closePopup"
            @answer-submitted="handlePopupSubmitted" />
    </div>
</template>

<style scoped>
/* SVG icon styling */
:deep(svg) {
    fill: currentColor;
    color: white;
}

.dark :deep(svg) {
    color: white;
}

/* Fix YouTube iframe styling */
iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
    filter: brightness(1);
    transition: filter 0.5s;
    z-index: 1;
}

.dark iframe {
    filter: brightness(0.95);
}

/* Pause overlay to hide related videos */
.pause-overlay {
    pointer-events: none;
}

/* Create iframe wrapper to help hide YouTube elements */
:deep(.ytp-pause-overlay) {
    display: none !important;
}

:deep(.ytp-pause-overlay-container) {
    display: none !important;
}
</style>
