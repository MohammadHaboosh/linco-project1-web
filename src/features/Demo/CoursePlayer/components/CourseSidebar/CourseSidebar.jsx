import React from "react";
import styles from "./CourseSidebar.module.css";
import {
  IoListOutline,
  IoSparklesOutline,
  IoChevronForwardOutline,
  IoChevronBackOutline,
} from "react-icons/io5";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import AIFloatingAssistant from "../AIFloatingAssistant/AIFloatingAssistant";

const CourseSidebar = ({
  isOpen,
  setIsOpen,
  activeTab,
  setActiveTab,
  activeLesson,
  onSelectLesson,
}) => {
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
      {/* Content Area (Left side of the sidebar) */}
      <div className={styles.sidebarContent}>
        <div className={styles.contentHeader}>
          <div className={styles.headerTitles}>
            <span className={styles.headerEyebrow}>
              {activeTab === "curriculum" ? "LEARNING PATH" : "SMART STUDY"}
            </span>
            <h2>
              {activeTab === "curriculum"
                ? "Course Curriculum"
                : "AI Assistant"}
            </h2>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <IoChevronForwardOutline />
          </button>
        </div>

        <div className={styles.scrollableArea}>
          {activeTab === "curriculum" ? (
            <CurriculumSidebar
              activeLesson={activeLesson}
              onSelectLesson={onSelectLesson}
            />
          ) : (
            <AIFloatingAssistant />
          )}
        </div>
      </div>

      {/* Navigation Rail (Right side of the sidebar) */}
      <div className={styles.verticalNav}>
        {!isOpen && (
          <button className={styles.expandBtn} onClick={() => setIsOpen(true)}>
            <IoChevronBackOutline />
          </button>
        )}

        <button
          className={`${styles.navBtn} ${activeTab === "curriculum" && isOpen ? styles.activeNavBtn : ""}`}
          onClick={() => handleTabClick("curriculum")}
          title="Course Content"
          type="button"
        >
          <div className={styles.navIconBox}>
            <IoListOutline />
          </div>
          {isOpen && <span className={styles.navText}>Path</span>}
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
          {isOpen && <span className={styles.navText}>Smart</span>}
        </button>
      </div>
    </aside>
  );
};

export default CourseSidebar;
