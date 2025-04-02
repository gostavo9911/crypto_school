<script setup lang="ts">
const props = defineProps<{
  name: 'play' | 'pause' | 'volume-high' | 'volume-low' | 'volume-mute' | 'fullscreen' | 'fullscreen-exit' | 'close';
  size?: string | number;
  class?: string;
}>();

// Icons map with SVG paths
const iconPaths: Record<string, { viewBox: string; fill: boolean; stroke?: boolean; path: string }> = {
  'play': {
    viewBox: '0 0 24 24',
    fill: true,
    path: 'M8 5v14l11-7z'
  },
  'pause': {
    viewBox: '0 0 24 24',
    fill: true,
    path: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'
  },
  'volume-high': {
    viewBox: '0 0 24 24',
    fill: true,
    path: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
  },
  'volume-low': {
    viewBox: '0 0 24 24',
    fill: true,
    path: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'
  },
  'volume-mute': {
    viewBox: '0 0 24 24',
    fill: true,
    path: 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'
  },
  'fullscreen': {
    viewBox: '0 0 24 24',
    fill: true,
    path: 'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'
  },
  'fullscreen-exit': {
    viewBox: '0 0 24 24',
    fill: true,
    path: 'M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z'
  },
  'close': {
    viewBox: '0 0 24 24',
    fill: false,
    stroke: true,
    path: 'M18 6L6 18M6 6l12 12'
  }
};
</script>

<template>
  <svg
    :class="props.class"
    :width="size || 24"
    :height="size || 24"
    :viewBox="iconPaths[name].viewBox"
    xmlns="http://www.w3.org/2000/svg"
    :fill="iconPaths[name].fill ? 'currentColor' : 'none'"
    :stroke="iconPaths[name].stroke ? 'currentColor' : 'none'"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path :d="iconPaths[name].path" />
  </svg>
</template>
