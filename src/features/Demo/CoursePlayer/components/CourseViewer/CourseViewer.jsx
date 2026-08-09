import React, { useState } from "react";
import VideoContent from "./VideoContent";
import CurriculumSidebar from "../CurriculumSidebar/CurriculumSidebar";
import LessonTabs from "../LessonTabs/LessonTabs";
import AIFloatingAssistant from "../AIFloatingAssistant/AIFloatingAssistant";
import styles from "./CourseViewer.module.css";
import {
  IoArrowForwardOutline,
  IoCheckmarkCircle,
  IoChevronDownOutline,
  IoMenuOutline,
  IoOptionsOutline,
  IoPlayOutline,
  IoSparklesOutline,
} from "react-icons/io5";

const CourseViewer = () => {
  const [activeLesson, setActiveLesson] = useState(102);
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);

  return (
    <div className={styles.viewerContainer} dir="rtl" lang="ar">
      <header className={styles.topHeader}>
        <div className={styles.headerInner}>
          <div className={styles.headerStart}>
            <button
              type="button"
              className={styles.backBtn}
              aria-label="العودة"
            >
              <IoArrowForwardOutline />
            </button>

            <div className={styles.courseIdentity}>
              <div className={styles.eyebrow}>
                Frontend Masterclass
                <span>•</span>
                <span className={styles.liveBadge}>● مباشر</span>
              </div>
              <h1>Advanced React & Next.js Architecture</h1>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.headerProgress}>
              <span>تقدمك في الكورس</span>
              <strong>68%</strong>
              <div>
                <i style={{ width: "68%" }} />
              </div>
            </div>
            <button
              type="button"
              className={styles.mobileCurriculumBtn}
              onClick={() => setMobileCurriculumOpen((value) => !value)}
            >
              <IoMenuOutline />
              المحتوى
            </button>
          </div>
        </div>
      </header>

      <main className={styles.page}>
        <section className={styles.videoStage}>
          <div className={styles.videoColumn}>
            <div className={styles.videoShell}>
              <VideoContent />
            </div>

            <div className={styles.lessonMetaBar}>
              <div>
                <div className={styles.lessonKicker}>
                  <span>Section 02</span>
                  <span>•</span>
                  <span>Lesson 04</span>
                </div>
                <h2>Component Lifecycle & Hooks</h2>
              </div>

              <div className={styles.lessonActions}>
                <button type="button">
                  <IoCheckmarkCircle /> تم الإنجاز
                </button>
                <button type="button">
                  <IoOptionsOutline /> خيارات
                </button>
              </div>
            </div>
          </div>

          <div className={styles.aiColumn}>
            <AIFloatingAssistant />
          </div>
        </section>

        <section className={styles.lessonTabsSection}>
          <LessonTabs />
        </section>

        <section
          className={`${styles.curriculumSection} ${mobileCurriculumOpen ? styles.curriculumMobileOpen : ""}`}
        >
          <div className={styles.curriculumHeader}>
            <div>
              <span className={styles.sectionEyebrow}>
                <IoSparklesOutline /> LEARNING PATH
              </span>
              <h2>محتوى الكورس</h2>
              <p>تابع تقدمك، افتح الدروس، وراجع التقييمات من مكان واحد.</p>
            </div>
            <button type="button" className={styles.collapseButton}>
              <IoChevronDownOutline />
              ترتيب الأقسام
            </button>
          </div>

          <CurriculumSidebar
            activeLesson={activeLesson}
            setActiveLesson={setActiveLesson}
          />
        </section>

        <div className={styles.nextLessonBar}>
          <div>
            <span>الدرس التالي</span>
            <strong>Understanding Virtual DOM & Lifecycle</strong>
          </div>
          <button type="button">
            متابعة الدرس
            <IoPlayOutline />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CourseViewer;
