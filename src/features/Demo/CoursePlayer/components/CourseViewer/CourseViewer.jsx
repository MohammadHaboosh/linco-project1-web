import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoContent from "./VideoContent";
import LessonTabs from "../LessonTabs/LessonTabs";
import CourseSidebar from "../CourseSidebar/CourseSidebar";
import styles from "./CourseViewer.module.css";
import {
  IoChevronBackOutline,
  IoTrophyOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";

const CourseViewer = () => {
  const navigate = useNavigate();
  const { demoId, departmentId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("curriculum");

  const [activeLesson, setActiveLesson] = useState(null);

  const handleBackToCourses = () => {
    navigate(`/demos/${demoId}/departments/${departmentId}/courses`);
  };

  return (
    <div className={styles.viewerContainer} dir="ltr">
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBackToCourses}
          >
            <IoChevronBackOutline />
            <span>Back to Courses</span>
          </button>
          <div className={styles.divider} />
          <div className={styles.courseIdentity}>
            <span>Frontend Masterclass</span>
            <h1>Advanced Front-End Architecture</h1>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.progressBlock}>
            <div className={styles.progressIcon}>
              <IoTrophyOutline />
            </div>
            <div className={styles.progressText}>
              <span className={styles.progressLabel}>COURSE PROGRESS</span>
              <strong>35%</strong>
            </div>
            <div className={styles.progressTrack} aria-label="Course progress">
              <span style={{ width: "35%" }} />
            </div>
            <IoCheckmarkCircle className={styles.progressCheck} />
          </div>
        </div>
      </header>

      <main className={styles.mainLayout}>
        <section className={styles.contentColumn}>
          <div className={styles.videoWrapper}>
            <VideoContent activeLesson={activeLesson} />
          </div>
          <div className={styles.tabsWrapper}>
            <LessonTabs />
          </div>
        </section>

        <CourseSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
          activeLesson={activeLesson}
          onSelectLesson={setActiveLesson}
        />
      </main>
    </div>
  );
};

export default CourseViewer;
