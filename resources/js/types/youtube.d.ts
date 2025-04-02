interface YTPlayerState {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
}

interface YTPlayer {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    loadVideoById(videoId: string, startSeconds?: number): void;
    cueVideoById(videoId: string, startSeconds?: number): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setVolume(volume: number): void;
    getVolume(): number;
    getVideoLoadedFraction(): number;
    getPlayerState(): number;
    getCurrentTime(): number;
    getDuration(): number;
    destroy(): void;
}

interface YTPlayerEvent {
    target: YTPlayer;
    data: number;
}

interface YTPlayerOptions {
    videoId?: string;
    playerVars?: {
        autoplay?: 0 | 1;
        cc_load_policy?: 1;
        color?: 'red' | 'white';
        controls?: 0 | 1 | 2;
        disablekb?: 0 | 1;
        enablejsapi?: 0 | 1;
        end?: number;
        fs?: 0 | 1;
        hl?: string;
        iv_load_policy?: 1 | 3;
        list?: string;
        listType?: 'playlist' | 'user_uploads' | 'search';
        loop?: 0 | 1;
        modestbranding?: 0 | 1;
        origin?: string;
        playlist?: string;
        playsinline?: 0 | 1;
        rel?: 0 | 1;
        start?: number;
        widget_referrer?: string;
    };
    events?: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerEvent) => void;
        onPlaybackQualityChange?: (event: YTPlayerEvent) => void;
        onPlaybackRateChange?: (event: YTPlayerEvent) => void;
        onError?: (event: { target: YTPlayer; data: number }) => void;
        onApiChange?: (event: YTPlayerEvent) => void;
    };
    height?: number | string;
    width?: number | string;
}

interface YT {
    Player: {
        new(elementId: string | HTMLElement, options: YTPlayerOptions): YTPlayer;
    };
    PlayerState: YTPlayerState;
}

// Extend Window interface
interface Window {
    YT?: YT;
    onYouTubeIframeAPIReady?: () => void;
}
