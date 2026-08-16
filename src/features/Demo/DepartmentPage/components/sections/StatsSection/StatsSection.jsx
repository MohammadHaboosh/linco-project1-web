import { useTranslation } from "react-i18next";
import styles from "./StatsSection.module.css";

const StatsSection = ({ stats }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || i18n.language || "en";
  const formatNumber = (value) => new Intl.NumberFormat(locale).format(value);

  return (
    <section
      className={styles["stats-row"]}
      aria-label={t("department-statistics")}
    >
      <article className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>{t("active-courses")}</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>
            {formatNumber(stats.activeCourses.current)}
          </span>
          <div className={styles.divider} aria-hidden="true" />
          <span className={styles.secondary}>
            {t("active-courses-summary", {
              count: stats.activeCourses.total,
              formattedCurrent: formatNumber(stats.activeCourses.current),
              formattedTotal: formatNumber(stats.activeCourses.total),
            })}
          </span>
        </div>
      </article>

      <article className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>{t("tasks-completed")}</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>
            {formatNumber(stats.tasks.completed)}
          </span>
          <div className={styles.divider} aria-hidden="true" />
          <span className={styles.secondary}>
            {t("completed-tasks-summary", {
              count: stats.tasks.total,
              formattedCompleted: formatNumber(stats.tasks.completed),
              formattedTotal: formatNumber(stats.tasks.total),
            })}
          </span>
        </div>
      </article>

      <article className={styles["stat-box"]}>
        <div className={styles["stat-title"]}>{t("certificates-earned")}</div>
        <div className={styles["stat-values"]}>
          <span className={styles.highlight}>
            {formatNumber(stats.certificates.earned)}
          </span>
          <div className={styles.divider} aria-hidden="true" />
          <span className={styles.secondary}>
            {t("certificates-remaining-summary", {
              count: stats.certificates.left,
              formattedEarned: formatNumber(stats.certificates.earned),
              formattedRemaining: formatNumber(stats.certificates.left),
            })}
          </span>
        </div>
      </article>
    </section>
  );
};

export default StatsSection;
