<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';
import { onMounted, ref } from 'vue';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
// Import the local Progress component instead
import Progress from '@/components/ui/progress/Progress.vue';

// Define interfaces for data structures
interface Lesson {
    id: number;
    title: string;
    thumbnail?: string;
    difficulty: string;
    submission_count: number;
}

interface CtaPopup {
    id: number;
    title: string;
    close_submissions: number;
    open_submissions: number;
    total_submissions: number;
}

interface LessonWithCtaPopups {
    id: number;
    title: string;
    thumbnail?: string;
    difficulty: string;
    cta_popups: CtaPopup[];
}

interface FeatureMetric {
    name: string;
    enabled: number;
    disabled: number;
    total: number;
    enabled_percentage: number;
    disabled_percentage: number;
}

// Breadcrumbs for navigation
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Data structure for metrics
const userMetrics = ref({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    adminUsers: 0,
    retentionRate: 0,
});

const lessonMetrics = ref({
    totalLessons: 0,
    publishedLessons: 0,
    unpublishedLessons: 0,
    totalDurationHours: 0,
    averageDurationMinutes: 0,
    lessonsByDifficulty: {},
});

const quizMetrics = ref({
    totalPopups: 0,
    quizPopups: 0,
    ctaPopups: 0,
    totalSubmissions: 0,
    correctSubmissions: 0,
    correctRate: 0,
    avgResponseTime: 0,
    uniqueUsers: 0,
});

const topLessons = ref<Lesson[]>([]);
const ctaPopupMetrics = ref<LessonWithCtaPopups[]>([]);
const featureMetrics = ref<FeatureMetric[]>([]);

const loading = ref(true);

// Fetch dashboard metrics
onMounted(async () => {
    try {
        const response = await axios.get('/dashboard/metrics');
        userMetrics.value = response.data.userMetrics;
        lessonMetrics.value = response.data.lessonMetrics;
        quizMetrics.value = response.data.quizMetrics;
        topLessons.value = response.data.topLessons;
        ctaPopupMetrics.value = response.data.ctaPopupMetrics;
        featureMetrics.value = response.data.featureMetrics;
    } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
    } finally {
        loading.value = false;
    }
});

// Get difficulty color
const getDifficultyColor = (difficulty: string | undefined): string => {
    const colors: Record<string, string> = {
        'beginner': 'bg-green-500',
        'intermediate': 'bg-blue-500',
        'advanced': 'bg-purple-500',
        'expert': 'bg-red-500'
    };
    return colors[difficulty?.toLowerCase() ?? ''] || 'bg-gray-500';
};

// Format number with commas
const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
</script>

