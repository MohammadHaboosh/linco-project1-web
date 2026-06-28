import { useTranslation } from "react-i18next";
import styles from "./StatsSection.module.css";

const StatsSection = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className={styles["stats-row"]}>
      {/* Active Courses */}
      <div className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>{t("active-courses")}</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>
            {stats.activeCourses.current}
          </span>
          <div className={styles.divider}></div>
          <span className={styles.secondary}>
            {t("all")}
            <br />
            {stats.activeCourses.total}
          </span>
        </div>
      </div>

      {/* Tasks Completed */}
      <div className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>{t("tasks-completed")}</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>{stats.tasks.completed}</span>
          <div className={styles.divider}></div>
          <span className={styles.secondary}>
            {t("number-of-tasks")}
            <br />
            {t("you-finished")} {stats.tasks.total}
          </span>
        </div>
      </div>

      {/* Certificates Earned */}
      <div className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>{t("certificates-earned")}</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>{stats.certificates.earned}</span>
          <div className={styles.divider}></div>
          <span className={styles.secondary}>
            {t("you-have-only")}
            <br />
            {t("left")} {stats.certificates.left}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
