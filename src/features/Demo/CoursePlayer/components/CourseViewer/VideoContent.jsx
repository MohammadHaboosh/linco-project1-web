import React, { useEffect, useRef } from "react";
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
  const { t } = useTranslation();
  const plyrRef = useRef(null);

  const formatHlsUrl = (originalUrl) => {
    if (!originalUrl) return "";

    if (originalUrl.includes(".m3u8")) return originalUrl;

    return originalUrl
      .replace("/uploads/lessons/", "/uploads/hls/lessons/")
      .replace(".mp4", "/master.m3u8");
  };

  useEffect(() => {
    if (!activeLesson?.videoUrl || !plyrRef.current) return;

    const finalVideoUrl = formatHlsUrl(activeLesson.videoUrl);
    const isHls = finalVideoUrl.includes(".m3u8");

    const video = plyrRef.current.plyr.media;
    const plyr = plyrRef.current.plyr;

    let hls = null;

    if (isHls) {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(finalVideoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const availableQualities = hls.levels.map((l) => l.height);
          availableQualities.unshift(0);

          plyr.options.quality = {
            default: 0,
            options: availableQualities,
            forced: true,
            onChange: (newQuality) => {
              if (newQuality === 0) {
                hls.currentLevel = -1;
              } else {
                hls.levels.forEach((level, levelIndex) => {
                  if (level.height === newQuality) {
                    hls.currentLevel = levelIndex;
                  }
                });
              }
            },
          };

          plyr.config.i18n = {
            ...plyr.config.i18n,
            qualityLabel: {
              0: "Auto",
            },
          };
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = finalVideoUrl;
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [activeLesson?.videoUrl]);

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

  const plyrOptions = {
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
    seekTime: 10,
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
  };

  return (
    <div className={styles.videoStage}>
      <div className={styles.videoBackdrop}>
        <div
          className={styles.videoPlayerContainer}
          key={activeLesson.id || activeLesson.videoUrl}
        >
          <Plyr ref={plyrRef} source={videoSrc} options={plyrOptions} />

          <div className={styles.videoTopbarOverlay}>
            <span className={styles.videoEyebrow}>{t("current-lesson")}</span>
            <h2>{activeLesson.title}</h2>
          </div>
        </div>

        <div className={styles.customVideoControls}>
          <button className={styles.navVideoBtn} onClick={onPrev}>
            <IoPlaySkipBackOutline /> {t("prev-lesson")}
          </button>

          <button className={styles.navVideoBtn} onClick={onNext}>
            {t("next-lesson")} <IoPlaySkipForwardOutline />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoContent;
