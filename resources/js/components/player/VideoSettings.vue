<script setup lang="ts">
import { ref, nextTick } from 'vue';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps<{
    playbackRate: number;
}>();

const emit = defineEmits<{
    'update:playbackRate': [value: number];
    'playback-rate-change': [value: number];
}>();

const showSettings = ref(false);

// Available playback speeds
const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// Toggle settings panel visibility
const toggleSettings = () => {
    showSettings.value = !showSettings.value;
};

// Set playback rate
const setPlaybackRate = (rate: number) => {
    emit('update:playbackRate', rate);
    emit('playback-rate-change', rate);
    nextTick(() => { showSettings.value = false; });
};
</script>

<template>
    <div class="relative">
        <button @click="toggleSettings"
            class="group flex h-10 w-10 items-center justify-center rounded-full bg-transparent transition-colors hover:bg-white/10"
            aria-label="Settings">
            <svg class="h-5 w-5 text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24"
                :class="{ 'animate-spin duration-700': showSettings }" fill="currentColor">
                <path
                    d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22l-1.92 3.32c-.12.21-.07.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
        </button>

        <!-- Settings dropdown -->
        <div v-if="showSettings"
            class="absolute bottom-full right-0 mb-2 w-48 overflow-hidden rounded-lg bg-black/90 shadow-lg backdrop-blur-sm">
            <div class="p-2 text-sm text-white">
                <!-- Playback speed section -->
                <div>
                    <h4 class="mb-1 px-2 text-xs font-semibold uppercase opacity-70">Playback Speed</h4>
                    <div class="grid grid-cols-2 gap-1">
                        <button v-for="speed in playbackSpeeds" :key="speed" @click="setPlaybackRate(speed)"
                            class="rounded px-2 py-1.5 text-left transition-colors hover:bg-white/10"
                            :class="{ 'bg-primary-500/70': playbackRate === speed }">
                            {{ speed === 1 ? 'Normal' : speed + 'x' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
