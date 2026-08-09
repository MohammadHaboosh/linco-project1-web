import React, { useState } from "react";
import styles from "./CourseViewer.module.css";
import {
  IoPlay,
  IoVolumeHighOutline,
  IoSettingsOutline,
  IoExpandOutline,
  IoPause,
} from "react-icons/io5";

const VideoContent = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={styles.videoWrapper}>
      <div className={styles.videoContainer}>
        <div className={styles.videoBackdrop}>
          <div className={styles.videoGrid} />
          <div className={styles.codeCard}>
            <span>React Hook</span>
            <code>useEffect(() =&gt; {"{"} ... {"}"}, [])</code>
          </div>

          <button
            type="button"
            className={styles.playButtonOverlay}
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "إيقاف الفيديو" : "تشغيل الفيديو"}
          >
            {playing ? <IoPause /> : <IoPlay />}
          </button>

          <div className={styles.videoTitleOverlay}>
            <span>LESSON 04</span>
            <strong>Component Lifecycle & Hooks</strong>
          </div>

          <div className={styles.videoControls}>
            <div className={styles.progressTrack}><i /></div>
            <div className={styles.controlRow}>
              <div>
                <button type="button"><IoPlay /></button>
                <button type="button"><IoVolumeHighOutline /></button>
                <span>04:18 / 12:40</span>
              </div>
              <div>
                <button type="button"><IoSettingsOutline /></button>
                <button type="button"><IoExpandOutline /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoContent;
