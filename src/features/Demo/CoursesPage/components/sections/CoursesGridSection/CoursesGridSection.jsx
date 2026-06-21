import CourseCard from "../../../../../../components/elements/CourseCard/CourseCard";
import styles from "./CoursesGridSection.module.css";

const CoursesGridSection = ({ courses }) => {
  return (
    <div className={styles["grid-container"]}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CoursesGridSection;
