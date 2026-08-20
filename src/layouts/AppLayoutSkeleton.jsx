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
      <div className={styles.ambientBackground} aria-hidden="true">
        <div className={`${styles.glowOrb} ${styles.orbPrimary}`} />
        <div className={`${styles.glowOrb} ${styles.orbSecondary}`} />
        <div className={`${styles.glowOrb} ${styles.orbAccent}`} />
      </div>

      <div className={styles.glassOverlay}>
        <div className={styles.centerStage}>
          <div className={styles.logoShell}>
            <span className={styles.ripple} aria-hidden="true" />
            <span
              className={`${styles.ripple} ${styles.rippleDelayed}`}
              aria-hidden="true"
            />
            <img
              src="/icons/linco-logo-96.webp"
              alt={t("app-loader-logo-alt", { defaultValue: "LinCo" })}
              className={styles.logoImage}
            />
          </div>

          <p className={styles.brandName}>
            {t("app-loader-brand", { defaultValue: "LINCO" })}
          </p>

          <div className={styles.progressTrack} aria-hidden="true">
            <span className={styles.progressSweep} />
          </div>

          <p className={styles.statusText}>
            {t("app-loader-status", {
              defaultValue: "Preparing your workspace...",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppLayoutSkeleton;
