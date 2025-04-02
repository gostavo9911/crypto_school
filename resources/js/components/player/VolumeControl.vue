<script setup lang="ts">
import { ref, watch } from 'vue';
import Icon from '@/components/ui/Icon.vue';

const props = defineProps<{
  volume: number;
  isMuted: boolean;
}>();

const emit = defineEmits<{
  'update:volume': [value: number];
  'update:isMuted': [value: boolean];
  'volume-change': [value: number];
}>();

const showVolumeSlider = ref(false);

// Toggle mute state
const toggleMute = () => {
  emit('update:isMuted', !props.isMuted);
};

// Set volume
const setVolume = (value: number) => {
  emit('update:volume', value);
  emit('volume-change', value);
};

// Store volume preference
watch(() => props.volume, (newVolume) => {
  try {
    localStorage.setItem('videoPlayerVolume', newVolume.toString());
  } catch (e) {
    // Ignore storage errors
  }
});
</script>

<template>
  <div class="relative">
    <button @click="toggleMute" @mouseenter="showVolumeSlider = true"
      class="group flex h-10 w-10 items-center justify-center rounded-full bg-transparent transition-colors hover:bg-white/10"
      aria-label="Toggle mute">
      <Icon
        :name="!isMuted ? (volume > 0.5 ? 'volume-high' : 'volume-low') : 'volume-mute'"
        class="h-6 w-6 text-white transition-transform group-hover:scale-110"
      />
    </button>

    <!-- Volume slider -->
    <div
      class="absolute bottom-full left-0 mb-2 hidden h-8 w-32 items-center rounded-full bg-black/80 px-3 shadow-lg transition-all sm:flex"
      :class="{ 'opacity-100': showVolumeSlider, 'opacity-0 pointer-events-none': !showVolumeSlider }"
      @mouseleave="showVolumeSlider = false"
    >
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="volume"
        @input="(e: Event) => setVolume(parseFloat((e.target as HTMLInputElement).value))"
        class="h-1.5 w-full appearance-none rounded-full bg-white/30 outline-none accent-white"
      />
    </div>
  </div>
</template>

<style scoped>
/* Range input styling */
input[type='range'] {
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

input[type='range']::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}
</style>
