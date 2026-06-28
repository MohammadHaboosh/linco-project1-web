import { IoChevronBack, IoFlashOutline, IoPulseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import styles from "./PathHeaderSection.module.css";
import { PATHS } from "../../../../../../routes/paths";
import { useTranslation } from "react-i18next";

const PathHeaderSection = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.headerSection}>
      <Link to={PATHS.DEPARTMENTS} className={styles.backLink}>
        <IoChevronBack style={{ marginRight: "5px" }} /> Back-End Department
      </Link>
      <h1 className={styles.title}>{t("trainee-learning-path")}</h1>

      <div className={styles.topPanels}>
        <div className={styles.welcomePanel}>
          <div className={styles.badge}>
            <span>👋</span> {t("welcome-back")}
          </div>
          <h3>
            {t("ready-to-dive-into-your")}
            <br />
            {t("learning")} <span className={styles.nameHighlight}>Abrar!</span>
          </h3>
          <p>
            {t(
              "manage-your-company-links-track-your-active-training-rooms-and-level-up-your-career-from-one-single-dashboard",
            )}
          </p>
        </div>

        <div className={styles.statsCard}>
          <h3 className={styles.statsTitle}>{t("progress-summary")}</h3>
          <div className={styles.statList}>
            <div className={`${styles.statRow} ${styles.statRowActive}`}>
              <div className={styles.statRowLeft}>
                <div className={styles.statIcon}>
                  {/* <IoTargetOutline /> */}
                </div>
                <span className={styles.statLabel}>
                  {t("course-completion")}
                </span>
              </div>
              <div className={styles.statRowRight}>25%</div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statRowLeft}>
                <div className={styles.statIcon}>
                  <IoFlashOutline />
                </div>
                <span className={styles.statLabel}>XP {t("points")}</span>
              </div>
              <div className={styles.statRowRight}>1,200 XP</div>
            </div>

            <div className={styles.statRow}>
              <div className={styles.statRowLeft}>
                <div className={styles.statIcon}>
                  <IoPulseOutline />
                </div>
                <span className={styles.statLabel}>{t("day-strike")}</span>
              </div>
              <div className={styles.statRowRight}>3 {t("days")}</div>
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />
    </div>
  );
};

export default PathHeaderSection;
