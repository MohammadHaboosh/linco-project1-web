import styles from "./AppLayoutSkeleton.module.css";
import { useTranslation } from "react-i18next";

const AppLayoutSkeleton = () => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.splashScreen}
      role="status"
      aria-live="polite"
      aria-label={t("app-loader-aria", {
        defaultValue: "Preparing your workspace",
      })}
    >
      <div className={styles.meshLayer} aria-hidden="true" />
      <div className={styles.meshLayerSecondary} aria-hidden="true" />

      <div className={styles.centerStage}>
        <div className={styles.ringFrame} aria-hidden="true">
          <svg
            className={styles.ringSvg}
            viewBox="0 0 220 220"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="linco-ring-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--color-linco-blue)" />
                <stop offset="55%" stopColor="var(--color-linco-light)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <circle
              className={styles.ringTrack}
              cx="110"
              cy="110"
              r="90"
              fill="none"
            />
            <circle
              className={styles.ringStroke}
              cx="110"
              cy="110"
              r="90"
              fill="none"
            />
          </svg>
        </div>

        <div className={styles.logoOrb}>
          <img
            src="/icons/linco-logo-96.webp"
            alt="LinCo"
            className={styles.logoImage}
          />
        </div>

        <div className={styles.brandBlock}>
          <p className={styles.brandName}>
            {t("app-loader-brand", { defaultValue: "LinCo" })}
          </p>
          <p className={styles.statusText}>
            {t("app-loader-status", {
              defaultValue: "Preparing your workspace",
            })}
            <span className={styles.dot1}>.</span>
            <span className={styles.dot2}>.</span>
            <span className={styles.dot3}>.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppLayoutSkeleton;
