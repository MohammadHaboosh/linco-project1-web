import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import VideoContent from "./VideoContent";
import LessonTabs from "../LessonTabs/LessonTabs";
import CourseSidebar from "../CourseSidebar/CourseSidebar";
import QuizContainer from "../../../Quiz/components/QuizContainer";
import { DepartmentCoursesApi } from "../../../CoursesPage/api/DepartmentCoursesApi";
import styles from "./CourseViewer.module.css";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoTrophyOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { PATHS } from "../../../../../routes/paths";
import { useTranslation } from "react-i18next";

const CourseViewer = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { demoId, departmentId, courseId } = useParams();
  const isRtl = i18n.dir() === "rtl";
  const BackIcon = isRtl ? IoChevronForwardOutline : IoChevronBackOutline;

  const location = useLocation();
  const passedCourseData = location.state?.courseData || null;
  const [loadedCourse, setLoadedCourse] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("curriculum");

  const [activeLesson, setActiveLesson] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  useEffect(() => {
    if (passedCourseData || !demoId || !departmentId || !courseId) return;

    let isMounted = true;

    const loadCourse = async () => {
      try {
        const response = await DepartmentCoursesApi.getDepartmentCourse(
          demoId,
          departmentId,
        );
        const courseEntry = (response.data || []).find(
          (item) => String(item?.asset?.course?.id) === String(courseId),
        );
        const course = courseEntry?.asset?.course;

        if (isMounted && course) {
          setLoadedCourse({
            courseId: String(courseId),
            data: {
              ...course,
              progress:
                courseEntry.progress ??
                courseEntry.courseProgress ??
                course.progress ??
                0,
            },
          });
        }
      } catch (courseError) {
        console.error("Failed to reload course metadata:", courseError);
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [courseId, demoId, departmentId, passedCourseData]);

  const fetchedCourseData =
    loadedCourse?.courseId === String(courseId) ? loadedCourse.data : null;
  const courseData = passedCourseData || fetchedCourseData;
  const courseTitle = courseData?.title || t("loading-course");

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
      setActiveSidebarTab("curriculum");
      setIsSidebarOpen(true);
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

  const handleCompleteQuiz = () => {
    setActiveLesson(null);
    setCurrentPlaylist([]);
    setActiveSidebarTab("curriculum");
    setIsSidebarOpen(true);
  };

  return (
    <div className={styles.viewerContainer} dir={i18n.dir()}>
      <header className={styles.topHeader}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBackToCourses}
          >
            <BackIcon />
            <span>{t("back-to-courses")}</span>
          </button>
          <div className={styles.divider} />
          <div className={styles.courseIdentity}>
            <span>{courseTitle}</span>
            <h1>
              {activeLesson
                ? activeLesson.title
                : t("select-a-lesson-from-the-curriculum")}
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
              <strong>{courseData?.progress || 0}%</strong>
            </div>
            <div className={styles.progressTrack} aria-label="Course progress">
              <span style={{ width: `${courseData?.progress || 0}%` }} />
            </div>
            <IoCheckmarkCircle className={styles.progressCheck} />
          </div>
        </div>
      </header>

      <main className={styles.mainLayout}>
        {activeLesson?.isQuiz ? (
          <section className={styles.quizColumn}>
            <QuizContainer
              examId={activeLesson.id}
              onCompleteSection={handleCompleteQuiz}
            />
          </section>
        ) : (
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

        )}

        <CourseSidebar
          courseId={courseId}
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
