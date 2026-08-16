import { IoChevronBack, IoCheckmarkOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const StudioTopBar = ({ currentStep, onBack, styles }) => {
  const { t, i18n } = useTranslation();
  const numberFormatter = new Intl.NumberFormat(
    i18n.resolvedLanguage || i18n.language,
  );

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <button className={styles.backBtn} type="button" onClick={onBack}>
          <IoChevronBack aria-hidden="true" /> <span>{t("back")}</span>
        </button>
      </div>

      <ol
        className={styles.stepperContainer}
        aria-label={t("course-studio-progress-label")}
      >
        <li
          className={`${styles.stepIndicator} ${currentStep >= 1 ? styles.stepActive : ""}`}
          aria-current={currentStep === 1 ? "step" : undefined}
        >
          <div className={styles.stepCircle}>
            {currentStep > 1 ? (
              <IoCheckmarkOutline aria-label={t("completed")} />
            ) : (
              numberFormatter.format(1)
            )}
          </div>
          <span>{t("course-setup")}</span>
        </li>
        <li
          aria-hidden="true"
          className={`${styles.stepLine} ${currentStep === 2 ? styles.lineActive : ""}`}
        />
        <li
          className={`${styles.stepIndicator} ${currentStep === 2 ? styles.stepActive : ""}`}
          aria-current={currentStep === 2 ? "step" : undefined}
        >
          <div className={styles.stepCircle}>{numberFormatter.format(2)}</div>
          <span>{t("curriculum-builder")}</span>
        </li>
      </ol>

      <div className={styles.topBarRight}></div>
    </header>
  );
};

export default StudioTopBar;
