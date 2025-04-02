import { ref, Ref } from 'vue';

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
    const videoQuality = ref('auto');

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

    const handleQualityChange = (quality: string) => {
        videoQuality.value = quality;
        player.value?.setPlaybackQuality(quality);
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
            if (savedVolume) {
                volume.value = parseFloat(savedVolume);
                isMuted.value = volume.value === 0;
            }
        } catch (e) {
            // Ignore storage errors
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
        videoQuality,
        togglePlay,
        handleSeek,
        setVolume,
        toggleFullscreen,
        handlePlaybackRateChange,
        handleQualityChange,
        handleKeyboardShortcuts,
        loadSavedVolume,
        handleFullscreenChange
    };
}