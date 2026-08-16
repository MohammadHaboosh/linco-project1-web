import { useTranslation } from "react-i18next";
import LiveCard from "../../../../../../components/elements/LiveCard/LiveCard";
import styles from "../SharedSection.module.css";

const LivesSection = ({ lives, isLoading, error, onRetry }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={styles["section-header"]}>
        <h2>{t("new-lives")}</h2>
      </div>

      {isLoading ? (
        <div
          className={styles["section-state"]}
          role="status"
          aria-live="polite"
        >
          <span className={styles.spinner} aria-hidden="true" />
          {t("loading-live-streams")}
        </div>
      ) : error ? (
        <div
          className={`${styles["section-state"]} ${styles["error-state"]}`}
          role="alert"
        >
          <strong>{t("live-streams-load-failed")}</strong>
          <span>{t("live-streams-load-error-message")}</span>
          <button
            type="button"
            onClick={() => onRetry?.()?.catch(() => undefined)}
          >
            {t("try-again")}
          </button>
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
