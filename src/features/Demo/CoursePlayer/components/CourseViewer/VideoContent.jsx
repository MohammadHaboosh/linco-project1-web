import React from "react";
import { Plyr } from "plyr-react";
import "plyr-react/plyr.css";
import styles from "./CourseViewer.module.css";
import {
  IoVideocamOutline,
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";

const VideoContent = ({ activeLesson, onNext, onPrev }) => {
  const { t } = useTranslation();

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

  const videoSrc = {
    type: "video",
    sources: [
      {
        src: activeLesson.videoUrl,
        type: "video/mp4",
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
          <Plyr source={videoSrc} options={plyrOptions} />

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
