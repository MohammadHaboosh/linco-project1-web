import { useState } from "react";
import {
  IoSettingsOutline,
  IoCloseOutline,
  IoCashOutline,
  IoGlobeOutline,
} from "react-icons/io5";
import styles from "./OwnerCoursesContent.module.css";
import { useTranslation } from "react-i18next";

const CourseSettingsModal = ({ course, isOpen, onClose, onSave, isSaving }) => {
  const { t } = useTranslation();

  const [price, setPrice] = useState(course?.price ?? 0);
  const [visibility, setVisibility] = useState(course?.visibility || "PUBLIC");

  if (!isOpen || !course) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(course.id, { price: Number(price), visibility });
  };

  return (
    <div className={styles.modalOverlay} onClick={() => !isSaving && onClose()}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-settings-title"
        aria-describedby="course-settings-description"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div
            className={`${styles.modalIconContainer} ${styles.settingsIconBox}`}
          >
            <IoSettingsOutline size={26} className={styles.settingsIcon} />
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSaving}
            aria-label={t("close-course-settings")}
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <h3 id="course-settings-title" className={styles.modalTitle}>
            {t("course-settings")}
          </h3>
          <p id="course-settings-description" className={styles.modalDesc}>
            {t("update-course-price-and-visibility", {
              courseTitle: course.title,
            })}
          </p>

          <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="course-visibility">
                <div className={styles.labelIconWrapper}>
                  <IoGlobeOutline />
                </div>
                {t("visibility")}
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="course-visibility"
                  className={styles.formInput}
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  disabled={isSaving}
                >
                  <option value="PUBLIC">
                    {t("course-visibility-public")}
                  </option>
                  <option value="PRIVATE">
                    {t("course-visibility-private")}
                  </option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="course-price">
                <div className={styles.labelIconWrapper}>
                  <IoCashOutline />
                </div>
                {t("course-price")}
              </label>
              <div className={styles.priceInputWrapper}>
                <span className={styles.currencySymbol}>
                  {t("usd-currency-symbol")}
                </span>
                <input
                  id="course-price"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${styles.formInput} ${styles.priceInput}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSaving}
                  placeholder={t("course-price-placeholder")}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={isSaving}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className={styles.confirmSaveBtn}
                disabled={isSaving}
                aria-busy={isSaving}
              >
                {isSaving && (
                  <span className={styles.loadingSpinner} aria-hidden="true" />
                )}
                {isSaving ? t("saving-changes") : t("save-changes")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseSettingsModal;
