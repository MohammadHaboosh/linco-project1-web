import styles from "../SharedSection.module.css";
import CourseCard from "../../../../../components/elements/CourseCard/CourseCard";

const CoursesSection = ({ courses }) => {
  return (
    <>
      <div className={styles["section-header"]}>
        <h2>Resume Learning</h2>
        <p>Continue your current course</p>
      </div>

      <div className={styles["cards-grid-2"]}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
};

export default CoursesSection;
