import React, { useState } from "react";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import VideoContent from "./VideoContent";
import LessonTabs from "../LessonTabs/LessonTabs";
import AIFloatingAssistant from "../AIFloatingAssistant/AIFloatingAssistant";
import styles from "./CourseViewer.module.css";
import {
  IoMenuOutline,
  IoArrowBackOutline,
  IoSaveOutline,
} from "react-icons/io5";

const CourseViewer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.viewerContainer} dir="rtl">
      <div className={styles.mainLayout}>
        {/* القائمة الجانبية (المنهج) */}
        <aside
          className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        >
          <CurriculumSidebar />
        </aside>

        {/* مساحة عرض المحتوى */}
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
