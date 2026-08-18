import CourseCard from "../../../../../../components/elements/CourseCard/CourseCard";
import styles from "./CoursesGridSection.module.css";

const CoursesGridSection = ({
  courses,
  isOwner,
  deletingDepartmentCourseId,
  onDelete,
}) => {
  return (
    <div className={styles["grid-container"]}>
      {courses.map((course) => (
        <CourseCard
          key={course.departmentCourseId || course.id}
          course={course}
          isOwner={isOwner}
          deleteId={course.departmentCourseId}
          isDeleting={
            String(deletingDepartmentCourseId) ===
            String(course.departmentCourseId)
          }
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CoursesGridSection;
