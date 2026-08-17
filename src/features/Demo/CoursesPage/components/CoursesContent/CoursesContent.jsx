import { useParams } from "react-router-dom";
import PageHeaderSection from "../sections/PageHeaderSection/PageHeaderSection";
import CoursesGridSection from "../sections/CoursesGridSection/CoursesGridSection";
import styles from "./CoursesContent.module.css";
import { useDemo } from "../../../../../hooks/useDemo";
import { useDepartmentCourses } from "../../hooks/useDepartmentCourses";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const CoursesContent = () => {
  const { t, i18n } = useTranslation();
  const { demoId, departmentId } = useParams();
  const { role } = useDemo();
  const isOwner = role === "owner";
  const [searchQuery, setSearchQuery] = useState("");
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const numberFormatter = new Intl.NumberFormat(locale);
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  const {
    courses: apiCourses,
    isLoading,
    error,
    deletingCourseId,
    deleteError,
    deleteCourse,
    retry,
  } = useDepartmentCourses(demoId, departmentId);

  const mappedCourses = apiCourses.flatMap((item) => {
    const courseData = item?.asset?.course;
    if (!courseData) return [];

    const duration = Number(courseData.totalDuration) || 0;
    const updatedAt = new Date(courseData.updatedAt);

    return [
      {
        id: courseData.id,
        title: courseData.title,
        description: courseData.description,
        image: courseData.imagePath,
        lessonsCount: Number(courseData.lessonCount) || 0,
        duration: t("course-duration-hours", {
          count: duration,
          formattedCount: numberFormatter.format(duration),
        }),
        progress: 0,
        views: 0,
        studentsCount: 0,
        status: courseData.isPublished ? "published" : "draft",
        lastUpdated: Number.isNaN(updatedAt.getTime())
          ? t("date-not-available")
          : dateFormatter.format(updatedAt),
      },
    ];
  });

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase(locale);
  const filteredCourses = normalizedQuery
    ? mappedCourses.filter((course) =>
        course.title?.toLocaleLowerCase(locale).includes(normalizedQuery),
      )
    : mappedCourses;

  const handleDeleteCourse = async (courseId) => {
    const course = mappedCourses.find(
      (candidate) => String(candidate.id) === String(courseId),
    );
    const title = course?.title || t("untitled-course");

    if (
      !window.confirm(
        t("remove-course-from-department-confirmation", { title }),
      )
    ) {
      return;
    }

    await deleteCourse(courseId);
  };

  return (
    <div className={styles["content-area"]} dir={i18n.dir()}>
      <PageHeaderSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {deleteError && (
        <div className={styles.deleteError} role="alert">
          {t("department-course-delete-failed")}
        </div>
      )}

      {isLoading ? (
        <div className={styles.statePanel} role="status" aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          {t("loading-courses")}
        </div>
      ) : error ? (
        <div
          className={`${styles.statePanel} ${styles.errorState}`}
          role="alert"
        >
          <strong>{t("courses-load-failed")}</strong>
          <span>{t("courses-load-error-message")}</span>
          <button type="button" onClick={retry}>
            {t("try-again")}
          </button>
        </div>
      ) : filteredCourses.length > 0 ? (
        <CoursesGridSection
          courses={filteredCourses}
          isOwner={isOwner}
          deletingCourseId={deletingCourseId}
          onDelete={handleDeleteCourse}
        />
      ) : (
        <div className={styles.statePanel}>
          <strong>
            {normalizedQuery
              ? t("no-department-courses-match-search")
              : t("no-courses-available-in-this-department")}
          </strong>
          <span>
            {normalizedQuery
              ? t("adjust-course-search")
              : t("department-courses-empty-description")}
          </span>
          {normalizedQuery && (
            <button type="button" onClick={() => setSearchQuery("")}>
              {t("clear-search")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesContent;
