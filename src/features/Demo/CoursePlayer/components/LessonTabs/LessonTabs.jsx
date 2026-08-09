import React, { useState } from "react";
import styles from "./LessonTabs.module.css";

const LessonTabs = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "attachments", label: "الملحقات" },
    { id: "qa", label: "الأسئلة والأجوبة (Q&A)" },
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
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>
        {activeTab === "overview" && (
          <p>وصف محتوى الدرس سيظهر هنا مع تنسيق نظيف ومرتب...</p>
        )}
        {activeTab === "attachments" && <p>ملفات الدرس متاحة للتحميل...</p>}
        {activeTab === "qa" && <p>نقاشات الطلاب والأسئلة...</p>}
      </div>
    </div>
  );
};

export default LessonTabs;
