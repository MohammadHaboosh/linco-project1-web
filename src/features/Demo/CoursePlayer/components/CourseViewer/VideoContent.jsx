import { useEffect, useRef, useState, useMemo } from "react";
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

const VideoContent = ({ activeLesson, onNext, onPrev }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const PreviousIcon = isRtl ? IoPlaySkipForwardOutline : IoPlaySkipBackOutline;
  const NextIcon = isRtl ? IoPlaySkipBackOutline : IoPlaySkipForwardOutline;
  const plyrRef = useRef(null);
  const hlsRef = useRef(null);

  const [qualityOptions, setQualityOptions] = useState([0]);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const [prevVideoUrl, setPrevVideoUrl] = useState(activeLesson?.videoUrl);
  if (activeLesson?.videoUrl !== prevVideoUrl) {
    setPrevVideoUrl(activeLesson?.videoUrl);
    setQualityOptions([0]);
    setIsPlayerReady(false);
  }

  const formatHlsUrl = (originalUrl) => {
    if (!originalUrl) return "";
    if (originalUrl.includes(".m3u8")) return originalUrl;
    return originalUrl
      .replace("/uploads/lessons/", "/uploads/hls/lessons/")
      .replace(".mp4", "/master.m3u8");
  };

  useEffect(() => {
    const finalVideoUrl = formatHlsUrl(activeLesson?.videoUrl);
    const isHls = finalVideoUrl.includes(".m3u8");

    if (!activeLesson?.videoUrl) return;

    if (isHls && Hls.isSupported()) {
      let isMounted = true;
      const tempHls = new Hls();

      tempHls.loadSource(finalVideoUrl);

      tempHls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isMounted) {
          const availableQualities = tempHls.levels
            .map((l) => l.height)
            .sort((a, b) => b - a);

          availableQualities.unshift(0);
          setQualityOptions(availableQualities);
          setIsPlayerReady(true);
        }
        tempHls.destroy();
      });

      tempHls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal && isMounted) {
          setQualityOptions([0]);
          setIsPlayerReady(true);
          tempHls.destroy();
        }
      });

      return () => {
        isMounted = false;
        tempHls.destroy();
      };
    } else {
      Promise.resolve().then(() => {
        setQualityOptions([0]);
        setIsPlayerReady(true);
      });
    }
  }, [activeLesson?.videoUrl]);

  useEffect(() => {
    if (!isPlayerReady || !plyrRef.current || !plyrRef.current.plyr) return;

    const finalVideoUrl = formatHlsUrl(activeLesson?.videoUrl);
    const isHls = finalVideoUrl.includes(".m3u8");
    const video = plyrRef.current.plyr.media;

    if (isHls && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(finalVideoUrl);
      hls.attachMedia(video);

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = finalVideoUrl;
    }
  }, [activeLesson?.videoUrl, isPlayerReady]);

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
        qualityLabel: {
          0: "Auto",
        },
      },
      seekTime: 10,
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
    }),
    [qualityOptions],
  );

  if (!activeLesson) {
    return (
      <div className={styles.videoStage}>
        <div className={styles.emptyVideoState}>
          <IoVideocamOutline className={styles.emptyVideoIcon} />
          <h3>{t("select-a-lesson-to-start-watching")}</h3>
          <p>{t("choose-a-lesson-from-the-curriculum-sidebar")}</p>
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
        <div className={styles.videoPlayerContainer}>
          {!isPlayerReady ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: "300px",
              }}
            >
              <style>{`@keyframes plyr-spin { to { transform: rotate(360deg); } }`}</style>
              <span
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid rgba(255,255,255,0.2)",
                  borderTopColor: "#1a56db",
                  borderRadius: "50%",
                  animation: "plyr-spin 1s linear infinite",
                }}
              />
            </div>
          ) : (
            <Plyr ref={plyrRef} source={videoSrc} options={plyrOptions} />
          )}

          <div className={styles.videoTopbarOverlay}>
            <span className={styles.videoEyebrow}>{t("current-lesson")}</span>
            <h2>{activeLesson.title}</h2>
          </div>
        </div>

        <div className={styles.customVideoControls}>
          <button className={styles.navVideoBtn} onClick={onPrev}>
            <PreviousIcon /> {t("prev-lesson")}
          </button>

          <button className={styles.navVideoBtn} onClick={onNext}>
            {t("next-lesson")} <NextIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoContent;
