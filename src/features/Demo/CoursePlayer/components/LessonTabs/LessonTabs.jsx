import React, { useState } from "react";
import styles from "./LessonTabs.module.css";
import {
  IoInformationCircleOutline,
  IoChatbubblesOutline,
  IoDocumentTextOutline,
} from "react-icons/io5";

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { id: "Overview", icon: <IoInformationCircleOutline /> },
    { id: "Q&A", icon: <IoChatbubblesOutline /> },
    { id: "My Notes", icon: <IoDocumentTextOutline /> },
  ];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabHeaders}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.id}
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
        {/* You can keep the Q&A and Notes logic here as before */}
      </div>
    </div>
  );
};

export default LessonTabs;
