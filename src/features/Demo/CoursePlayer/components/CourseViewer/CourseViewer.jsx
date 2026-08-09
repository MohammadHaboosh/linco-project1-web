import React from "react";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import VideoContent from "./VideoContent";
import LessonTabs from "../LessonTabs/LessonTabs";
import styles from "./CourseViewer.module.css";
import { IoChevronBackOutline, IoTrophyOutline } from "react-icons/io5";

const CourseViewer = () => {
  return (
    <div className={styles.viewerContainer}>
      {/* Top Header */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn}>
            <IoChevronBackOutline /> Back
          </button>
          <div className={styles.divider}></div>
          <h1 className={styles.courseTitle}>
            Advanced Front-End Architecture
          </h1>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.progressBlock}>
            <IoTrophyOutline className={styles.trophyIcon} />
            <div className={styles.progressText}>
              <span className={styles.progressLabel}>YOUR PROGRESS</span>
              <span className={styles.progressValue}>35%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: "35%" }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className={styles.mainLayout}>
        {/* Left Column: Video & Tabs */}
        <div className={styles.contentColumn}>
          <div className={styles.videoWrapper}>
            <VideoContent />
          </div>
          <div className={styles.tabsWrapper}>
            <LessonTabs />
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <aside className={styles.sidebarColumn}>
          <CurriculumSidebar />
        </aside>
      </main>
    </div>
  );
};

export default CourseViewer;
