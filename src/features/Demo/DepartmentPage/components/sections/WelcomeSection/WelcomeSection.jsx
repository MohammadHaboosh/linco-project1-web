import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PATHS } from "../../../../../../routes/paths";
import styles from "./WelcomeSection.module.css";

const WelcomeSection = ({ departmentName, userName }) => {
  const { t } = useTranslation();

  return (
    <div className={styles["welcome-text"]}>
      <div className={styles["welcome-badge"]}>
        <span aria-hidden="true">👋</span> {t("welcome-back")}
      </div>

      <h1>
        <Trans
          i18nKey="department-welcome-heading"
          values={{ departmentName, userName }}
          components={{
            department: <span className={styles["highlight-company"]} />,
            user: <span className={styles["highlight-name"]} />,
          }}
        />
      </h1>

      <p>
        {t(
          "start-your-journey-to-top-the-company-leaderboard-and-achieve-your-daily-goals",
        )}
      </p>

      <div className={styles["welcome-actions"]}>
        <Link className={styles["btn-primary"]} to={PATHS.COURSES}>
          {t("resume-learning")}
        </Link>
        <Link className={styles["btn-secondary"]} to={PATHS.ROADMAPS}>
          {t("view-road-map")}
        </Link>
      </div>
    </div>
  );
};

export default WelcomeSection;
