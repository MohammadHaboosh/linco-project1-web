import React from "react";
import styles from "./CourseViewer.module.css";
import { IoVideocamOutline } from "react-icons/io5";

const VideoContent = ({ activeLesson }) => {
  if (!activeLesson) {
    return (
      <div className={styles.videoStage}>
        <div className={styles.emptyVideoState}>
          <IoVideocamOutline className={styles.emptyVideoIcon} />
          <h3>Select a lesson to start watching</h3>
          <p>Choose a lesson from the curriculum sidebar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.videoStage}>
      <div className={styles.videoBackdrop}>
        <div className={styles.videoTopbar}>
          <div>
            <span className={styles.videoEyebrow}>CURRENT LESSON</span>
            <h2>{activeLesson.title}</h2>
          </div>
        </div>

        <div className={styles.videoPlayerContainer}>
          <video
            key={activeLesson.videoUrl}
            className={styles.realVideoElement}
            controls
            controlsList="nodownload"
            autoPlay
          >
            <source src={activeLesson.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoContent;
