<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';

const props = defineProps<{
    id?: string;
    uuid?: string;
    type: 'quiz' | 'cta';
    title?: string;
    content?: string;
    visible: boolean;
    options?: {
        answers?: Array<{
            id: number;
            text: string;
            is_correct?: boolean;
        }>;
    };
    isSkippable?: boolean;
}>();

const emit = defineEmits(['close', 'answer-submitted']);

const loading = ref(false);
const error = ref('');
const success = ref(false);
const selectedAnswerId = ref<number | null>(null);
const responseTimeStart = ref(Date.now());

const closePopup = () => {
    emit('close');
    resetState();
};

const resetState = () => {
    loading.value = false;
    error.value = '';
    success.value = false;
    selectedAnswerId.value = null;
    responseTimeStart.value = Date.now();
};

const submitAnswer = async () => {
    const popupId = props.uuid || props.id;

    if (!popupId || !selectedAnswerId.value) {
        error.value = 'Please select an answer';
        return;
    }

    loading.value = true;
    error.value = '';
    const responseTime = Math.floor((Date.now() - responseTimeStart.value) / 1000);

    try {
        const response = await axios.post(`/popups/${popupId}/submit`, {
            answer: props.options?.answers?.find(a => a.id === selectedAnswerId.value)?.text,
            answer_data: {
                selected_id: selectedAnswerId.value
            },
            response_time_seconds: responseTime
        });

        loading.value = false;
        success.value = true;
        emit('answer-submitted', response.data);
    } catch (err: any) {
        loading.value = false;
        error.value = err.response?.data?.message || 'Failed to submit answer';
        console.error('Error submitting answer:', err, err.response?.data);
    }
};

// Get feedback message based on answer correctness
const getFeedbackMessage = () => {
    const correctAnswerId = props.options?.answers?.find(a => a.is_correct)?.id;
    return selectedAnswerId.value === correctAnswerId
        ? 'Correct answer! Well done!'
        : 'Not quite right. Try again next time.';
};

// Handle CTA button click
const handleCtaAction = () => {
    if (props.content && (props.content.startsWith('http') || props.content.startsWith('/'))) {
        // Assuming content is a URL
        window.open(props.content, '_blank');
        // Optionally close popup immediately, or let the navigation handle it.
        // For now, we'll close it.
        closePopup();
    } else {
        // Default action if content is not a URL or is empty
        closePopup();
    }
};

// Computed properties for styling
const buttonClasses = computed(() =>
    'w-full rounded-md px-4 py-3 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm transition-all duration-200'
);

const primaryButtonClasses = computed(() =>
    `${buttonClasses.value} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-indigo-600`
);

const successButtonClasses = computed(() =>
    `${buttonClasses.value} bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500`
);

const ctaButtonClasses = computed(() =>
    `${buttonClasses.value} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`
);
</script>

<template>
    <Transition name="popup-fade">
        <div v-if="visible"
            class="fixed inset-0 flex items-center justify-center z-20 px-4 backdrop-blur-sm transition-all duration-200">
            <div class="fixed inset-0 bg-black/40 dark:bg-black/60" @click="isSkippable && closePopup"></div>

            <div
                class="w-full max-w-md md:max-w-lg rounded-xl bg-white dark:bg-gray-900 shadow-2xl relative z-10 overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200 transform scale-100">
                <!-- Top accent bar - different colors for quiz vs cta -->
                <div :class="[
                    'h-1.5 w-full',
                    type === 'quiz' ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-blue-500 dark:bg-blue-400'
                ]"></div>

                <div class="p-6">
                    <!-- Close button -->
                    <div class="absolute right-4 top-4">
                        <button v-if="isSkippable || success" @click="closePopup"
                            class="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="mt-1">
                        <!-- Quiz popup -->
                        <div v-if="type === 'quiz'" class="space-y-4">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ title || 'Quick Quiz' }}</h3>
                            <div class="text-gray-700 dark:text-gray-200 prose dark:prose-invert prose-sm max-w-none"
                                v-html="content || 'Test your knowledge!'"></div>

                            <!-- Quiz options -->
                            <div v-if="options?.answers" class="space-y-3 mt-5">
                                <div v-for="answer in options.answers" :key="answer.id"
                                    class="p-4 rounded-lg transition-all duration-200 cursor-pointer" :class="{
                                        'border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20': selectedAnswerId !== answer.id && !success,
                                        'border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400': selectedAnswerId === answer.id && !success,
                                        'border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-400': success && answer.is_correct,
                                        'border-2 border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-400': success && selectedAnswerId === answer.id && !answer.is_correct,
                                        'border border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed': success && !answer.is_correct && selectedAnswerId !== answer.id
                                    }" @click="!success && (selectedAnswerId = answer.id)">
                                    <div class="flex items-start">
                                        <div class="w-5 h-5 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5"
                                            :class="{
                                                'border-2 border-gray-300 dark:border-gray-600': selectedAnswerId !== answer.id && !success,
                                                'bg-indigo-500 border-0': selectedAnswerId === answer.id && !success,
                                                'bg-emerald-500 border-0': success && answer.is_correct,
                                                'bg-red-500 border-0': success && selectedAnswerId === answer.id && !answer.is_correct
                                            }">
                                            <svg v-if="selectedAnswerId === answer.id || (success && answer.is_correct)"
                                                class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2.5">
                                                <path d="M5 13l4 4L19 7" />
                                            </svg>
                                            <svg v-if="success && selectedAnswerId === answer.id && !answer.is_correct"
                                                class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2.5">
                                                <path d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <span class="text-sm md:text-base text-gray-800 dark:text-gray-200">{{
                                            answer.text }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Submit button and feedback -->
                            <div class="mt-6">
                                <Transition name="fade">
                                    <div v-if="error"
                                        class="text-red-500 dark:text-red-400 mb-3 text-sm p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
                                        {{ error }}
                                    </div>
                                </Transition>

                                <Transition name="fade">
                                    <div v-if="success"
                                        class="text-emerald-600 dark:text-emerald-400 mb-3 p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-md font-medium">
                                        {{ getFeedbackMessage() }}
                                    </div>
                                </Transition>

                                <button v-if="!success" @click="submitAnswer" :disabled="!selectedAnswerId || loading"
                                    :class="primaryButtonClasses">
                                    <span v-if="loading" class="flex items-center justify-center">
                                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        Submitting...
                                    </span>
                                    <span v-else>Submit Answer</span>
                                </button>

                                <button v-else @click="closePopup" :class="successButtonClasses">
                                    Continue
                                </button>
                            </div>
                        </div>

                        <!-- CTA popup -->
                        <div v-else class="space-y-4">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ title || 'Next Steps' }}</h3>
                            <div class="mt-6 flex justify-center">
                                <button @click="handleCtaAction" :class="ctaButtonClasses">Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
/* Transition animations */
.popup-fade-enter-active,
.popup-fade-leave-active {
    transition: opacity 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Ensure SVG icons follow the text color */
:deep(svg) {
    stroke: currentColor;
}
</style>