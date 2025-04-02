import { ref, Ref } from 'vue';
import axios from 'axios';

// YouTube API types
interface YTPlayerState {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
}

const PLAYER_STATE: YTPlayerState = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
};

export function useYouTubePlayer(
    iframeRef: Ref<HTMLIFrameElement | null>,
    emit: any
) {
    const player = ref<any>(null);
    const playerReady = ref(false);
    const loadingFailed = ref(false);
    const isPlaying = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const bufferedPercentage = ref(0);
    const videoEnded = ref(false);
    const loading = ref(true);
    const updateInterval = ref<number | null>(null);

    const initializePlayer = (videoId: string, autoplay: boolean) => {
        loading.value = true;

        if (typeof window === 'undefined') return;

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = () => createPlayer(videoId, autoplay);
        } else {
            createPlayer(videoId, autoplay);
        }
    };

    const createPlayer = (videoId: string, autoplay: boolean) => {
        if (!iframeRef.value || typeof window === 'undefined' || !window.YT) return;

        try {
            player.value = new window.YT.Player(iframeRef.value, {
                events: {
                    onReady: () => onPlayerReady(autoplay),
                    onStateChange: onPlayerStateChange,
                    onError: onPlayerError,
                },
            });
        } catch (error) {
            console.error('Error creating YouTube player:', error);
            loadingFailed.value = true;
            loading.value = false;
        }
    };

    const onPlayerReady = (autoplay: boolean) => {
        playerReady.value = true;
        loading.value = false;

        if (player.value) {
            duration.value = player.value.getDuration();

            if (autoplay) {
                player.value.playVideo();
            }
        }

        emit('ready');
    };

    const onPlayerStateChange = (event: any) => {
        const state = event.data;
        handleStateChange(state);

        if (state === PLAYER_STATE.PLAYING) {
            startTimeTracking();
        }

        if (state === PLAYER_STATE.UNSTARTED && player.value) {
            duration.value = player.value.getDuration();
        }
    };

    const onPlayerError = (event: any) => {
        console.error('YouTube Player Error:', event.data);
        loadingFailed.value = true;
        loading.value = false;
    };

    const handleStateChange = (state: number) => {
        if (state === PLAYER_STATE.PLAYING) {
            isPlaying.value = true;
            videoEnded.value = false;
            emit('play');
        } else if (state === PLAYER_STATE.PAUSED) {
            isPlaying.value = false;
            emit('pause');
        } else if (state === PLAYER_STATE.ENDED) {
            isPlaying.value = false;
            videoEnded.value = true;
            emit('ended');
            stopTimeTracking();
        }
    };

    const startTimeTracking = (callback?: () => void) => {
        stopTimeTracking();

        updateInterval.value = window.setInterval(() => {
            if (!player.value || !isPlaying.value) return;

            currentTime.value = player.value.getCurrentTime();
            bufferedPercentage.value = player.value.getVideoLoadedFraction() * 100;

            if (duration.value <= 0) {
                duration.value = player.value.getDuration();
            }

            if (callback) callback();

            emit('timeupdate', currentTime.value);
        }, 500);
    };

    const stopTimeTracking = () => {
        if (updateInterval.value) {
            clearInterval(updateInterval.value);
            updateInterval.value = null;
        }
    };

    const sendCommand = (command: string, parameter?: any) => {
        if (!player.value) return;

        try {
            switch (command) {
                case 'playVideo':
                    player.value.playVideo();
                    break;
                case 'pauseVideo':
                    player.value.pauseVideo();
                    break;
                case 'seekTo':
                    player.value.seekTo(parameter, true);
                    break;
                case 'setVolume':
                    player.value.setVolume(parameter);
                    break;
                case 'mute':
                    player.value.mute();
                    break;
                case 'unMute':
                    player.value.unMute();
                    break;
                case 'setPlaybackRate':
                    player.value.setPlaybackRate(parameter);
                    break;
                case 'setPlaybackQuality':
                    player.value.setPlaybackQuality(parameter);
                    break;
            }
        } catch (error) {
            console.error(`Error executing player command ${command}:`, error);
        }
    };

    const cleanup = () => {
        stopTimeTracking();
        if (player.value) {
            player.value.destroy();
            player.value = null;
        }
    };

    return {
        player,
        playerReady,
        loadingFailed,
        isPlaying,
        currentTime,
        duration,
        bufferedPercentage,
        videoEnded,
        loading,
        initializePlayer,
        sendCommand,
        startTimeTracking,
        stopTimeTracking,
        cleanup
    };
}

