<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/vue3';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Documentation',
        href: '/documentation',
    },
];
</script>

<template>

    <Head title="Player Popups A/B Test Report" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="container mx-auto p-6">
            <!-- Header -->
            <header class="mb-8">
                <h1 class="text-3xl font-bold text-center mb-4">
                    Player Popups Engagement Experiment Report
                </h1>
            </header>

            <!-- Installation Section -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4 border-b border-blue-500 pb-2">
                    1. Installation
                </h2>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <pre class="bg-gray-50 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm">
  composer install
  npm run build   # Or use: npm run dev
  npm run storybook</pre>
                </div>
            </section>

            <!-- Project Overview Section -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4 border-b border-blue-500 pb-2">
                    2. Project Overview
                </h2>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                    <p>
                        The project is built using <strong>Laravel 12</strong> with a Vue.js starter kit. It comes with
                        a pre-built layout, making the initial setup straightforward.
                    </p>
                    <ul class="list-disc pl-6">
                        <li>
                            <strong>Lessons Page:</strong> Displays lessons retrieved from a database seeded after
                            migration.
                        </li>
                        <li>
                            <strong>Lesson Detail Page:</strong> Uses a UUID to fetch and display the actual video.
                        </li>
                    </ul>
                </div>
            </section>

            <!-- Video Player Integration Section -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4 border-b border-blue-500 pb-2">
                    3. Video Player Integration
                </h2>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                    <h3 class="text-xl font-medium">3.1 Video Player Setup</h3>
                    <ul class="list-disc pl-6">
                        <li>
                            <strong>YouTube Integration:</strong> The lesson page features a video player that uses the
                            <code>youtube-nocookie</code> URL, which is compatible with the existing Crypto School
                            implementation,
                            allowing for database reuse.
                        </li>
                        <li>
                            <strong>Security Measures:</strong> Prevents direct user interaction with the YouTube iframe
                            through custom implementation.
                        </li>
                        <li>
                            <strong>Customization:</strong> Fully customizable player using YouTube's iframe API for
                            dynamic video interactions.
                        </li>
                    </ul>
                </div>
            </section>

            <!-- Popup Feature & Experiment Design Section -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4 border-b border-blue-500 pb-2">
                    4. Popup Feature & A/B Testing
                </h2>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                    <div>
                        <h3 class="text-xl font-medium mb-2">4.1 Popup Types</h3>
                        <ul class="list-disc pl-6">
                            <li><strong>Quiz Popup:</strong> Original engagement feature</li>
                            <li><strong>CTA Popup:</strong> New experimental feature being tested</li>
                        </ul>
                    </div>

                    <div>
                        <h3 class="text-xl font-medium mb-2">4.2 Feature Flag Implementation</h3>
                        <p class="mb-4">
                            <strong>Laravel Pennant</strong> is used for feature flagging to randomly assign users to
                            test groups:
                        </p>
                        <ul class="list-disc pl-6 mb-4">
                            <li>
                                <strong>Variant Group (25%):</strong> Users who receive the new CTA popup
                            </li>
                            <li>
                                <strong>Control Group (75%):</strong> Users who experience the original popup experience
                            </li>
                            <li>
                                <strong>Admin Users:</strong> Always have access to the new popup feature
                            </li>
                        </ul>

                        <div class="mt-4 flex justify-center">
                            <img src="/images/mermaid_graph.png" alt="Popup Example"
                                class="max-w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700" />
                        </div>

                        <pre class="bg-gray-50 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm mt-4">
  &lt;?php
  // AppServiceProvider.php
  Feature::define('player-popups', function (User $user) {
      if ($user->isAdmin()) {
          return true;
      }
      return Lottery::odds(25 / 100);
  });</pre>

                        <p class="mt-4">
                            To manually enable the feature for specific users, you can update the <code>features</code>
                            table,
                            setting the value to <code>true</code> for the targeted user.
                        </p>
                    </div>

                    <div>
                        <h3 class="text-xl font-medium mb-2">4.3 Engagement Tracking</h3>
                        <p>
                            When a user interacts with the CTA popup, a request is sent to the backend to log their
                            action:
                        </p>
                        <ul class="list-disc pl-6 mt-2">
                            <li>Whether they clicked the CTA button</li>
                            <li>Whether they closed the popup</li>
                            <li>The timestamp of the video when interaction occurred</li>
                        </ul>
                        <p class="mt-2">
                            This data helps calculate conversion metrics and optimize popup timing for maximum
                            engagement.
                            The system tracks when popups are most effective during video playback.
                        </p>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 mt-4">
                        <p>
                            The popups are designed to be highly engaging while maintaining a clean, unobtrusive UI that
                            complements the video content.
                        </p>
                        <div class="mt-4 flex justify-center">
                            <img src="/images/popup_example.png" alt="Popup Example"
                                class="max-w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700" />
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                            Example of a popup displayed during video playback
                        </p>
                    </div>
                </div>
            </section>

            <!-- Monitoring & Dashboard Section -->
            <section class="mb-8">
                <h2 class="text-2xl font-semibold mb-4 border-b border-blue-500 pb-2">
                    5. Monitoring & Future Enhancements
                </h2>
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
                    <h3 class="text-xl font-medium">5.1 Current Dashboard</h3>
                    <p>
                        A comprehensive dashboard has been developed to monitor experiment results in real-time:
                    </p>
                    <div class="mt-4 flex justify-center">
                        <img src="/images/cta_engagement_table.png" alt="CTA Engagement Table"
                            class="max-w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700" />
                    </div>
                    <div class="mt-4 flex justify-center">
                        <img src="/images/monitor_table.png" alt="Monitor Table"
                            class="max-w-full rounded-lg shadow-md border border-gray-200 dark:border-gray-700" />
                    </div>
                    <ul class="list-disc pl-6">
                        <li>User engagement metrics across both test groups</li>
                        <li>Conversion rates based on popup appearance and timing</li>
                        <li>Comparative analysis between control and variant groups</li>
                    </ul>

                    <h3 class="text-xl font-medium mt-6">5.2 Future Enhancements</h3>
                    <p class="mb-2">
                        Improvements to the system can include:
                    </p>
                    <ul class="list-disc pl-6">
                        <li>Management system for scheduling popup appearance times and feature flags</li>
                        <li>Adjustable feature rollout percentages through an admin interface</li>
                        <li>Per-user feature activation controls</li>
                        <li>Advanced analytics to determine optimal timing for different video lengths</li>
                    </ul>
                </div>
            </section>
        </div>
    </AppLayout>
</template>