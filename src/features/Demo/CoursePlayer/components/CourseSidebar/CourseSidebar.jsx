import React from "react";
import styles from "./CourseSidebar.module.css";
import {
  IoListOutline,
  IoSparklesOutline,
  IoCloseOutline,
} from "react-icons/io5";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import AIFloatingAssistant from "../AIFloatingAssistant/AIFloatingAssistant"; // Assuming you have this

const CourseSidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <aside
      className={`${styles.sidebarWrapper} ${isOpen ? styles.open : styles.closed}`}
    >
      {/* Vertical Navigation Bar */}
      <div className={styles.verticalNav}>
        <button
          className={`${styles.navBtn} ${activeTab === "curriculum" && isOpen ? styles.activeNavBtn : ""}`}
          onClick={() => handleTabClick("curriculum")}
          title="Course Content"
        >
          <IoListOutline />
        </button>
        <button
          className={`${styles.navBtn} ${styles.aiBtn} ${activeTab === "ai" && isOpen ? styles.activeAiBtn : ""}`}
          onClick={() => handleTabClick("ai")}
          title="AI Assistant"
        >
          <IoSparklesOutline />
        </button>
      </div>

      {/* Sidebar Content Area */}
      <div className={styles.sidebarContent}>
        <div className={styles.contentHeader}>
          <h2>
            {activeTab === "curriculum"
              ? "Course Content"
              : "AI Study Assistant"}
          </h2>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
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
