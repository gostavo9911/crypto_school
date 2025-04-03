<script setup lang="ts">
import { computed, ref } from 'vue';
import Icon from '@/components/ui/Icon.vue';
import VolumeControl from './VolumeControl.vue';
import VideoSettings from './VideoSettings.vue';

const props = defineProps<{
    currentTime: number;
    duration: number;
    bufferedPercentage: number;
    isPlaying: boolean;
    videoEnded: boolean;
    volume: number;
    isMuted: boolean;
    isFullscreen: boolean;
    showControls: boolean;
    playbackRate: number;
}>();

const emit = defineEmits<{
    'seek': [time: number];
    'toggle-play': [];
    'toggle-fullscreen': [];
    'update:volume': [value: number];
    'update:isMuted': [value: boolean];
    'update:playbackRate': [value: number];
    'playback-rate-change': [value: number];
}>();

// Default values
const defaultProgressBarColor = '#3B82F6'; // Blue-500

// Computed values
const progressPercentage = computed(() => {
    return props.duration > 0 ? (props.currentTime / props.duration) * 100 : 0;
});

const formattedCurrentTime = computed(() => formatTime(props.currentTime));
const formattedDuration = computed(() => formatTime(props.duration));
const formattedRemainingTime = computed(() => `-${formatTime(props.duration - props.currentTime)}`);

// Format time in MM:SS format
const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) {
        return "0:00";
    }

    const totalSeconds = Math.floor(timeInSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Seek to position in video
const seek = (event: MouseEvent) => {
    if (props.duration <= 0) return;

    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;
    const seekToTime = position * props.duration;

    emit('seek', seekToTime);
};

// Handle volume changes
const onVolumeChange = (value: number) => {
    emit('update:volume', value);
};

// Handle playback rate changes
const onPlaybackRateChange = (rate: number) => {
    emit('update:playbackRate', rate);
    emit('playback-rate-change', rate);
};
</script>

<template>
    <div class="absolute bottom-0 left-0 right-0 z-10 transition-all duration-300"
        :class="{ 'opacity-0 translate-y-2': !showControls && isPlaying, 'opacity-100 translate-y-0': showControls || !isPlaying }">
        <!-- Progress bar -->
        <div class="group/progress relative h-1 w-full cursor-pointer bg-gray-700/70 transition-all hover:h-3"
            @click="seek">
            <!-- Buffered progress -->
            <div class="absolute left-0 top-0 h-full bg-white/30" :style="{ width: `${bufferedPercentage}%` }">
            </div>

            <!-- Actual progress -->
            <div class="absolute left-0 top-0 h-full"
                :style="{ width: `${progressPercentage}%`, backgroundColor: defaultProgressBarColor }">
                <!-- Progress thumb/handle -->
                <div class="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow-md opacity-0 transition-opacity group-hover/progress:opacity-100"
                    :class="{ 'top-0 h-3 w-3': !isPlaying || showControls }"></div>
            </div>
        </div>

        <!-- Control buttons -->
        <div
            class="flex items-center justify-between bg-gradient-to-t from-black/90 via-black/80 to-black/50 p-3 backdrop-blur-sm">
            <div class="flex items-center space-x-3">
                <!-- Play/Pause button -->
                <button @click="emit('toggle-play')"
                    class="group flex h-10 w-10 items-center justify-center rounded-full bg-transparent transition-colors hover:bg-white/10"
                    aria-label="Toggle play">
                    <Icon v-if="!isPlaying && !videoEnded" name="play"
                        class="h-6 w-6 text-white transition-transform group-hover:scale-110" />
                    <Icon v-else-if="!videoEnded" name="pause"
                        class="h-6 w-6 text-white transition-transform group-hover:scale-110" />
                    <svg v-else class="h-6 w-6 text-white transition-transform group-hover:scale-110"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor" />
                    </svg>
                </button>

                <!-- Volume controls -->
                <VolumeControl :volume="volume" :is-muted="isMuted" @update:volume="emit('update:volume', $event)"
                    @update:is-muted="emit('update:isMuted', $event)" @volume-change="onVolumeChange" />

                <!-- Time display - desktop -->
                <div class="hidden sm:flex items-center text-sm text-white">
                    <span>{{ formattedCurrentTime }}</span>
                    <span class="mx-1 opacity-60">/</span>
                    <span class="opacity-60">{{ formattedDuration }}</span>
                </div>

                <!-- Time display - mobile -->
                <div class="sm:hidden flex items-center text-sm text-white">
                    <span>{{ formattedCurrentTime }}</span>
                    <span v-if="duration > 0" class="ml-1 opacity-60">{{ formattedRemainingTime }}</span>
                </div>
            </div>

            <div class="flex items-center space-x-2">
                <!-- Settings menu -->
                <VideoSettings :playback-rate="playbackRate" @update:playback-rate="emit('update:playbackRate', $event)"
                    @playback-rate-change="onPlaybackRateChange" />

                <!-- Fullscreen button -->
                <button @click="emit('toggle-fullscreen')"
                    class="group flex h-10 w-10 items-center justify-center rounded-full bg-transparent transition-colors hover:bg-white/10"
                    aria-label="Toggle fullscreen">
                    <Icon :name="!isFullscreen ? 'fullscreen' : 'fullscreen-exit'"
                        class="h-5 w-5 text-white transition-transform group-hover:scale-110" />
                </button>
            </div>
        </div>
    </div>
</template>
