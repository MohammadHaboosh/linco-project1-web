import { useTranslation } from "react-i18next";
import styles from "./WelcomeSection.module.css";

const WelcomeSection = ({ companyName, userName }) => {
  const { t } = useTranslation();

  return (
    <div className={styles["welcome-text"]}>
      <div className={styles["welcome-badge"]}>
        <span>👋</span> {t("welcome-back")}
      </div>

      <h1>
        {t("welcome-to")}{" "}
        <span className={styles["highlight-company"]}>{companyName}</span>
        <br />
        {t("academy")},{" "}
        <span className={styles["highlight-name"]}>{userName}</span>!
      </h1>

      <p>
        {t(
          "start-your-journey-to-top-the-company-leaderboard-and-achieve-your-daily-goals",
        )}
      </p>

      <div className={styles["welcome-actions"]}>
        <button className={styles["btn-primary"]}>
          {t("resume-learning")}
        </button>
        <button className={styles["btn-secondary"]}>
          {t("view-road-map")}
        </button>
      </div>
    </div>
  );
};

export default WelcomeSection;
