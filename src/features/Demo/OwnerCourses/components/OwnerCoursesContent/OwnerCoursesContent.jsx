import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoFolderOpenOutline } from "react-icons/io5";
import CourseManagementCard from "../CourseManagementCard/CourseManagementCard";
import styles from "./OwnerCoursesContent.module.css";
import { useTranslation } from "react-i18next";

const MOCK_MY_COURSES = [
  {
    id: 1,
    title: "Advanced React Patterns",
    description:
      "Master complex UI building, SSR, and scalable Front-End architecture.",
    image: "/images/linco-logo.jpg",
    tags: ["React", "Front-End"],
    isPublished: false,
    stats: { sections: 4, lessons: 12, quizzes: 1 },
  },
  {
    id: 2,
    title: "LinCo HR Onboarding 2026",
    description:
      "Internal onboarding procedures, company culture, and basic setups.",
    image: "/images/linco-logo.jpg",
    tags: ["HR", "Internal"],
    isPublished: true,
    stats: { sections: 2, lessons: 6, quizzes: 1 },
  },
  {
    id: 3,
    title: "Advanced React Patterns",
    description:
      "Master complex UI building, SSR, and scalable Front-End architecture.",
    image: "/images/linco-logo.jpg",
    tags: ["React", "Front-End"],
    isPublished: false,
    stats: { sections: 4, lessons: 12, quizzes: 1 },
  },
  {
    id: 4,
    title: "LinCo HR Onboarding 2026",
    description:
      "Internal onboarding procedures, company culture, and basic setups.",
    image: "/images/linco-logo.jpg",
    tags: ["HR", "Internal"],
    isPublished: true,
    stats: { sections: 2, lessons: 6, quizzes: 1 },
  },
  {
    id: 5,
    title: "Advanced React Patterns",
    description:
      "Master complex UI building, SSR, and scalable Front-End architecture.",
    image: "/images/linco-logo.jpg",
    tags: ["React", "Front-End"],
    isPublished: false,
    stats: { sections: 4, lessons: 12, quizzes: 1 },
  },
  {
    id: 6,
    title: "LinCo HR Onboarding 2026",
    description:
      "Internal onboarding procedures, company culture, and basic setups.",
    image: "/images/linco-logo.jpg",
    tags: ["HR", "Internal"],
    isPublished: true,
    stats: { sections: 2, lessons: 6, quizzes: 1 },
  },
];

const OwnerCoursesContent = () => {
  const { t } = useTranslation("demo");
  const navigate = useNavigate();
  const { demoId } = useParams();
  const [courses, setCourses] = useState(MOCK_MY_COURSES);

  const handleAddNewCourse = () => {
    /// TO DO
    navigate(`/demos/${demoId}/course-studio`);
  };

  const handleEditCourse = (courseId) => {
    /// TO DO
    navigate(`/demos/${demoId}/course-studio/${courseId}`);
  };

  const handlePublishToLibrary = (courseId) => {
    /// TO DO
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isPublished: true } : c)),
    );
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerArea}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBox}>
              <IoFolderOpenOutline className={styles.headerIcon} />
            </div>
            <div>
              <h1 className={styles.title}>{t("demo-courses")}</h1>
              <p className={styles.description}>
                {t(
                  "manage-your-created-courses-edit-curriculum-and-publish-them-to-the-public-library",
                )}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.coursesGrid}>
          <CourseManagementCard isAddNew={true} onAddNew={handleAddNewCourse} />

          {courses.map((course) => (
            <CourseManagementCard
              key={course.id}
              isAddNew={false}
              course={course}
              onEdit={handleEditCourse}
              onPublish={handlePublishToLibrary}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerCoursesContent;
