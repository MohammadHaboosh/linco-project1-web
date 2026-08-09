import React, { useState } from "react";
import VideoContent from "./VideoContent";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import LessonTabs from "../LessonTabs/LessonTabs";
import AIFloatingAssistant from "../AIFloatingAssistant/AIFloatingAssistant";
import styles from "./CourseViewer.module.css";
import { IoArrowBackOutline } from "react-icons/io5";

const CourseViewer = () => {
  const [activeLesson, setActiveLesson] = useState(1);

  return (
    <div className={styles.viewerContainer} dir="ltr" lang="en">
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} aria-label="Go back">
            <IoArrowBackOutline size={22} />
          </button>
          <div className={styles.courseInfo}>
            <span className={styles.courseLabel}>Frontend Masterclass</span>
            <h1 className={styles.courseTitle}>
              Advanced React & Next.js Architecture
            </h1>
          </div>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.contentArea}>
          <VideoContent />
          <LessonTabs />
        </div>

        <aside className={styles.sidebarArea}>
          <CurriculumSidebar
            activeLesson={activeLesson}
            setActiveLesson={setActiveLesson}
          />
        </aside>
      </div>

      <AIFloatingAssistant />
    </div>
  );
};

export default CourseViewer;
