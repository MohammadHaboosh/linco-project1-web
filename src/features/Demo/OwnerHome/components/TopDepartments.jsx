import { useTranslation } from "react-i18next";
import { IoTrophyOutline, IoMedalOutline } from "react-icons/io5";
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

  const sortedDepts = [...departments]
    .sort((a, b) => b.examPassRate - a.examPassRate)
    .slice(0, 4);

  const getRankIcon = (index) => {
    if (index === 0) return <IoTrophyOutline className={styles.goldTrophy} />;
    if (index === 1) return <IoMedalOutline className={styles.silverMedal} />;
    if (index === 2) return <IoMedalOutline className={styles.bronzeMedal} />;
    return <span className={styles.standardRank}>#{index + 1}</span>;
  };

  return (
    <div className={styles.departmentsCard}>
      <div className={styles.cardHeader}>
        <h3>{t("top-performing-departments")}</h3>
      </div>
      <div className={styles.departmentsList}>
        {sortedDepts.map((dept, index) => (
          <div key={dept.departmentId} className={styles.deptItem}>
            <div className={styles.rankContainer} aria-hidden="true">
              {getRankIcon(index)}
            </div>

            <div className={styles.deptMainContent}>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDepartments;
