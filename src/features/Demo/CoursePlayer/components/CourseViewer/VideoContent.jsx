import React from "react";
import styles from "./CourseViewer.module.css";

const VideoContent = () => {
  return (
    <div className={styles.videoWrapper}>
      <div className={styles.videoContainer}>
        <div className={styles.videoPlaceholder}>
          <div className={styles.playButtonOverlay}>
            <span>Video Player</span>
          </div>
        </div>
      </div>

      <div className={styles.lessonDetails}>
        <h2>Introduction to React and the Virtual DOM</h2>
        <p>
          In this lesson, we will explore the fundamentals of React and
          understand how the Virtual DOM works. React is a popular JavaScript
          library for building user interfaces, and the Virtual DOM is a key
          concept that allows React to efficiently update the UI by minimizing
          direct manipulation of the actual DOM. We will cover topics such as
          components, state, props, and how React's reconciliation process works
          to optimize rendering performance.
        </p>
      </div>
    </div>
  );
};

export default VideoContent;
