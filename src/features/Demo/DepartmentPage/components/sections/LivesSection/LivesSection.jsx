import { useTranslation } from "react-i18next";
import LiveCard from "../../../../../../components/elements/LiveCard/LiveCard";
import styles from "../SharedSection.module.css";

const LivesSection = ({ lives, isLoading, error }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles["section-header"]}>
        <h2>{t("new-lives")}</h2>
      </div>

      {isLoading ? (
        <div className={styles["section-state"]}>{t("loading-live-streams")}</div>
      ) : error ? (
        <div className={`${styles["section-state"]} ${styles["error-state"]}`}>
          {error}
        </div>
      ) : lives.length > 0 ? (
        <div className={styles["cards-grid-2"]}>
          {lives.map((live) => (
            <LiveCard key={live.id} live={live} />
          ))}
        </div>
      ) : (
        <div className={styles["section-state"]}>
          {t("no-upcoming-live-streams")}
        </div>
      )}
    </>
  );
};

export default LivesSection;
