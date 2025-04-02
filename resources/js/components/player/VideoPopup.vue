<script setup lang="ts">
import { ref } from 'vue';
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
        ? 'Correct answer!'
        : 'Not quite right. Try again next time.';
};
</script>

<template>
    <div v-if="visible"
        class="absolute left-1/2 top-1/2 z-20 w-5/6 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border border-gray-300 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800 md:w-2/3">
        <div class="absolute right-2 top-2">
            <button v-if="isSkippable || success" @click="closePopup"
                class="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
                <Icon name="close" class="h-5 w-5 text-gray-800 dark:text-white" />
            </button>
        </div>

        <div class="mt-1">
            <!-- Quiz popup -->
            <div v-if="type === 'quiz'" class="space-y-4">
                <h3 class="text-lg font-bold">{{ title || 'Quick Quiz' }}</h3>
                <div v-html="content || 'Test your knowledge!'"></div>

                <!-- Quiz options -->
                <div v-if="options?.answers" class="space-y-2 mt-4">
                    <div v-for="answer in options.answers" :key="answer.id"
                        class="p-3 rounded-md border cursor-pointer transition-colors" :class="{
                            'border-gray-300 hover:border-primary-500 dark:border-gray-600 dark:hover:border-primary-400': selectedAnswerId !== answer.id && !success,
                            'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20': selectedAnswerId === answer.id && !success,
                            'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/20': success && answer.is_correct,
                            'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20': success && selectedAnswerId === answer.id && !answer.is_correct,
                            'opacity-60 cursor-not-allowed': success
                        }" @click="!success && (selectedAnswerId = answer.id)">
                        <div class="flex items-center">
                            <div class="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mr-3"
                                :class="{
                                    'bg-primary-500 border-primary-500': selectedAnswerId === answer.id && !success,
                                    'bg-green-500 border-green-500': success && answer.is_correct,
                                    'bg-red-500 border-red-500': success && selectedAnswerId === answer.id && !answer.is_correct
                                }">
                                <svg v-if="selectedAnswerId === answer.id || (success && answer.is_correct)"
                                    class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M5 13l4 4L19 7" />
                                </svg>
                                <svg v-if="success && selectedAnswerId === answer.id && !answer.is_correct"
                                    class="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <span>{{ answer.text }}</span>
                        </div>
                    </div>
                </div>

                <!-- Submit button -->
                <div class="mt-4">
                    <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>
                    <div v-if="success" class="text-green-500 mb-2">
                        {{ getFeedbackMessage() }}
                    </div>
                    <button v-if="!success" @click="submitAnswer" :disabled="!selectedAnswerId || loading"
                        class="w-full rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="loading">Submitting...</span>
                        <span v-else>Submit Answer</span>
                    </button>
                    <button v-else @click="closePopup"
                        class="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                        Continue
                    </button>
                </div>
            </div>

            <!-- CTA popup -->
            <div v-else class="space-y-4">
                <h3 class="text-lg font-bold">{{ title || 'Next Steps' }}</h3>
                <div v-html="content || 'Ready to continue learning?'"></div>
                <div class="mt-4 flex justify-center">
                    <button @click="closePopup"
                        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Continue</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Style SVG icons to follow theme */
:deep(svg) {
    stroke: currentColor;
}
</style>
