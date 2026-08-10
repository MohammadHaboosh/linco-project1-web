import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // 👈 إضافة useLocation
import VideoContent from "./VideoContent";
import LessonTabs from "../LessonTabs/LessonTabs";
import CourseSidebar from "../CourseSidebar/CourseSidebar";
import styles from "./CourseViewer.module.css";
import {
  IoChevronBackOutline,
  IoTrophyOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { PATHS } from "../../../../../routes/paths";
import { useTranslation } from "react-i18next";

const CourseViewer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { demoId, departmentId, courseId } = useParams();

  const location = useLocation();
  const passedCourseData = location.state?.courseData || null;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("curriculum");

  const [activeLesson, setActiveLesson] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  const courseTitle = passedCourseData?.title || "Loading Course...";

  const handleBackToCourses = () => {
    navigate(`/demos/${demoId}/departments/${departmentId}/${PATHS.COURSES}`);
  };

  const handleSelectLesson = (lesson, playlist) => {
    setActiveLesson(lesson);
    if (playlist) setCurrentPlaylist(playlist);
  };

  const handleNextLesson = () => {
    if (!activeLesson || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(
      (l) => l.id === activeLesson.id,
    );

    if (currentIndex < currentPlaylist.length - 1) {
      setActiveLesson(currentPlaylist[currentIndex + 1]);
    } else {
      alert("لقد وصلت لنهاية هذا القسم!");
    }
  };

  const handlePrevLesson = () => {
    if (!activeLesson || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(
      (l) => l.id === activeLesson.id,
    );

    if (currentIndex > 0) {
      setActiveLesson(currentPlaylist[currentIndex - 1]);
    }
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
            <span>{t("back-to-courses")}</span>
          </button>
          <div className={styles.divider} />
          <div className={styles.courseIdentity}>
            <span>{courseTitle}</span>
            <h1>
              {activeLesson
                ? activeLesson.title
                : "Select a lesson from the curriculum"}
            </h1>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.progressBlock}>
            <div className={styles.progressIcon}>
              <IoTrophyOutline />
            </div>
            <div className={styles.progressText}>
              <span className={styles.progressLabel}>COURSE PROGRESS</span>
              <strong>{passedCourseData?.progress || 0}%</strong>
            </div>
            <div className={styles.progressTrack} aria-label="Course progress">
              <span style={{ width: `${passedCourseData?.progress || 0}%` }} />
            </div>
            <IoCheckmarkCircle className={styles.progressCheck} />
          </div>
        </div>
      </header>

      <main className={styles.mainLayout}>
        <section className={styles.contentColumn}>
          <div className={styles.videoWrapper}>
            <VideoContent
              activeLesson={activeLesson}
              onNext={handleNextLesson}
              onPrev={handlePrevLesson}
            />
          </div>
          <div className={styles.tabsWrapper}>
            <LessonTabs activeLesson={activeLesson} />
          </div>
        </section>

        <CourseSidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activeTab={activeSidebarTab}
          setActiveTab={setActiveSidebarTab}
          activeLesson={activeLesson}
          onSelectLesson={handleSelectLesson}
        />
      </main>
    </div>
  );
};

export default CourseViewer;
