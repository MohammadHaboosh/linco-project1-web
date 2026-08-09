import React from "react";
import styles from "./CourseViewer.module.css";

const VideoContent = () => {
  return (
    <div className={styles.videoWrapper}>
      <div className={styles.videoContainer}>
        <div className={styles.videoPlaceholder}>
          <div className={styles.playButtonOverlay}>
            {/* يمكنك استخدام أيقونة بلاي من مكتبة React Icons هنا */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Play Lesson</span>
          </div>
        </div>
      </div>
      
      <div className={styles.lessonDetails}>
        <h2>Component Lifecycle & Hooks</h2>
        <p>
          Dive deep into the mechanics of functional components. Learn how to manage 
          state, side effects, and clean up subscriptions using modern React Hooks 
          to build scalable applications.
        </p>
      </div>
    </div>
  );
};

export default VideoContent;