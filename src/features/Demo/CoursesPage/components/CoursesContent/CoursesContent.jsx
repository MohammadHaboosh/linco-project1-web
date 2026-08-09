import { useState } from "react";
import PageHeaderSection from "../sections/PageHeaderSection/PageHeaderSection";
import CoursesGridSection from "../sections/CoursesGridSection/CoursesGridSection";
import CourseBuilder from "../CourseBuilder/CourseBuilder";
import styles from "./CoursesContent.module.css";
import { useDemo } from "../../../../../hooks/useDemo";

const CoursesContent = () => {
  const { role, isLoading } = useDemo();
  const isOwner = role === "owner";

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
      <>
        <PageHeaderSection
          departmentName="Back-End Department"
          title="All Courses"
        />
        <CoursesGridSection courses={mockCourses} isOwner={isOwner} />
      </>
    </div>
  );
};

export default CoursesContent;
