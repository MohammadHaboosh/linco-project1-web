import CourseCard from "../../../../../../components/elements/CourseCard/CourseCard";
import styles from "./CoursesGridSection.module.css";

const CoursesGridSection = ({
  courses,
  isOwner,
  deletingCourseId,
  onDelete,
}) => {
  return (
    <div className={styles["grid-container"]}>
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isOwner={isOwner}
          isDeleting={String(deletingCourseId) === String(course.id)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CoursesGridSection;
