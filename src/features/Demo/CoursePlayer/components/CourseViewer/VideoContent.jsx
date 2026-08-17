import { useEffect, useMemo, useRef, useState } from "react";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import styles from "./CourseViewer.module.css";
import {
  IoVideocamOutline,
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Hls from "hls.js";

const MAX_HLS_NETWORK_RECOVERY_ATTEMPTS = 2;
const MAX_HLS_MEDIA_RECOVERY_ATTEMPTS = 1;
const HLS_NETWORK_RECOVERY_DELAY_MS = 750;

const formatHlsUrl = (originalUrl) => {
  if (!originalUrl) return "";
  if (originalUrl.includes(".m3u8")) return originalUrl;
  return originalUrl
    .replace("/uploads/lessons/", "/uploads/hls/lessons/")
    .replace(".mp4", "/master.m3u8");
};

const VideoContent = ({
  activeLesson,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  showLessonNavigation = true,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const PreviousIcon = isRtl
    ? IoPlaySkipForwardOutline
    : IoPlaySkipBackOutline;
  const NextIcon = isRtl
    ? IoPlaySkipBackOutline
    : IoPlaySkipForwardOutline;
  const plyrRef = useRef(null);
  const hlsRef = useRef(null);
  const finalVideoUrl = formatHlsUrl(activeLesson?.videoUrl);
  const isHls = finalVideoUrl.includes(".m3u8");
  const usesHlsJs = isHls && Hls.isSupported();

  const [qualityOptions, setQualityOptions] = useState([0]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playbackState, setPlaybackState] = useState(
    activeLesson ? (activeLesson.videoUrl ? "loading" : "missing") : "idle",
  );
  const [retryToken, setRetryToken] = useState(0);

  const retryVideo = () => {
    setQualityOptions([0]);
    setIsPlayerReady(false);
    setPlaybackState("loading");
    setRetryToken((value) => value + 1);
  };

  useEffect(() => {
    if (!finalVideoUrl) return;

    let isMounted = true;

    if (!usesHlsJs) {
      Promise.resolve().then(() => {
        if (isMounted) setIsPlayerReady(true);
      });

      return () => {
        isMounted = false;
      };
    }

    const hls = new Hls({
      maxBufferLength: 20,
      maxMaxBufferLength: 60,
      backBufferLength: 30,
    });
    hlsRef.current = hls;
    let networkRecoveryAttempts = 0;
    let mediaRecoveryAttempts = 0;
    let recoveryTimeoutId = null;

    const handleManifestParsed = () => {
      if (!isMounted) return;
      networkRecoveryAttempts = 0;

      const availableQualities = [
        ...new Set(
          hls.levels
            .map((level) => level.height)
            .filter((height) => Number.isFinite(height) && height > 0),
        ),
      ].sort((a, b) => b - a);

      setQualityOptions([0, ...availableQualities]);
      setIsPlayerReady(true);
    };

    const handleHlsError = (_event, data) => {
      if (!data.fatal || !isMounted) return;

      if (
        data.type === Hls.ErrorTypes.NETWORK_ERROR &&
        networkRecoveryAttempts < MAX_HLS_NETWORK_RECOVERY_ATTEMPTS
      ) {
        networkRecoveryAttempts += 1;
        setPlaybackState("loading");
        if (recoveryTimeoutId !== null) {
          window.clearTimeout(recoveryTimeoutId);
        }
        recoveryTimeoutId = window.setTimeout(() => {
          recoveryTimeoutId = null;
          if (isMounted) hls.startLoad();
        }, HLS_NETWORK_RECOVERY_DELAY_MS * networkRecoveryAttempts);
        return;
      }

      if (
        data.type === Hls.ErrorTypes.MEDIA_ERROR &&
        mediaRecoveryAttempts < MAX_HLS_MEDIA_RECOVERY_ATTEMPTS
      ) {
        mediaRecoveryAttempts += 1;
        setPlaybackState("loading");
        hls.recoverMediaError();
        return;
      }

      setPlaybackState("error");
      hls.stopLoad();
    };

    const handleFragmentBuffered = () => {
      if (recoveryTimeoutId !== null) {
        window.clearTimeout(recoveryTimeoutId);
        recoveryTimeoutId = null;
      }
      networkRecoveryAttempts = 0;
      mediaRecoveryAttempts = 0;
    };

    hls.on(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
    hls.on(Hls.Events.ERROR, handleHlsError);
    hls.on(Hls.Events.FRAG_BUFFERED, handleFragmentBuffered);
    hls.loadSource(finalVideoUrl);

    return () => {
      isMounted = false;
      if (recoveryTimeoutId !== null) {
        window.clearTimeout(recoveryTimeoutId);
      }
      hls.off(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
      hls.off(Hls.Events.ERROR, handleHlsError);
      hls.off(Hls.Events.FRAG_BUFFERED, handleFragmentBuffered);
      hls.destroy();
      if (hlsRef.current === hls) hlsRef.current = null;
    };
  }, [finalVideoUrl, retryToken, usesHlsJs]);

  useEffect(() => {
    if (!isPlayerReady || !finalVideoUrl) return;

    let animationFrameId = null;
    let video = null;
    const playbackHls = usesHlsJs ? hlsRef.current : null;
    let isDisposed = false;
    const handleReady = () => setPlaybackState("ready");
    const handlePlaybackError = () => setPlaybackState("error");

    const initializePlayback = () => {
      if (isDisposed) return;

      video = plyrRef.current?.plyr?.media;
      if (!video) {
        animationFrameId = window.requestAnimationFrame(initializePlayback);
        return;
      }

      video.addEventListener("canplay", handleReady);
      video.addEventListener("loadeddata", handleReady);
      video.addEventListener("playing", handleReady);
      video.addEventListener("error", handlePlaybackError);

      if (playbackHls) {
        playbackHls.on(Hls.Events.FRAG_BUFFERED, handleReady);
        playbackHls.attachMedia(video);
      } else {
        video.src = finalVideoUrl;
        video.load();
      }

      if (video.readyState >= 2) handleReady();
    };

    initializePlayback();

    return () => {
      isDisposed = true;
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (video) {
        video.removeEventListener("canplay", handleReady);
        video.removeEventListener("loadeddata", handleReady);
        video.removeEventListener("playing", handleReady);
        video.removeEventListener("error", handlePlaybackError);
      }

      if (playbackHls && hlsRef.current === playbackHls) {
        playbackHls.off(Hls.Events.FRAG_BUFFERED, handleReady);
        if (playbackHls.media === video) playbackHls.detachMedia();
      } else if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [
    finalVideoUrl,
    isPlayerReady,
    qualityOptions,
    retryToken,
    t,
    usesHlsJs,
  ]);

  const plyrOptions = useMemo(
    () => ({
      controls: [
        "rewind",
        "play",
        "fast-forward",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["quality", "speed"],
      quality: {
        default: 0,
        options: qualityOptions,
        forced: true,
        onChange: (newQuality) => {
          if (!hlsRef.current) return;
          if (newQuality === 0) {
            hlsRef.current.currentLevel = -1;
          } else {
            hlsRef.current.levels.forEach((level, levelIndex) => {
              if (level.height === newQuality) {
                hlsRef.current.currentLevel = levelIndex;
              }
            });
          }
        },
      },
      i18n: {
        restart: t("player-restart"),
        rewind: t("player-rewind"),
        play: t("player-play"),
        pause: t("player-pause"),
        fastForward: t("player-fast-forward"),
        seek: t("player-seek"),
        seekLabel: t("player-seek-label"),
        played: t("player-played"),
        buffered: t("player-buffered"),
        currentTime: t("player-current-time"),
        duration: t("player-duration"),
        volume: t("player-volume"),
        mute: t("player-mute"),
        unmute: t("player-unmute"),
        enableCaptions: t("player-enable-captions"),
        disableCaptions: t("player-disable-captions"),
        download: t("player-download"),
        enterFullscreen: t("player-enter-fullscreen"),
        exitFullscreen: t("player-exit-fullscreen"),
        frameTitle: t("player-frame-title"),
        captions: t("player-captions"),
        settings: t("player-settings"),
        pip: t("player-picture-in-picture"),
        menuBack: t("player-menu-back"),
        speed: t("player-speed"),
        normal: t("player-normal-speed"),
        quality: t("player-quality"),
        loop: t("player-loop"),
        start: t("player-start"),
        end: t("player-end"),
        all: t("player-all"),
        reset: t("player-reset"),
        disabled: t("player-disabled"),
        enabled: t("player-enabled"),
        advertisement: t("player-advertisement"),
        qualityBadge: {
          2160: "4K",
          1440: "HD",
          1080: "HD",
          720: "HD",
          576: "SD",
          480: "SD",
        },
        qualityLabel: {
          0: t("player-automatic-quality"),
        },
      },
      seekTime: 10,
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      },
    }),
    [qualityOptions, t],
  );

  if (!activeLesson) {
    return (
      <div className={`${styles.videoStage} ${styles.emptyVideoStage}`}>
        <div className={styles.emptyVideoState}>
          <IoVideocamOutline
            className={styles.emptyVideoIcon}
            aria-hidden="true"
          />
          <h3>{t("select-a-lesson-to-start-watching")}</h3>
          <p>{t("choose-a-lesson-from-the-curriculum-sidebar")}</p>
        </div>
      </div>
    );
  }

  if (!activeLesson.videoUrl) {
    return (
      <div className={`${styles.videoStage} ${styles.emptyVideoStage}`}>
        <div className={styles.emptyVideoState} role="status">
          <IoVideocamOutline
            className={styles.emptyVideoIcon}
            aria-hidden="true"
          />
          <h3>{t("course-player-video-unavailable")}</h3>
          <p>{t("course-player-video-unavailable-description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoStage}>
      <div className={styles.videoBackdrop}>
        <div
          className={styles.videoPlayerContainer}
        >
          {isPlayerReady && (
            <Plyr
              ref={plyrRef}
              source={null}
              options={plyrOptions}
              preload="metadata"
              playsInline
            />
          )}

          {playbackState === "error" && (
            <div className={styles.videoErrorState} role="alert">
              <IoVideocamOutline aria-hidden="true" />
              <strong>{t("course-player-video-load-failed")}</strong>
              <span>{t("course-player-video-load-failed-description")}</span>
              <button type="button" onClick={retryVideo}>
                {t("try-again")}
              </button>
            </div>
          )}

          {playbackState !== "error" &&
            (playbackState === "loading" || !isPlayerReady) && (
              <div
                className={styles.videoLoadingOverlay}
                role="status"
                aria-live="polite"
              >
                <span aria-hidden="true" />
                {t("course-player-loading-video")}
              </div>
            )}

          <div className={styles.videoTopbarOverlay}>
            <span className={styles.videoEyebrow}>{t("current-lesson")}</span>
            <h2>{activeLesson.title}</h2>
          </div>
        </div>

        {showLessonNavigation && (
          <div className={styles.customVideoControls}>
            <button
              type="button"
              className={`${styles.navVideoBtn} ${styles.previousLessonBtn}`}
              onClick={onPrev}
              disabled={!canGoPrev}
              aria-label={t("prev-lesson")}
            >
              <PreviousIcon aria-hidden="true" />
              <span>{t("prev-lesson")}</span>
            </button>

            <button
              type="button"
              className={`${styles.navVideoBtn} ${styles.nextLessonBtn}`}
              onClick={onNext}
              disabled={!canGoNext}
              aria-label={t("next-lesson")}
            >
              <span>{t("next-lesson")}</span>
              <NextIcon aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoContent;
