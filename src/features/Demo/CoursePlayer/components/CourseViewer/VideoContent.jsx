import React, { useState } from "react";
import {
  IoPlay,
  IoPause,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoVolumeHigh,
  IoSettingsOutline,
  IoExpandOutline,
  IoSpeedometerOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import styles from "./CourseViewer.module.css";

const VideoContent = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={styles.videoStage}>
      <div className={styles.videoBackdrop}>
        <div className={styles.videoAmbient} />
        <div className={styles.videoGrid} />

        <div className={styles.videoTopbar}>
          <div>
            <span className={styles.videoEyebrow}>CHAPTER 02 · LESSON 01</span>
            <h2>Understanding the DOM</h2>
          </div>
          <span className={styles.videoStatus}>
            <IoCheckmarkCircle /> In progress
          </span>
        </div>

        <div className={styles.centerControls}>
          <button type="button" className={styles.skipButton} aria-label="Previous">
            <IoPlaySkipBack />
          </button>
          <button
            type="button"
            className={styles.playButton}
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "Pause lesson" : "Play lesson"}
          >
            {playing ? <IoPause /> : <IoPlay />}
          </button>
          <button type="button" className={styles.skipButton} aria-label="Next">
            <IoPlaySkipForward />
          </button>
        </div>

        <div className={styles.videoBottom}>
          <div className={styles.videoProgress}>
            <span style={{ width: "45%" }} />
            <i style={{ left: "45%" }} />
          </div>
          <div className={styles.controlRow}>
            <div className={styles.controlGroup}>
              <button type="button" className={styles.controlButton} aria-label="Volume"><IoVolumeHigh /></button>
              <span className={styles.timeLabel}>06:45 <b>/</b> 15:20</span>
            </div>
            <div className={styles.controlGroup}>
              <button type="button" className={styles.controlButton} aria-label="Playback speed"><IoSpeedometerOutline /></button>
              <button type="button" className={styles.controlButton} aria-label="Captions"><IoSettingsOutline /></button>
              <button type="button" className={styles.controlButton} aria-label="Settings"><IoSettingsOutline /></button>
              <button type="button" className={styles.controlButton} aria-label="Fullscreen"><IoExpandOutline /></button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default VideoContent;