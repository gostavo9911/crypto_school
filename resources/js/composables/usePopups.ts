import { ref, Ref, watch } from 'vue';
import axios from 'axios';

export interface Popup {
    id?: number;
    uuid?: string;
    title?: string;
    content?: string;
    type: 'quiz' | 'cta';
    appear_at?: number;
    is_skippable: boolean;
    options?: {
        answers?: Array<{
            id: number;
            text: string;
            is_correct?: boolean;
        }>;
    };
}

export function usePopups(
    lessonId: string | null,
    player: Ref<any>,
    currentTime: Ref<number>,
    duration: Ref<number>,
    isPlaying: Ref<boolean>,
    defaultPopupContent?: string | null,
    defaultPopupType: string = 'cta'
) {
    const showPopup = ref(false);
    const currentPopup = ref<Popup | null>(null);
    const videoPopups = ref<Popup[]>([]);
    const loadingPopups = ref(false);
    const answeredPopupsInSession = ref<number[]>([]);
    const lastTimeCheck = ref(0);

    // Set a minimum interval (in seconds) between popup checks to prevent constant checking
    const checkInterval = 0.5;

    // Add a debounced popup check flag
    const isCheckingPopups = ref(false);

    const fetchVideoPopups = async () => {
        if (!lessonId) return;

        loadingPopups.value = true;
        answeredPopupsInSession.value = []; // Reset tracking when loading new lesson

        try {
            const response = await axios.get(`/lessons/${lessonId}/popups`);
            videoPopups.value = response.data.data || [];
            loadingPopups.value = false;
        } catch (error) {
            console.error('Error fetching video popups:', error);
            loadingPopups.value = false;
        }
    };

    const checkForPopups = () => {
        // Don't check if not playing, no popups, already showing a popup,
        // or if we just checked recently
        if (
            !videoPopups.value.length ||
            !isPlaying.value ||
            showPopup.value ||
            isCheckingPopups.value ||
            currentTime.value - lastTimeCheck.value < checkInterval
        ) return;

        isCheckingPopups.value = true;
        lastTimeCheck.value = currentTime.value;

        setTimeout(() => {
            // Check for custom popups first
            const popup = videoPopups.value.find(p => {
                if (!p.appear_at) return false;

                const timeThreshold = 0.75; // More precise time threshold
                const shouldShowAtCurrentTime = Math.abs(currentTime.value - p.appear_at) < timeThreshold;
                const notAnsweredInSession = !answeredPopupsInSession.value.includes(p.id as number);

                return shouldShowAtCurrentTime && notAnsweredInSession;
            });

            if (popup) {
                currentPopup.value = popup;
                showPopup.value = true;

                // Pause if not skippable
                if (!popup.is_skippable && player.value) {
                    player.value.pauseVideo();
                }

                isCheckingPopups.value = false;
                return;
            }

            // Show default popup near the end if we have popupContent
            if (
                defaultPopupContent &&
                duration.value > 0 &&
                // Show between 8-10 seconds before the end, but only once
                duration.value - currentTime.value <= 10 &&
                duration.value - currentTime.value >= 8 &&
                !showPopup.value
            ) {
                currentPopup.value = {
                    id: undefined,
                    title: undefined,
                    content: defaultPopupContent,
                    type: defaultPopupType as 'quiz' | 'cta',
                    is_skippable: true
                };
                showPopup.value = true;
            }

            isCheckingPopups.value = false;
        }, 100);
    };

    const closePopup = () => {

        if (currentPopup.value &&
            currentPopup.value.type === 'quiz' &&
            currentPopup.value.id &&
            !answeredPopupsInSession.value.includes(currentPopup.value.id)) {
            answeredPopupsInSession.value.push(currentPopup.value.id);
        }

        showPopup.value = false;
        currentPopup.value = null;

        // Resume if paused by non-skippable popup
        // Added check to make sure player exists and has necessary methods
        if (player.value && !isPlaying.value && player.value.getPlayerState && player.value.getPlayerState() === 2) {
            // Small delay to ensure UI updates first
            setTimeout(() => {
                player.value.playVideo();
            }, 100);
        }
    };

    const handlePopupSubmitted = (response: any) => {
        // Track this popup as answered
        if (currentPopup.value && currentPopup.value.id) {
            answeredPopupsInSession.value.push(currentPopup.value.id);
        }
    };

    // Reset popup state when lesson changes
    watch(
        () => lessonId,
        () => {
            showPopup.value = false;
            currentPopup.value = null;
            videoPopups.value = [];
            answeredPopupsInSession.value = [];

            if (lessonId) {
                fetchVideoPopups();
            }
        },
        { immediate: true }
    );

    return {
        showPopup,
        currentPopup,
        videoPopups,
        answeredPopupsInSession,
        loadingPopups,
        fetchVideoPopups,
        checkForPopups,
        closePopup,
        handlePopupSubmitted
    };
}
