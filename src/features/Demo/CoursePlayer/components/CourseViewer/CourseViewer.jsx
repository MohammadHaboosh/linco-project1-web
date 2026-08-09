import React from "react";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import VideoContent from "./VideoContent";
import LessonTabs from "../LessonTabs/LessonTabs";
import AIFloatingAssistant from "../AIFloatingAssistant/AIFloatingAssistant";
import styles from "./CourseViewer.module.css";

const CourseViewer = () => {
  return (
    <div className={styles.viewerContainer} dir="rtl">
      {/* شريط علوي أنيق يعرض اسم الدرس بدلاً من أزرار التعديل */}
      <div className={styles.lessonHeader}>
        <div className={styles.titleArea}>
          <span className={styles.lessonBadge}>الدرس 4</span>
          <h1>دورة حياة المكونات و Hooks</h1>
        </div>
      </div>

      <div className={styles.mainLayout}>
        {/* منطقة المحتوى: الفيديو والتبويبات (يمين الشاشة لأننا RTL) */}
        <main className={styles.contentArea}>
          <div className={styles.videoStage}>
            <VideoContent />
          </div>
          <div className={styles.tabsStage}>
            <LessonTabs />
          </div>
        </main>

        {/* القائمة الجانبية: تعرض تقدم الطالب (يسار الشاشة) */}
        <aside className={styles.sidebar}>
          <CurriculumSidebar />
        </aside>
      </div>

      <AIFloatingAssistant />
    </div>
  );
};

export default CourseViewer;
