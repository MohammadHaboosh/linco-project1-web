import { useEffect, useMemo, useRef, useState } from "react";
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
  const hasCourseRouteParams = Boolean(demoId && departmentId && courseId);
  const [loadedCourse, setLoadedCourse] = useState(null);
  const [courseLoadState, setCourseLoadState] = useState(
    passedCourseData
      ? "success"
      : hasCourseRouteParams
        ? "loading"
        : "error",
  );
  const [courseLoadRetry, setCourseLoadRetry] = useState(0);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("curriculum");

  const [activeLesson, setActiveLesson] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const contentScrollRef = useRef(null);

  useEffect(() => {
    if (passedCourseData) return;

    if (!hasCourseRouteParams) return;

    let isMounted = true;

    const loadCourse = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      setCourseLoadState("loading");

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
          setCourseLoadState("success");
        } else if (isMounted) {
          setCourseLoadState("error");
        }
      } catch (courseError) {
        console.error("Failed to reload course metadata:", courseError);
        if (isMounted) setCourseLoadState("error");
      }
    };

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [
    courseId,
    courseLoadRetry,
    demoId,
    departmentId,
    hasCourseRouteParams,
    passedCourseData,
  ]);

  const fetchedCourseData =
    loadedCourse?.courseId === String(courseId) ? loadedCourse.data : null;
  const courseData = passedCourseData || fetchedCourseData;
  const courseTitle =
    courseData?.title ||
    (courseLoadState === "error"
      ? t("course-player-course-title-unavailable")
      : t("loading-course"));
  const rawProgress = Number(courseData?.progress);
  const courseProgress = Number.isFinite(rawProgress)
    ? Math.min(100, Math.max(0, rawProgress))
    : 0;
  const activeLessonId = activeLesson?.id;
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 0,
      }),
    [locale],
  );
  const formattedProgress = percentFormatter.format(courseProgress / 100);
  const activeLessonIndex = activeLesson
    ? currentPlaylist.findIndex((lesson) => lesson.id === activeLesson.id)
    : -1;
  const canGoToPreviousLesson = activeLessonIndex > 0;
  const canGoToNextLesson =
    activeLessonIndex >= 0 && activeLessonIndex < currentPlaylist.length - 1;

  useEffect(() => {
    if (!activeLessonId || !contentScrollRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    contentScrollRef.current.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [activeLessonId]);

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
            aria-label={t("back-to-courses")}
          >
            <BackIcon />
            <span>{t("back-to-courses")}</span>
          </button>
          <div className={styles.divider} aria-hidden="true" />
          <div className={styles.courseIdentity} aria-live="polite">
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
              <span className={styles.progressLabel}>
                {t("course-player-progress")}
              </span>
              <strong>{formattedProgress}</strong>
            </div>
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-label={t("course-progress-label", { title: courseTitle })}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(courseProgress)}
              aria-valuetext={t("course-player-progress-value", {
                progress: formattedProgress,
              })}
            >
              <span style={{ width: `${courseProgress}%` }} />
            </div>
            <IoCheckmarkCircle className={styles.progressCheck} />
          </div>
        </div>
      </header>

      {!passedCourseData && courseLoadState !== "success" && (
        <div
          className={`${styles.courseNotice} ${
            courseLoadState === "error" ? styles.courseNoticeError : ""
          }`}
          role={courseLoadState === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {courseLoadState === "loading" ? (
            <>
              <span className={styles.noticeSpinner} aria-hidden="true" />
              <span>{t("course-player-loading-details")}</span>
            </>
          ) : (
            <>
              <span>{t("course-player-details-load-failed")}</span>
              <button
                type="button"
                onClick={() => {
                  setCourseLoadState("loading");
                  setCourseLoadRetry((value) => value + 1);
                }}
              >
                {t("try-again")}
              </button>
            </>
          )}
        </div>
      )}

      <main
        className={styles.mainLayout}
        aria-label={t("course-player-learning-area")}
      >
        {activeLesson?.isQuiz ? (
          <section className={styles.quizColumn}>
            <QuizContainer
              examId={activeLesson.id}
              onCompleteSection={handleCompleteQuiz}
            />
          </section>
        ) : (
          <section className={styles.contentColumn} ref={contentScrollRef}>
            <div className={styles.videoWrapper}>
              <VideoContent
                key={activeLesson?.id || "no-active-lesson"}
                activeLesson={activeLesson}
                onNext={handleNextLesson}
                onPrev={handlePrevLesson}
                canGoNext={canGoToNextLesson}
                canGoPrev={canGoToPreviousLesson}
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
