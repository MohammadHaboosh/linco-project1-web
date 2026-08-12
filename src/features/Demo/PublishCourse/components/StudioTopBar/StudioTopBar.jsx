import React from "react";
import { IoChevronBack, IoCheckmarkOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const StudioTopBar = ({ currentStep, onBack, styles }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <button className={styles.backBtn} onClick={onBack}>
          <IoChevronBack /> {t("back")}
        </button>
      </div>

      <div className={styles.stepperContainer}>
        <div
          className={`${styles.stepIndicator} ${currentStep >= 1 ? styles.stepActive : ""}`}
        >
          <div className={styles.stepCircle}>
            {currentStep > 1 ? <IoCheckmarkOutline /> : "1"}
          </div>
          <span>{t("course-setup")}</span>
        </div>
        <div
          className={`${styles.stepLine} ${currentStep === 2 ? styles.lineActive : ""}`}
        ></div>
        <div
          className={`${styles.stepIndicator} ${currentStep === 2 ? styles.stepActive : ""}`}
        >
          <div className={styles.stepCircle}>2</div>
          <span>{t("curriculum-builder")}</span>
        </div>
      </div>

      <div className={styles.topBarRight}></div>
    </div>
  );
};

export default StudioTopBar;
