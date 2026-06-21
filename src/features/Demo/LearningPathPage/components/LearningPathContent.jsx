import PathHeaderSection from "./sections/PathHeaderSection/PathHeaderSection";
import PathCourseCard from "./sections/PathCourseCard/PathCourseCard";
import styles from "./LearningPathContent.module.css";

const LearningPathContent = () => {
  const pathData = [
    {
      id: 2,
      title: "Course Name",
      description:
        "Description text will be here with some details about the course content and objectives to help the trainee understand what they will learn.",
      topics: ["React", "TypeScript", "Tailwind"],
      progress: 35,
      status: "active",
      defaultExpanded: true,
    },
    {
      id: 2,
      title: "Course Name",
      description:
        "Description text will be here with some details about the course content and objectives.",
      topics: ["React", "TypeScript", "Tailwind"],
      progress: 0,
      status: "locked",
    },
    {
      id: 1,
      title: "Course Name",
      topics: ["React", "TypeScript", "Tailwind"],
      progress: 0,
      status: "locked",
    },
    {
      id: 1,
      title: "Course Name",
      topics: ["React", "TypeScript", "Tailwind"],
      progress: 0,
      status: "locked",
    },
    {
      id: 1,
      title: "Course Name",
      topics: ["React", "TypeScript", "Tailwind"],
      progress: 100,
      status: "completed",
    },
    {
      id: 1,
      title: "Course Name",
      topics: ["React", "TypeScript", "Tailwind"],
      progress: 100,
      status: "completed",
    },
  ];

  return (
    <div className={styles["content-area"]}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <PathHeaderSection />

        <div className={styles["course-list"]}>
          {pathData.map((course, index) => (
            <PathCourseCard key={index} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPathContent;
