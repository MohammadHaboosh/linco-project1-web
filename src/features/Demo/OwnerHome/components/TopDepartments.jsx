import { useTranslation } from "react-i18next";
import styles from "../OwnerHomeContent.module.css";

const TopDepartments = ({ departments, numberFormatter, percentFormatter }) => {
  const { t } = useTranslation();
  if (!departments || departments.length === 0) return null;

  const sortedDepts = [...departments]
    .sort((a, b) => b.examPassRate - a.examPassRate)
    .slice(0, 4);

  return (
    <div className={styles.departmentsCard}>
      <div className={styles.cardHeader}>
        <h3>{t("top-performing-departments")}</h3>
      </div>
      <div className={styles.departmentsList}>
        {sortedDepts.map((dept) => (
          <div key={dept.departmentId} className={styles.deptItem}>
            <div className={styles.deptInfo}>
              <h4>{dept.departmentName}</h4>
              <span>
                {t("department-member-count", {
                  count: dept.memberCount,
                  formattedCount: numberFormatter.format(dept.memberCount),
                })}
              </span>
            </div>
            <div className={styles.deptProgress}>
              <div className={styles.progressHeader}>
                <span>{t("exam-pass-rate")}</span>
                <span className={styles.scoreText}>
                  {percentFormatter.format(dept.examPassRate / 100)}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${dept.examPassRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDepartments;
