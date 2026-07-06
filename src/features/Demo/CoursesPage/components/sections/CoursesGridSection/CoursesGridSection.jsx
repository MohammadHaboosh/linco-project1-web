import { IoAdd } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import CourseCard from "../../../../../../components/elements/CourseCard/CourseCard";
import styles from "./CoursesGridSection.module.css";

const CoursesGridSection = ({ courses, isOwner, onUploadClick }) => {
  const { t } = useTranslation();

  return (
    <div className={styles["grid-container"]}>
      {/* {isOwner && (
        <div className={styles.uploadCard} onClick={onUploadClick}>
          <IoAdd className={styles.addIcon} />
          <h3>{t("upload-course")}</h3>
        </div>
      )} */}
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          isOwner={isOwner}
          onEdit={(c) => console.log("Edit", c)}
          onDelete={(id) => console.log("Delete", id)}
        />
      ))}
    </div>
  );
};

export default CoursesGridSection;
