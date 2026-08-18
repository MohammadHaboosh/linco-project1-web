import { useTranslation } from "react-i18next";
import {
  IoBookOutline,
  IoRibbonOutline,
  IoBarChartOutline,
  IoLibraryOutline,
} from "react-icons/io5";
import styles from "../OwnerHomeContent.module.css";
import { ReportCoursesTableSkeleton } from "./OwnerHomeSkeletons";

const ReportCoursesTable = ({
  courses,
  numberFormatter,
  percentFormatter,
  isLoading,
}) => {
  const { t } = useTranslation();

  if (isLoading) return <ReportCoursesTableSkeleton />;

  const safeCourses = Array.isArray(courses) ? courses : [];
  const publishedCourses = safeCourses.filter((course) => course.isPublished);

  return (
    <div className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.headerIcon}>
            <IoBarChartOutline aria-hidden="true" />
          </div>
          <h3>{t("analytics-courses-performance-report")}</h3>
        </div>
      </div>

      {publishedCourses.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <IoLibraryOutline aria-hidden="true" />
          <h4>{t("analytics-no-published-courses-title")}</h4>
          <p>{t("analytics-no-published-courses-description")}</p>
        </div>
      ) : (
        <div
          className={styles.tableWrapper}
          role="region"
          aria-label={t("analytics-courses-table-region")}
          tabIndex={0}
        >
          <table className={styles.dataTable}>
            <caption className={styles.srOnly}>
              {t("analytics-courses-table-caption")}
            </caption>
            <thead>
              <tr>
                <th>{t("analytics-course-title-column")}</th>
                <th className={styles.centerCell}>
                  {t("analytics-assigned-members-column")}
                </th>
                <th className={styles.centerCell}>
                  {t("analytics-attempts-column")}
                </th>
                <th className={styles.centerCell}>
                  {t("analytics-average-score-column")}
                </th>
                <th className={styles.centerCell}>
                  {t("analytics-certifications-column")}
                </th>
              </tr>
            </thead>
            <tbody>
              {publishedCourses.map((course, index) => {
                const assignedMemberCount =
                  Number(course.assignedMemberCount) || 0;
                const totalAttempts = Number(course.totalAttempts) || 0;
                const averageScore = Math.min(
                  100,
                  Math.max(0, Number(course.averageScore) || 0),
                );
                const certificationsIssued =
                  Number(course.certificationsIssued) || 0;

                return (
                  <tr key={course.courseId || `course-${index}`}>
                    <td
                      className={styles.courseTitleCell}
                      data-label={t("analytics-course-title-column")}
                    >
                      <div className={styles.courseCell}>
                        <div className={styles.courseIcon} aria-hidden="true">
                          <IoBookOutline />
                        </div>
                        <span className={styles.courseNameText}>
                          {course.courseTitle || t("untitled-course")}
                        </span>
                      </div>
                    </td>

                    <td
                      className={styles.centerCell}
                      data-label={t("analytics-assigned-members-column")}
                    >
                      <span className={styles.numericValue}>
                        {numberFormatter.format(assignedMemberCount)}
                      </span>
                    </td>

                    <td
                      className={styles.centerCell}
                      data-label={t("analytics-attempts-column")}
                    >
                      <span className={styles.numericValue}>
                        {numberFormatter.format(totalAttempts)}
                      </span>
                    </td>

                    <td
                      className={styles.centerCell}
                      data-label={t("analytics-average-score-column")}
                    >
                      <span
                        className={`${styles.scoreBadge} ${
                          averageScore >= 60
                            ? styles.scoreSuccess
                            : styles.scoreWarning
                        }`}
                      >
                        {percentFormatter.format(averageScore / 100)}
                      </span>
                    </td>

                    <td
                      className={styles.centerCell}
                      data-label={t("analytics-certifications-column")}
                    >
                      {certificationsIssued > 0 ? (
                        <span className={styles.metricBadgeGold}>
                          <IoRibbonOutline aria-hidden="true" />
                          {numberFormatter.format(certificationsIssued)}
                        </span>
                      ) : (
                        <span className={styles.emptyMetric}>
                          {t("analytics-none")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportCoursesTable;
