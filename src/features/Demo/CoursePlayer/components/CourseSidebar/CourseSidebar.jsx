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
    >
      <div className={styles.verticalNav}>
        <div className={styles.navBrand} aria-hidden="true">
          L
        </div>
        <div className={styles.navDivider} />
        <button
          type="button"
          className={`${styles.navBtn} ${activeTab === "curriculum" && isOpen ? styles.activeNavBtn : ""}`}
          onClick={() => handleTabClick("curriculum")}
          title="Course content"
          aria-label="Course content"
        >
          <IoListOutline />
          <span>Content</span>
        </button>
        <button
          type="button"
          className={`${styles.navBtn} ${styles.aiBtn} ${activeTab === "ai" && isOpen ? styles.activeAiBtn : ""}`}
          onClick={() => handleTabClick("ai")}
          title="AI assistant"
          aria-label="AI assistant"
        >
          <IoSparklesOutline />
          <span>AI</span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.sidebarContent}>
          <div className={styles.contentHeader}>
            <div>
              <span>
                {activeTab === "curriculum" ? "LEARNING PATH" : "SMART STUDY"}
              </span>
              <h2>
                {activeTab === "curriculum"
                  ? "Course Content"
                  : "AI Study Assistant"}
              </h2>
            </div>
            <button
              type="button"
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
              <AIFloatingAssistant defaultOpen />
            )}
          </div>
        </div>
      )}
    </aside>
  );
};

export default CourseSidebar;
