import React, { useState } from "react";
import VideoContent from "./VideoContent";
import LessonTabs from "../LessonTabs/LessonTabs";
import CourseSidebar from "../CourseSidebar/CourseSidebar";
import styles from "./CourseViewer.module.css";
import { IoChevronBackOutline, IoTrophyOutline } from "react-icons/io5";

const CourseViewer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("curriculum"); // 'curriculum' or 'ai'

  return (
    <div className={styles.viewerContainer}>
      {/* Glassmorphism Header */}
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn}>
            <IoChevronBackOutline /> Back to Dashboard
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

      {/* Dynamic Main Layout */}
      <main className={styles.mainLayout}>
        <div className={styles.contentColumn}>
          <div className={styles.videoWrapper}>
            <VideoContent />
          </div>
          <div className={styles.tabsWrapper}>
            <LessonTabs />
          </div>
        </div>

        {/* The New Smart Sidebar */}
        <CourseSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
        />
      </main>
    </div>
  );
};

export default CourseViewer;
