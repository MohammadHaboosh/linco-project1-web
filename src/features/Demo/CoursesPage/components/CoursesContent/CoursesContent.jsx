import { useState } from "react";
import PageHeaderSection from "../sections/PageHeaderSection/PageHeaderSection";
import CoursesGridSection from "../sections/CoursesGridSection/CoursesGridSection";
import CourseBuilder from "../CourseBuilder/CourseBuilder";
import styles from "./CoursesContent.module.css";

const CoursesContent = () => {
  const isOwner = "trainee";
  const [isBuilding, setIsBuilding] = useState(false);

  const mockCourses = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: "Introduction To React Hooks & Redux",
    description:
      "Learn how to build modern web applications using functional components and state management.",
    progress: 72,
    lessonsCount: 24,
    totalViews: 1540,
  }));

  return (
    <div className={styles["content-area"]}>
      {!isBuilding ? (
        <>
          <PageHeaderSection
            departmentName="Back-End Department"
            title="All Courses"
          />
          <CoursesGridSection
            courses={mockCourses}
            isOwner={isOwner}
            onUploadClick={() => setIsBuilding(true)} // عند الضغط نفتح أداة بناء الكورسات
          />
        </>
      ) : (
        <CourseBuilder onBack={() => setIsBuilding(false)} />
      )}
    </div>
  );
};

export default CoursesContent;
