import { useState, useMemo } from "react";
import { IoMapOutline, IoAddOutline } from "react-icons/io5";
import PathStepCard from "./PathStepCard";
import ReplaceCourseModal from "./ReplaceCourseModal";
import styles from "./LearningPath.module.css";
import { useDemo } from "../../../../hooks/useDemo";
import { useTranslation } from "react-i18next";

const MOCK_PATH_COURSES = [
  {
    id: "c1",
    title: "HTML & CSS Fundamentals",
    desc: "Build the structure and style of web pages.",
    thumbnail: "/images/linco-logo.jpg",
    status: "completed",
  },
  {
    id: "c2",
    title: "JavaScript Deep Dive",
    desc: "Master JS engines, closures, and async programming.",
    thumbnail: "/images/linco-logo.jpg",
    status: "in-progress",
  },
  {
    id: "c3",
    title: "React Architecture",
    desc: "Learn to build scalable apps using modern React.",
    thumbnail: "/images/linco-logo.jpg",
    status: "locked",
  },
];

const LearningPathContent = () => {
  const { t } = useTranslation();
  const { currentRoleView } = useDemo();

  const [courses, setCourses] = useState(MOCK_PATH_COURSES);
  const [modalState, setModalState] = useState({
    isOpen: false,
    courseIdToReplace: null,
  });

  const displayCourses = useMemo(() => {
    if (currentRoleView === "member") {
      const completed = courses.filter((c) => c.status === "completed");
      const pending = courses.filter((c) => c.status !== "completed");
      return [...pending, ...completed];
    }
    return courses;
  }, [courses, currentRoleView]);

  const handleDelete = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleReplaceClick = (id) => {
    setModalState({ isOpen: true, courseIdToReplace: id });
  };

  const executeReplace = (newCourseData) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === modalState.courseIdToReplace
          ? { ...newCourseData, status: c.status }
          : c,
      ),
    );
    setModalState({ isOpen: false, courseIdToReplace: null });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerArea}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoMapOutline className={styles.headerIcon} />
            </div>
            <div>
              <span className={styles.subHeading}>
                {t("department-journey")}
              </span>
              <h1 className={styles.title}>{t("learning-path")}</h1>
              <p className={styles.description}>
                {t("follow-the-structured-curriculum-to-master-your-role")}
              </p>
            </div>
          </div>

          {(currentRoleView === "owner" || currentRoleView === "admin") && (
            <button className={styles.addCourseBtn}>
              <IoAddOutline /> {t("add-course-to-path")}
            </button>
          )}
        </div>

        <div className={styles.timelineContainer}>
          <div className={styles.timelineLine}></div>

          {displayCourses.map((course, index) => (
            <PathStepCard
              key={course.id}
              course={course}
              index={index}
              role={currentRoleView}
              onDelete={() => handleDelete(course.id)}
              onReplace={() => handleReplaceClick(course.id)}
            />
          ))}
        </div>
      </div>

      {modalState.isOpen && (
        <ReplaceCourseModal
          onClose={() =>
            setModalState({ isOpen: false, courseIdToReplace: null })
          }
          onSelectReplacement={executeReplace}
        />
      )}
    </div>
  );
};

export default LearningPathContent;
