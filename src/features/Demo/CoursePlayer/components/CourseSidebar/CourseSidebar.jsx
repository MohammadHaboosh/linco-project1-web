import React from "react";
import styles from "./CourseSidebar.module.css";
import {
  IoListOutline,
  IoSparklesOutline,
  IoChevronForwardOutline,
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
          type="button"
        >
          <div className={styles.navIconBox}>
            <IoListOutline />
          </div>
          <span className={styles.navText}>Course Content</span>
        </button>

        <button
          className={`${styles.navBtn} ${styles.aiBtn} ${activeTab === "ai" && isOpen ? styles.activeAiBtn : ""}`}
          onClick={() => handleTabClick("ai")}
          title="Smart Assistant"
          type="button"
        >
          <div className={styles.navIconBox}>
            <IoSparklesOutline />
          </div>
          <span className={styles.navText}>AI Assistant</span>
        </button>
      </div>

      <div className={styles.sidebarContent}>
        <div className={styles.contentHeader}>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <IoChevronForwardOutline />
          </button>
          <div className={styles.headerTitles}>
            <span className={styles.headerEyebrow}>
              {activeTab === "curriculum" ? "LEARNING PATH" : "SMART STUDY"}
            </span>
            <h2>
              {activeTab === "curriculum" ? "Course Content" : "AI Assistant"}
            </h2>
          </div>
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
