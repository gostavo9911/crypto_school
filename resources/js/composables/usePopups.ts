import { ref, Ref } from 'vue';
import axios from 'axios';

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
    const currentPopup = ref<any>(null);
    const videoPopups = ref<any[]>([]);
    const loadingPopups = ref(false);
    const answeredPopupsInSession = ref<number[]>([]);

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
        // Don't check if not playing or no popups
        if (!videoPopups.value.length || !isPlaying.value) return;

        // Check for custom popups first
        const popup = videoPopups.value.find(p => {
            const shouldShowAtCurrentTime = Math.abs(currentTime.value - p.appear_at) < 1;
            const notCurrentlyShowing = currentPopup.value?.id !== p.id;
            const notAnsweredInSession = !answeredPopupsInSession.value.includes(p.id);

            return shouldShowAtCurrentTime && notCurrentlyShowing && notAnsweredInSession;
        });

        if (popup) {
            currentPopup.value = popup;
            showPopup.value = true;

            // Pause if not skippable
            if (!popup.is_skippable && player.value) {
                player.value.pauseVideo();
            }
            return;
        }

        // Show default popup near the end if we have popupContent
        if (defaultPopupContent &&
            duration.value > 0 &&
            duration.value - currentTime.value <= 10 &&
            !showPopup.value) {
            currentPopup.value = {
                id: null,
                title: null,
                content: defaultPopupContent,
                type: defaultPopupType,
                isSkippable: true
            };
            showPopup.value = true;
        }
    };

    const closePopup = () => {
        // Track answered quiz popups
        if (currentPopup.value &&
            currentPopup.value.type === 'quiz' &&
            currentPopup.value.id &&
            !answeredPopupsInSession.value.includes(currentPopup.value.id)) {
            answeredPopupsInSession.value.push(currentPopup.value.id);
        }

        showPopup.value = false;
        currentPopup.value = null;
        // Resume if paused by non-skippable popup
        if (player.value && !isPlaying.value && player.value.getPlayerState?.() === 0) {
            player.value.playVideo();
        }
    };

    const handlePopupSubmitted = (response: any) => {
        // Track this popup as answered
        if (currentPopup.value && currentPopup.value.id) {
            answeredPopupsInSession.value.push(currentPopup.value.id);
        }
    };

    return {
        showPopup,
        currentPopup,
        videoPopups,
        answeredPopupsInSession,
        fetchVideoPopups,
        checkForPopups,
        closePopup,
        handlePopupSubmitted
    };
}