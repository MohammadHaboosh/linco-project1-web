import styles from "../SharedSection.module.css";
import CourseCard from "../../../../../../components/elements/CourseCard/CourseCard";
import { useTranslation } from "react-i18next";

const CoursesSection = ({ courses }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles["section-header"]}>
        <h2>{t("resume-learning")}</h2>
        <p>{t("continue-your-current-course")}</p>
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
