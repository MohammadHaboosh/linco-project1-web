import { useTranslation } from "react-i18next";
import styles from "../OwnerHomeContent.module.css";

const ReportCoursesTable = ({ courses, numberFormatter, percentFormatter }) => {
  const { t } = useTranslation();
  if (!courses || courses.length === 0) return null;

  const publishedCourses = courses.filter((c) => c.isPublished);

  return (
    <div className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <h3>{t("courses-performance-report")}</h3>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>{t("course-title")}</th>
              <th>{t("assigned-members")}</th>
              <th>{t("attempts")}</th>
              <th>{t("avg-score")}</th>
              <th>{t("certifications")}</th>
            </tr>
          </thead>
          <tbody>
            {publishedCourses.map((course) => (
              <tr key={course.courseId}>
                <td className={styles.mainCell}>{course.courseTitle}</td>
                <td>{numberFormatter.format(course.assignedMemberCount)}</td>
                <td>{numberFormatter.format(course.totalAttempts)}</td>
                <td>
                  <span
                    className={
                      course.averageScore >= 60
                        ? styles.textSuccess
                        : styles.textWarning
                    }
                  >
                    {course.averageScore}%
                  </span>
                </td>
                <td>
                  <span className={styles.metricBadgeGold}>
                    {numberFormatter.format(course.certificationsIssued)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportCoursesTable;
