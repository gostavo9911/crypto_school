<script setup lang="ts">
import { computed } from 'vue';

// Define props for the Progress component
const props = defineProps<{
    value?: number;
    max?: number;
    class?: string;
}>();

// Computed property to handle the progress value
const percent = computed(() => {
    const value = props.value || 0;
    const max = props.max || 100;
    const calculatedValue = (value / max) * 100;

    // Ensure value is between 0 and 100
    return Math.max(0, Math.min(100, calculatedValue));
});
</script>

<template>
    <div class="relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800" :class="props.class">
        <div class="h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out"
            :style="{ width: `${percent}%` }" />
    </div>
</template>