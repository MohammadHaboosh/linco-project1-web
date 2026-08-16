import CourseCard from "../../../../../../components/elements/CourseCard/CourseCard";
import styles from "./CoursesGridSection.module.css";

const CoursesGridSection = ({ courses, isOwner }) => {
  return (
    <div className={styles["grid-container"]}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isOwner={isOwner}
          onDelete={(id) => console.log("Delete", id)}
        />
      ))}
    </div>
  );
};

export default CoursesGridSection;
