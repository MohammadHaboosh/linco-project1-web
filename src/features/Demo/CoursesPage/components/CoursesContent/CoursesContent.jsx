import PageHeaderSection from "../sections/PageHeaderSection/PageHeaderSection";
import CoursesGridSection from "../sections/CoursesGridSection/CoursesGridSection";
import styles from "./CoursesContent.module.css";

const CoursesContent = () => {
  const mockCourses = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: "Introduction To React Hooks",
    description:
      "Description text will be here with some details about the course.",
    progress: 72,
  }));

  return (
    <div className={styles["content-area"]}>
      <PageHeaderSection
        departmentName="Back-End Department"
        title="All Courses"
      />

      <CoursesGridSection courses={mockCourses} />
    </div>
  );
};

export default CoursesContent;
