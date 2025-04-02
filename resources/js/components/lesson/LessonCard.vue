<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Clock } from 'lucide-vue-next';

interface Props {
    lesson: {
        id: number;
        uuid: string;
        title: string;
        description: string;
        thumbnail: string | null;
        duration: number;
        difficulty: string;
    }
}

defineProps<Props>();

// Helper function to format duration
const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
};
</script>

<template>
    <Link :href="route('lessons.show', lesson.uuid)"
        class="group relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border hover:shadow-lg transition-all duration-300">
    <!-- Thumbnail or placeholder -->
    <div class="absolute inset-0 bg-black/20 z-10"></div>
    <div class="absolute inset-0 flex items-center justify-center z-0">
        <img v-if="lesson.thumbnail" :src="lesson.thumbnail" :alt="lesson.title" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span class="text-white/50 text-lg">{{ lesson.title }}</span>
        </div>
    </div>

    <!-- Content overlay -->
    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
        <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-primary-500/80 text-white">
                {{ lesson.difficulty }}
            </span>
            <span class="flex items-center gap-1 text-white/80 text-xs">
                <Clock class="w-3 h-3" />
                {{ formatDuration(lesson.duration) }}
            </span>
        </div>
        <h3 class="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">
            {{ lesson.title }}
        </h3>
        <p class="text-sm text-white/80 line-clamp-2 mt-1">
            {{ lesson.description }}
        </p>
    </div>
    </Link>
</template>
