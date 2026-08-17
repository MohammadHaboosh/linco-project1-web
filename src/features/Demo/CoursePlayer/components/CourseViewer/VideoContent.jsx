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
    const finalVideoUrl = formatHlsUrl(activeLesson?.videoUrl);
    const isHls = finalVideoUrl.includes(".m3u8");

    if (!activeLesson?.videoUrl) return;

    if (!isHls || !Hls.isSupported()) {
      Promise.resolve().then(() => setIsPlayerReady(true));
      return;
    }

    let isMounted = true;
    const tempHls = new Hls();
    tempHls.loadSource(finalVideoUrl);

    tempHls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (isMounted) {
        const availableQualities = [
          ...new Set(tempHls.levels.map((level) => level.height)),
        ].sort((a, b) => b - a);

        setQualityOptions([0, ...availableQualities]);
        setIsPlayerReady(true);
      }
      tempHls.destroy();
    });

    tempHls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal && isMounted) {
        setPlaybackState("error");
        tempHls.destroy();
      }
    });

    return () => {
      isMounted = false;
      tempHls.destroy();
    };
  }, [activeLesson?.videoUrl, retryToken]);

  useEffect(() => {
    if (!isPlayerReady || !activeLesson?.videoUrl) return;

    let animationFrameId = null;
    let video = null;
    let playbackHls = null;
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

      const finalVideoUrl = formatHlsUrl(activeLesson.videoUrl);
      const isHls = finalVideoUrl.includes(".m3u8");

      video.addEventListener("canplay", handleReady);
      video.addEventListener("loadeddata", handleReady);
      video.addEventListener("error", handlePlaybackError);

      if (isHls && Hls.isSupported()) {
        playbackHls = new Hls();
        hlsRef.current = playbackHls;
        playbackHls.loadSource(finalVideoUrl);
        playbackHls.attachMedia(video);
        playbackHls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) handlePlaybackError();
        });
      } else if (
        isHls &&
        video.canPlayType("application/vnd.apple.mpegurl")
      ) {
        video.src = finalVideoUrl;
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
        video.removeEventListener("error", handlePlaybackError);
      }

      if (playbackHls) {
        playbackHls.destroy();
      }
      if (hlsRef.current === playbackHls) {
        hlsRef.current = null;
      }
    };
  }, [activeLesson?.videoUrl, isPlayerReady, retryToken]);

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
      <div className={styles.videoStage}>
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
      <div className={styles.videoStage}>
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

  const finalVideoUrl = formatHlsUrl(activeLesson.videoUrl);
  const isHls = finalVideoUrl.includes(".m3u8");
  const videoSrc = {
    type: "video",
    sources: [
      {
        src: finalVideoUrl,
        type: isHls ? "application/x-mpegURL" : "video/mp4",
      },
    ],
  };

  return (
    <div className={styles.videoStage}>
      <div className={styles.videoBackdrop}>
        <div
          className={styles.videoPlayerContainer}
        >
          <Plyr ref={plyrRef} source={videoSrc} options={plyrOptions} />

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

        <div className={styles.customVideoControls}>
          <button
            type="button"
            className={styles.navVideoBtn}
            onClick={onPrev}
            disabled={!canGoPrev}
            aria-label={t("prev-lesson")}
          >
            <PreviousIcon aria-hidden="true" /> {t("prev-lesson")}
          </button>

          <button
            type="button"
            className={styles.navVideoBtn}
            onClick={onNext}
            disabled={!canGoNext}
            aria-label={t("next-lesson")}
          >
            {t("next-lesson")} <NextIcon aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoContent;
