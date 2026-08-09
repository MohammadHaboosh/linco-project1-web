import React, { useState } from "react";
import styles from "./LessonTabs.module.css";

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Q&A", "My Notes"];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {activeTab === "Overview" && (
          <div className={styles.panel}>
            <h3>About this lesson</h3>
            <p>
              In this lesson, we dive deep into the Document Object Model (DOM).
              You will learn how browsers render HTML, how to traverse the DOM
              tree efficiently, and best practices for manipulation.
            </p>
          </div>
        )}
        {activeTab === "Q&A" && (
          <div className={styles.panel}>
            <p className={styles.placeholderText}>
              No questions asked yet. Be the first to ask!
            </p>
          </div>
        )}
        {activeTab === "My Notes" && (
          <div className={styles.panel}>
            <textarea
              className={styles.notesInput}
              placeholder="Type your personal notes here..."
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonTabs;
