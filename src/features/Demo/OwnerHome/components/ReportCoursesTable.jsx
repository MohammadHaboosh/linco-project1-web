import { useTranslation } from "react-i18next";
import {
  IoBookOutline,
  IoRibbonOutline,
  IoBarChartOutline,
} from "react-icons/io5";
import styles from "../OwnerHomeContent.module.css";
import { ReportCoursesTableSkeleton } from "./OwnerHomeSkeletons";

const ReportCoursesTable = ({ courses, numberFormatter, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) return <ReportCoursesTableSkeleton />;
  if (!courses || courses.length === 0) return null;

  const publishedCourses = courses.filter((c) => c.isPublished);

  if (publishedCourses.length === 0) return null;

  return (
    <div className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerIcon}>
            <IoBarChartOutline aria-hidden="true" />
          </div>
          <h3>{t("courses-performance-report")}</h3>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>{t("course-title")}</th>
              <th className={styles.centerCell}>{t("assigned-members")}</th>
              <th className={styles.centerCell}>{t("attempts")}</th>
              <th className={styles.centerCell}>{t("avg-score")}</th>
              <th className={styles.centerCell}>{t("certifications")}</th>
            </tr>
          </thead>
          <tbody>
            {publishedCourses.map((course) => (
              <tr key={course.courseId}>
                <td>
                  <div className={styles.courseCell}>
                    <div className={styles.courseIcon} aria-hidden="true">
                      <IoBookOutline />
                    </div>
                    <span className={styles.courseNameText}>
                      {course.courseTitle}
                    </span>
                  </div>
                </td>

                <td className={styles.centerCell}>
                  <span className={styles.numericValue}>
                    {numberFormatter.format(course.assignedMemberCount)}
                  </span>
                </td>

                <td className={styles.centerCell}>
                  <span className={styles.numericValue}>
                    {numberFormatter.format(course.totalAttempts)}
                  </span>
                </td>

                <td className={styles.centerCell}>
                  <span
                    className={`${styles.scoreBadge} ${
                      course.averageScore >= 60
                        ? styles.scoreSuccess
                        : styles.scoreWarning
                    }`}
                  >
                    {course.averageScore}%
                  </span>
                </td>

                <td className={styles.centerCell}>
                  {course.certificationsIssued > 0 ? (
                    <span className={styles.metricBadgeGold}>
                      <IoRibbonOutline />{" "}
                      {numberFormatter.format(course.certificationsIssued)}
                    </span>
                  ) : (
                    <span className={styles.emptyMetric}>-</span>
                  )}
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
