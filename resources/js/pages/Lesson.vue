<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { Clock } from 'lucide-vue-next';
import YouTubePlayer from '@/components/player/YouTubePlayer.vue';

// Define props for receiving the lesson from the backend
const props = defineProps<{
    lesson: {
        id: number;
        uuid: string;
        title: string;
        description: string;
        thumbnail: string | null;
        video_url: string;
        duration: number;
        difficulty: string;
        created_at: string;
        updated_at: string;
    };
}>();

// Helper function to extract YouTube video ID from URL
const getYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
};

// Helper function to format duration
const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Create breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lessons',
        href: '/lessons',
    },
    {
        title: props.lesson.title,
        href: '#',
    }
];

// Get YouTube video ID
const videoId = getYouTubeId(props.lesson.video_url);

// Sample quiz content for the video popup
const quizContent = `
<div class="space-y-4">
  <p>What is the primary advantage of blockchain technology?</p>
  <div class="space-y-2">
    <div class="flex items-center">
      <input type="radio" id="answer1" name="quiz" class="mr-2">
      <label for="answer1">Centralized control</label>
    </div>
    <div class="flex items-center">
      <input type="radio" id="answer2" name="quiz" class="mr-2">
      <label for="answer2">Decentralization and immutability</label>
    </div>
    <div class="flex items-center">
      <input type="radio" id="answer3" name="quiz" class="mr-2">
      <label for="answer3">Faster transaction processing</label>
    </div>
  </div>
</div>
`;
</script>

<template>

    <Head :title="lesson.title" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
            <div class="flex flex-col">
                <h1 class="text-3xl font-bold">{{ lesson.title }}</h1>
                <div class="mt-2 flex items-center gap-4">
                    <span class="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock class="w-4 h-4" />
                        {{ formatDuration(lesson.duration) }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-primary-500/80 text-white">
                        {{ lesson.difficulty }}
                    </span>
                </div>
            </div>

            <!-- YouTube Video Player -->
            <div class="relative w-full overflow-hidden rounded-xl">
                <YouTubePlayer :videoId="videoId" :lessonId="lesson.uuid" logo="/images/logo-icon.png"
                    :title="lesson.title" />
            </div>

            <!-- Lesson Description -->
            <div class="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                <h2 class="text-xl font-bold mb-4">Description</h2>
                <div class="prose max-w-none dark:prose-invert">
                    <p>{{ lesson.description }}</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
