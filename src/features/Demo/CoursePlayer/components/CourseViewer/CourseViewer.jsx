import React, { useState } from "react";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import VideoContent from "./VideoContent";
import LessonTabs from "../LessonTabs/LessonTabs";
import AIFloatingAssistant from "../AIFloatingAssistant/AIFloatingAssistant";
import styles from "./CourseViewer.module.css";
import { IoMenuOutline } from "react-icons/io5";

const CourseViewer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.viewerContainer} dir="rtl">
      <div className={styles.subHeader}>
        <button
          className={styles.menuBtn}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <IoMenuOutline /> {isSidebarOpen ? "إخفاء المنهج" : "إظهار المنهج"}
        </button>
        <div className={styles.pageTitle}>
          <span className={styles.editingMode}>LESSON 04</span>
          <h1>Component Lifecycle & Hooks</h1>
        </div>
      </div>

      <div className={styles.mainLayout}>
        <aside
          className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        >
          <div className={styles.sidebarInner}>
            <CurriculumSidebar />
          </div>
        </aside>

        <main className={styles.contentArea}>
          <div className={styles.videoStage}>
            <VideoContent />
          </div>
          <div className={styles.tabsStage}>
            <LessonTabs />
          </div>
        </main>
      </div>

      <AIFloatingAssistant />
    </div>
  );
};

export default CourseViewer;
