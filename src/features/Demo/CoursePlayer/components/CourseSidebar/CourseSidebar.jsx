import React from "react";
import styles from "./CourseSidebar.module.css";
import {
  IoListOutline,
  IoSparklesOutline,
  IoCloseOutline,
} from "react-icons/io5";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import AIFloatingAssistant from "../AIFloatingAssistant/AIFloatingAssistant";

const CourseSidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <aside
      className={`${styles.sidebarWrapper} ${isOpen ? styles.open : styles.closed}`}
      aria-label="Course learning sidebar"
      data-open={isOpen}
    >
      <div className={styles.verticalNav}>
        <button
          className={`${styles.navBtn} ${activeTab === "curriculum" && isOpen ? styles.activeNavBtn : ""}`}
          onClick={() => handleTabClick("curriculum")}
          title="Course Content"
          aria-label="Course Content"
        >
          <IoListOutline />
          {isOpen && <span>Content</span>}
        </button>

        <button
          className={`${styles.navBtn} ${styles.aiBtn} ${activeTab === "ai" && isOpen ? styles.activeAiBtn : ""}`}
          onClick={() => handleTabClick("ai")}
          title="AI Assistant"
          aria-label="AI Assistant"
        >
          <IoSparklesOutline />
          {isOpen && <span>AI</span>}
        </button>
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.contentHeader}>
          <div>
            <span className={styles.headerEyebrow}>
              {activeTab === "curriculum" ? "LEARNING PATH" : "SMART STUDY"}
            </span>
            <h2>
              {activeTab === "curriculum"
                ? "Course Content"
                : "AI Study Assistant"}
            </h2>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.scrollableArea}>
          {activeTab === "curriculum" ? (
            <CurriculumSidebar />
          ) : (
            <AIFloatingAssistant />
          )}
        </div>
      </div>
    </aside>
  );
};

export default CourseSidebar;
