import { useParams } from "react-router-dom";
import PageHeaderSection from "../sections/PageHeaderSection/PageHeaderSection";
import CoursesGridSection from "../sections/CoursesGridSection/CoursesGridSection";
import styles from "./CoursesContent.module.css";
import { useDemo } from "../../../../../hooks/useDemo";
import { useDepartmentCourses } from "../../hooks/useDepartmentCourses"; // استيراد الـ Hook
import { useTranslation } from "react-i18next";

const CoursesContent = () => {
  const { t } = useTranslation();
  const { demoId, departmentId } = useParams();
  const { role } = useDemo();
  const isOwner = role === "owner";

  const {
    courses: apiCourses,
    isLoading,
    error,
  } = useDepartmentCourses(demoId, departmentId);

  const mappedCourses = apiCourses.map((item) => {
    const courseData = item.asset.course;
    return {
      id: courseData.id,
      title: courseData.title,
      description: courseData.description,
      image: courseData.imagePath,
      lessonsCount: courseData.lessonCount,
      duration: `${courseData.totalDuration}h 0m`,
      progress: 0,
      views: 0,
      studentsCount: 0,
      status: courseData.isPublished ? "published" : "draft",
      lastUpdated: new Date(courseData.updatedAt).toLocaleDateString(),
    };
  });

  return (
    <div className={styles["content-area"]}>
      <PageHeaderSection
        departmentName="Department Courses"
        title="All Courses"
      />

      {isLoading ? (
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            padding: "40px",
            fontSize: "1.2rem",
          }}
        >
          {t("loading-courses")}
        </p>
      ) : error ? (
        <p
          style={{
            textAlign: "center",
            color: "#dc2626",
            padding: "40px",
            fontSize: "1.2rem",
          }}
        >
          {error}
        </p>
      ) : mappedCourses.length > 0 ? (
        <CoursesGridSection courses={mappedCourses} isOwner={isOwner} />
      ) : (
        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            padding: "40px",
            fontSize: "1.2rem",
          }}
        >
          {t("no-courses-available-in-this-department")}.
        </p>
      )}
    </div>
  );
};

export default CoursesContent;