export function useVideoControls(
    player: Ref<any>,
    playerContainerRef: Ref<HTMLDivElement | null>,
    playerReady: Ref<boolean>,
    isPlaying: Ref<boolean>,
    currentTime: Ref<number>,
    duration: Ref<number>,
    videoEnded: Ref<boolean>
) {
    const volume = ref(1);
    const isMuted = ref(false);
    const isFullscreen = ref(false);
    const playbackRate = ref(1);

    const togglePlay = () => {
        if (!player.value) return;

        if (videoEnded.value) {
            player.value.seekTo(0, true);
            player.value.playVideo();
            videoEnded.value = false;
            return;
        }

        if (isPlaying.value) {
            player.value.pauseVideo();
        } else {
            player.value.playVideo();
        }
    };

    const handleSeek = (seekToTime: number) => {
        currentTime.value = seekToTime;
        player.value?.seekTo(seekToTime, true);

        if (videoEnded.value) {
            videoEnded.value = false;
            isPlaying.value = true;
            player.value?.playVideo();
        }
    };

    const setVolume = (value: number) => {
        volume.value = value;
        isMuted.value = value === 0;
        player.value?.setVolume(value * 100);

        try {
            localStorage.setItem('videoPlayerVolume', value.toString());
        } catch (e) {
            // Ignore storage errors
        }
    };

    const toggleFullscreen = () => {
        if (!playerContainerRef.value) return;

        try {
            if (!document.fullscreenElement) {
                playerContainerRef.value.requestFullscreen().then(() => {
                    isFullscreen.value = true;
                });
            } else {
                document.exitFullscreen().then(() => {
                    isFullscreen.value = false;
                });
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    };

    const handlePlaybackRateChange = (rate: number) => {
        playbackRate.value = rate;
        player.value?.setPlaybackRate(rate);
    };

    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
        if (!playerReady.value || !player.value) return;

        switch (event.key.toLowerCase()) {
            case ' ':
            case 'k':
                event.preventDefault();
                togglePlay();
                break;
            case 'f':
                event.preventDefault();
                toggleFullscreen();
                break;
            case 'm':
                event.preventDefault();
                isMuted.value = !isMuted.value;
                player.value[isMuted.value ? 'mute' : 'unMute']();
                break;
            case 'arrowleft':
                event.preventDefault();
                currentTime.value = Math.max(currentTime.value - 5, 0);
                player.value.seekTo(currentTime.value, true);
                videoEnded.value = false;
                break;
            case 'arrowright':
                event.preventDefault();
                currentTime.value = Math.min(currentTime.value + 5, duration.value || Infinity);
                player.value.seekTo(currentTime.value, true);
                videoEnded.value = false;
                break;
            case 'arrowup':
                event.preventDefault();
                setVolume(Math.min(volume.value + 0.1, 1));
                break;
            case 'arrowdown':
                event.preventDefault();
                setVolume(Math.max(volume.value - 0.1, 0));
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                const percent = parseInt(event.key) * 10;
                event.preventDefault();
                const seekToTime = (percent / 100) * duration.value;
                currentTime.value = seekToTime;
                player.value.seekTo(seekToTime, true);
                videoEnded.value = false;
                break;
            case 'j':
                event.preventDefault();
                currentTime.value = Math.max(currentTime.value - 10, 0);
                player.value.seekTo(currentTime.value, true);
                videoEnded.value = false;
                break;
            case 'l':
                event.preventDefault();
                currentTime.value = Math.min(currentTime.value + 10, duration.value || Infinity);
                player.value.seekTo(currentTime.value, true);
                videoEnded.value = false;
                break;
        }
    };

    const loadSavedVolume = () => {
        try {
            const savedVolume = localStorage.getItem('videoPlayerVolume');
            if (savedVolume !== null) {
                const parsedVolume = parseFloat(savedVolume);
                // Ensure volume is within 0-1 range
                volume.value = isNaN(parsedVolume) ? 0.5 : Math.min(Math.max(parsedVolume, 0), 1);
                isMuted.value = volume.value === 0;
            } else {
                volume.value = 0.5; // Default to 50% volume
            }
        } catch (e) {
            volume.value = 0.5; // Set default in case of error
        }
    };

    const handleFullscreenChange = () => {
        isFullscreen.value = !!document.fullscreenElement;
    };

    return {
        volume,
        isMuted,
        isFullscreen,
        playbackRate,
        togglePlay,
        handleSeek,
        setVolume,
        toggleFullscreen,
        handlePlaybackRateChange,
        handleKeyboardShortcuts,
        loadSavedVolume,
        handleFullscreenChange
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
        if (!videoPopups.value.length && !defaultPopupContent) return;
        if (!isPlaying.value) return;

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

        // Show default popup near the end if we have defaultPopupContent
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
        if (player.value && !isPlaying.value && player.value.getPlayerState() !== 0) {
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


