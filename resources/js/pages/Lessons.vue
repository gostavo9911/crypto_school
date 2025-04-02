<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import LessonCard from '@/components/lesson/LessonCard.vue';

// Define props for receiving lessons from the backend
defineProps<{
    lessons: Array<{
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
    }>;
}>();

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lessons',
        href: '/lessons',
    },
];
</script>

<template>

    <Head title="Lessons" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold">Crypto School Lessons</h1>
            </div>

            <!-- Lessons Grid -->
            <div class="grid auto-rows-min gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <template v-if="lessons.length">
                    <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
                </template>
                <div v-else class="col-span-full py-12 text-center">
                    <p class="text-muted-foreground">No lessons available yet.</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
