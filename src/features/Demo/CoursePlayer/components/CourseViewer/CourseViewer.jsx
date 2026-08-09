import React, { useState } from "react";
import VideoContent from "./VideoContent";
import CurriculumSidebar from "./CurriculumSidebar";
import LessonTabs from "./LessonTabs";
import AIFloatingAssistant from "./AIFloatingAssistant";
import styles from "./CourseViewer.module.css";
import { IoArrowBackOutline } from "react-icons/io5";

const CourseViewer = () => {
  const [activeLesson, setActiveLesson] = useState(1);

  return (
    <div className={styles.viewerContainer}>
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn}>
            <IoArrowBackOutline />
          </button>
          <div className={styles.courseInfo}>
            <span className={styles.courseLabel}>Course Name</span>
            <h1 className={styles.courseTitle}>
              Course Description | lesson name
            </h1>
          </div>
        </div>
      </header>

      {/* منطقة المحتوى الرئيسية */}
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

      {/* المساعد الذكي */}
      <AIFloatingAssistant />
    </div>
  );
};

export default CourseViewer;
