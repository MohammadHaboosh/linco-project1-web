import { useTranslation } from "react-i18next";
import {
  IoTrophyOutline,
  IoMedalOutline,
  IoBusinessOutline,
} from "react-icons/io5";
import styles from "../OwnerHomeContent.module.css";
import { TopDepartmentsSkeleton } from "./OwnerHomeSkeletons";

const TopDepartments = ({
  departments,
  numberFormatter,
  percentFormatter,
  isLoading,
}) => {
  const { t } = useTranslation();
  if (isLoading) return <TopDepartmentsSkeleton />;

  const safeDepartments = Array.isArray(departments) ? departments : [];
  const sortedDepts = [...safeDepartments]
    .sort((a, b) => Number(b.examPassRate) - Number(a.examPassRate))
    .slice(0, 4);

  const getRankIcon = (index) => {
    if (index === 0) return <IoTrophyOutline className={styles.goldTrophy} />;
    if (index === 1) return <IoMedalOutline className={styles.silverMedal} />;
    if (index === 2) return <IoMedalOutline className={styles.bronzeMedal} />;
    return (
      <span className={styles.standardRank}>
        {numberFormatter.format(index + 1)}
      </span>
    );
  };

  return (
    <div className={styles.departmentsCard}>
      <div className={styles.cardHeader}>
        <h3>{t("analytics-top-performing-departments")}</h3>
      </div>
      {sortedDepts.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <IoBusinessOutline aria-hidden="true" />
          <h4>{t("analytics-no-departments-title")}</h4>
          <p>{t("analytics-no-departments-description")}</p>
        </div>
      ) : (
        <ol className={styles.departmentsList}>
          {sortedDepts.map((dept, index) => {
            const passRate = Math.min(
              100,
              Math.max(0, Number(dept.examPassRate) || 0),
            );
            const memberCount = Number(dept.memberCount) || 0;
            const departmentName =
              dept.departmentName || t("analytics-unnamed-department");

            return (
              <li
                key={dept.departmentId || `${departmentName}-${index}`}
                className={styles.deptItem}
              >
                <div className={styles.rankContainer} aria-hidden="true">
                  {getRankIcon(index)}
                </div>

                <div className={styles.deptMainContent}>
                  <div className={styles.deptInfo}>
                    <h4>{departmentName}</h4>
                    <span>
                      {t("department-member-count", {
                        count: memberCount,
                        formattedCount: numberFormatter.format(memberCount),
                      })}
                    </span>
                  </div>

                  <div className={styles.deptProgress}>
                    <div className={styles.progressHeader}>
                      <span>{t("analytics-exam-pass-rate-label")}</span>
                      <span className={styles.scoreText}>
                        {percentFormatter.format(passRate / 100)}
                      </span>
                    </div>
                    <div
                      className={styles.progressBar}
                      role="progressbar"
                      aria-label={t("department-performance-score", {
                        department: departmentName,
                      })}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={passRate}
                    >
                      <div
                        className={styles.progressFill}
                        style={{ width: `${passRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default TopDepartments;
