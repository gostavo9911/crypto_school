import { ref, Ref } from 'vue';

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

    const initializePlayer = (videoId: string, autoplay: boolean, initialVolume?: number) => {
        loading.value = true;

        if (typeof window === 'undefined') return;

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = () => createPlayer(videoId, autoplay, initialVolume);
        } else {
            createPlayer(videoId, autoplay, initialVolume);
        }
    };

    const createPlayer = (videoId: string, autoplay: boolean, initialVolume?: number) => {
        if (!iframeRef.value || typeof window === 'undefined' || !window.YT) return;

        try {
            player.value = new window.YT.Player(iframeRef.value, {
                events: {
                    onReady: () => onPlayerReady(autoplay, initialVolume),
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

    const onPlayerReady = (autoplay: boolean, initialVolume?: number) => {
        playerReady.value = true;
        loading.value = false;

        if (player.value) {
            duration.value = player.value.getDuration();

            // Set initial volume if provided
            if (typeof initialVolume === 'number') {
                player.value.setVolume(initialVolume * 100);
            }

            if (autoplay) {
                player.value.playVideo();
            }
        }

        emit('ready');
    };

    const onPlayerStateChange = (event: any) => {
        const state = event.data;
        handleStateChange(state);
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