<template>

    <Head title="Learning Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 p-4">
            <!-- Loading state -->
            <div v-if="loading" class="flex items-center justify-center h-64">
                <div class="text-lg">Loading dashboard data...</div>
            </div>

            <div v-else>
                <!-- User Metrics Row -->
                <div class="grid gap-4 grid-cols-1 md:grid-cols-3 mb-4">
                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-lg">User Overview</CardTitle>
                            <CardDescription>Total and active users</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between mb-4">
                                <div>
                                    <div class="text-2xl font-bold">{{ formatNumber(userMetrics.totalUsers) }}</div>
                                    <div class="text-sm text-gray-500">Total Users</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold">{{ formatNumber(userMetrics.activeUsers) }}</div>
                                    <div class="text-sm text-gray-500">Active Users</div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span>Retention Rate</span>
                                    <span>{{ userMetrics.retentionRate }}%</span>
                                </div>
                                <Progress :value="userMetrics.retentionRate" class="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-lg">User Growth</CardTitle>
                            <CardDescription>New users in the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="flex flex-col items-center justify-center h-24">
                                <div class="text-4xl font-bold">{{ formatNumber(userMetrics.newUsers) }}</div>
                                <div class="text-sm text-gray-500">New Registrations</div>
                            </div>
                            <div class="mt-2 text-sm text-center">
                                <span>{{ userMetrics.adminUsers }} Admin Users</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-lg">Lesson Statistics</CardTitle>
                            <CardDescription>Content overview</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between mb-4">
                                <div>
                                    <div class="text-2xl font-bold">{{ formatNumber(lessonMetrics.totalLessons) }}</div>
                                    <div class="text-sm text-gray-500">Total Lessons</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold">{{ lessonMetrics.totalDurationHours }}</div>
                                    <div class="text-sm text-gray-500">Total Hours</div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span>Published</span>
                                    <span>{{ Math.round((lessonMetrics.publishedLessons / lessonMetrics.totalLessons) *
                                        100) }}%</span>
                                </div>
                                <Progress :value="(lessonMetrics.publishedLessons / lessonMetrics.totalLessons) * 100"
                                    class="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Quiz Metrics Row -->
                <div class="grid gap-4 grid-cols-1 md:grid-cols-3 mb-4">
                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-lg">Quiz Performance</CardTitle>
                            <CardDescription>Engagement metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between mb-4">
                                <div>
                                    <div class="text-2xl font-bold">{{ formatNumber(quizMetrics.totalSubmissions) }}
                                    </div>
                                    <div class="text-sm text-gray-500">Total Submissions</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold">{{ quizMetrics.correctRate }}%</div>
                                    <div class="text-sm text-gray-500">Correct Rate</div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span>Correct Answers</span>
                                    <span>{{ quizMetrics.correctSubmissions }} / {{ quizMetrics.totalSubmissions
                                        }}</span>
                                </div>
                                <Progress :value="quizMetrics.correctRate" class="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-lg">Response Time</CardTitle>
                            <CardDescription>Average user response</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="flex flex-col items-center justify-center h-24">
                                <div class="text-4xl font-bold">{{ quizMetrics.avgResponseTime }}s</div>
                                <div class="text-sm text-gray-500">Average Response Time</div>
                            </div>
                            <div class="mt-2 text-sm text-center">
                                <span>{{ formatNumber(quizMetrics.uniqueUsers) }} Unique Participants</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader class="pb-2">
                            <CardTitle class="text-lg">Popup Types</CardTitle>
                            <CardDescription>Quiz vs CTA distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="flex justify-between mb-4">
                                <div>
                                    <div class="text-2xl font-bold">{{ formatNumber(quizMetrics.quizPopups) }}</div>
                                    <div class="text-sm text-gray-500">Quiz Popups</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold">{{ formatNumber(quizMetrics.ctaPopups) }}</div>
                                    <div class="text-sm text-gray-500">CTA Popups</div>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <div class="flex justify-between text-sm">
                                    <span>Quiz Percentage</span>
                                    <span>{{ Math.round((quizMetrics.quizPopups / quizMetrics.totalPopups) * 100)
                                        }}%</span>
                                </div>
                                <Progress :value="(quizMetrics.quizPopups / quizMetrics.totalPopups) * 100"
                                    class="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Top Lessons Table -->
                <Card class="mb-4">
                    <CardHeader>
                        <CardTitle>Top Performing Lessons</CardTitle>
                        <CardDescription>Highest engagement based on submission count</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="border-b">
                                        <th class="pb-2 text-left font-medium">Lesson</th>
                                        <th class="pb-2 text-left font-medium hidden md:table-cell">Difficulty</th>
                                        <th class="pb-2 text-right font-medium">Submissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="lesson in topLessons" :key="lesson.id" class="border-b">
                                        <td class="py-3">
                                            <div class="flex items-center gap-2">
                                                <div class="h-10 w-10 rounded overflow-hidden bg-gray-100">
                                                    <img v-if="lesson.thumbnail" :src="lesson.thumbnail"
                                                        :alt="lesson.title" class="h-full w-full object-cover" />
                                                    <div v-else
                                                        class="flex h-full w-full items-center justify-center text-gray-500 text-xs">
                                                        No Image
                                                    </div>
                                                </div>
                                                <span class="font-medium">{{ lesson.title }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3 hidden md:table-cell">
                                            <span
                                                class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white"
                                                :class="getDifficultyColor(lesson.difficulty)">
                                                {{ lesson.difficulty }}
                                            </span>
                                        </td>
                                        <td class="py-3 text-right">{{ formatNumber(lesson.submission_count) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <!-- Lesson Difficulty Distribution -->
                <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lesson Difficulty Distribution</CardTitle>
                            <CardDescription>Breakdown by difficulty level</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="space-y-2">
                                <div v-for="(count, difficulty) in lessonMetrics.lessonsByDifficulty" :key="difficulty">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="capitalize font-medium">{{ difficulty }}</span>
                                        <span>{{ count }} lessons</span>
                                    </div>
                                    <Progress :value="(count / lessonMetrics.totalLessons) * 100"
                                        :class="`h-2 ${getDifficultyColor(difficulty)}`" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Content Overview</CardTitle>
                            <CardDescription>Detailed lesson metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <div class="text-sm text-gray-500">Published Lessons</div>
                                    <div class="text-2xl font-bold">{{ formatNumber(lessonMetrics.publishedLessons) }}
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <div class="text-sm text-gray-500">Unpublished Lessons</div>
                                    <div class="text-2xl font-bold">{{ formatNumber(lessonMetrics.unpublishedLessons) }}
                                    </div>
                                </div>
                                <div class="space-y-1">
                                    <div class="text-sm text-gray-500">Avg. Duration</div>
                                    <div class="text-2xl font-bold">{{ lessonMetrics.averageDurationMinutes }} min</div>
                                </div>
                                <div class="space-y-1">
                                    <div class="text-sm text-gray-500">Total Hours</div>
                                    <div class="text-2xl font-bold">{{ lessonMetrics.totalDurationHours }}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- CTA Popup Engagement Section -->
                <Card class="mt-4">
                    <CardHeader>
                        <CardTitle>CTA Popup Engagement</CardTitle>
                        <CardDescription>Tracking "open" vs "close" responses for CTA popups by lesson</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div v-if="ctaPopupMetrics.length === 0" class="text-center py-6 text-gray-500">
                            No CTA popup data available
                        </div>
                        <div v-else class="space-y-6">
                            <div v-for="lesson in ctaPopupMetrics" :key="lesson.id" class="border-b pb-6">
                                <div class="flex items-center gap-2 mb-3">
                                    <div class="h-10 w-10 rounded overflow-hidden bg-gray-100">
                                        <img v-if="lesson.thumbnail" :src="lesson.thumbnail" :alt="lesson.title"
                                            class="h-full w-full object-cover" />
                                        <div v-else
                                            class="flex h-full w-full items-center justify-center text-gray-500 text-xs">
                                            No Image
                                        </div>
                                    </div>
                                    <div>
                                        <h4 class="font-medium">{{ lesson.title }}</h4>
                                        <span
                                            class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                                            :class="getDifficultyColor(lesson.difficulty)">
                                            {{ lesson.difficulty }}
                                        </span>
                                    </div>
                                </div>

                                <div class="overflow-x-auto">
                                    <table class="w-full">
                                        <thead>
                                            <tr class="border-b text-sm">
                                                <th class="text-left font-medium py-2">CTA Popup</th>
                                                <th class="text-center font-medium py-2">Close Submissions</th>
                                                <th class="text-center font-medium py-2">Open Submissions</th>
                                                <th class="text-right font-medium py-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="popup in lesson.cta_popups" :key="popup.id" class="text-sm">
                                                <td class="py-2">{{ popup.title }}</td>
                                                <td class="py-2 text-center">
                                                    <span class="font-medium">{{ popup.close_submissions }}</span>
                                                    <span class="text-gray-500 text-xs ml-1">
                                                        ({{ popup.total_submissions > 0 ?
                                                            Math.round((popup.close_submissions / popup.total_submissions) *
                                                                100) :
                                                            0 }}%)
                                                    </span>
                                                </td>
                                                <td class="py-2 text-center">
                                                    <span class="font-medium">{{ popup.open_submissions }}</span>
                                                    <span class="text-gray-500 text-xs ml-1">
                                                        ({{ popup.total_submissions > 0 ?
                                                            Math.round((popup.open_submissions / popup.total_submissions) *
                                                                100) :
                                                            0 }}%)
                                                    </span>
                                                </td>
                                                <td class="py-2 text-right font-medium">{{ popup.total_submissions }}
                                                </td>
                                            </tr>
                                            <tr v-if="lesson.cta_popups.length === 0">
                                                <td colspan="4" class="py-4 text-center text-gray-500">
                                                    No CTA popups for this lesson
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Progress bars for open vs close ratio -->
                                <div class="mt-3 space-y-2">
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span class="text-xs">Open</span>
                                        <div class="w-2 h-2 rounded-full bg-red-500 ml-4"></div>
                                        <span class="text-xs">Close</span>
                                    </div>
                                    <div v-for="popup in lesson.cta_popups" :key="`bar-${popup.id}`" class="space-y-1">
                                        <div class="flex justify-between text-xs">
                                            <span class="truncate max-w-[200px]">{{ popup.title }}</span>
                                            <span>{{ popup.total_submissions }} submissions</span>
                                        </div>
                                        <div class="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                            <div class="bg-green-500 h-full" :style="{
                                                width: `${popup.total_submissions > 0 ?
                                                    (popup.open_submissions / popup.total_submissions) * 100 : 0}%`
                                            }"></div>
                                            <div class="bg-red-500 h-full" :style="{
                                                width: `${popup.total_submissions > 0 ?
                                                    (popup.close_submissions / popup.total_submissions) * 100 : 0}%`
                                            }"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <!-- Feature Flags Section -->
                <Card class="mt-4">
                    <CardHeader>
                        <CardTitle>Feature Flag Distribution</CardTitle>
                        <CardDescription>Statistics on Laravel Pennant feature flags usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div v-if="featureMetrics.length === 0" class="text-center py-6 text-gray-500">
                            No feature flag data available
                        </div>
                        <div v-else class="space-y-6">
                            <!-- Feature metrics table -->
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead>
                                        <tr class="border-b">
                                            <th class="pb-2 text-left font-medium">Feature Name</th>
                                            <th class="pb-2 text-center font-medium">Enabled</th>
                                            <th class="pb-2 text-center font-medium">Disabled</th>
                                            <th class="pb-2 text-right font-medium">Total Users</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="feature in featureMetrics" :key="feature.name" class="border-b">
                                            <td class="py-3 font-medium">{{ feature.name }}</td>
                                            <td class="py-3 text-center">
                                                <span class="font-medium">{{ formatNumber(feature.enabled) }}</span>
                                                <span class="text-gray-500 text-xs ml-1">
                                                    ({{ feature.enabled_percentage }}%)
                                                </span>
                                            </td>
                                            <td class="py-3 text-center">
                                                <span class="font-medium">{{ formatNumber(feature.disabled) }}</span>
                                                <span class="text-gray-500 text-xs ml-1">
                                                    ({{ feature.disabled_percentage }}%)
                                                </span>
                                            </td>
                                            <td class="py-3 text-right font-medium">{{ formatNumber(feature.total) }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Feature distribution visualization -->
                            <div class="space-y-4">
                                <div class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span class="text-xs">Enabled</span>
                                    <div class="w-3 h-3 rounded-full bg-gray-300 ml-4"></div>
                                    <span class="text-xs">Disabled</span>
                                </div>
                                <div v-for="feature in featureMetrics" :key="`viz-${feature.name}`" class="space-y-1">
                                    <div class="flex justify-between text-sm">
                                        <span>{{ feature.name }}</span>
                                        <span>{{ formatNumber(feature.total) }} users</span>
                                    </div>
                                    <div class="flex h-3 w-full overflow-hidden rounded-full bg-gray-200">
                                        <div class="bg-blue-500 h-full" :style="{
                                            width: `${feature.enabled_percentage}%`
                                        }"></div>
                                        <div class="bg-gray-300 h-full" :style="{
                                            width: `${feature.disabled_percentage}%`
                                        }"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </AppLayout>
</template>
