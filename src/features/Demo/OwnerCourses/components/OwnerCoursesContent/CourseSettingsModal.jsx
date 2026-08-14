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

  const [price, setPrice] = useState(course?.price || 0);
  const [visibility, setVisibility] = useState(course?.visibility || "PUBLIC");
  const [prevCourseId, setPrevCourseId] = useState(course?.id);

  if (course && course.id !== prevCourseId) {
    setPrevCourseId(course.id);
    setPrice(course.price || 0);
    setVisibility(course.visibility || "PUBLIC");
  }

  if (!isOpen || !course) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(course.id, { price: Number(price), visibility });
  };

  return (
    <div className={styles.modalOverlay} onClick={() => !isSaving && onClose()}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
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
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <h3 className={styles.modalTitle}>
            {t("course-settings", "Course Settings")}
          </h3>
          <p className={styles.modalDesc}>
            {t(
              "update-price-visibility",
              "Update the price and visibility for",
            )}{" "}
            <strong className={styles.highlightText}>{course.title}</strong>
          </p>

          <form onSubmit={handleSubmit} className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <div className={styles.labelIconWrapper}>
                  <IoGlobeOutline />
                </div>
                {t("visibility", "Visibility")}
              </label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.formInput}
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  disabled={isSaving}
                >
                  <option value="PUBLIC">
                    {t("public", "Public (Demo & Global Library)")}
                  </option>
                  <option value="PRIVATE">
                    {t("private", "Private (Demo Library Only)")}
                  </option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <div className={styles.labelIconWrapper}>
                  <IoCashOutline />
                </div>
                {t("price", "Course Price")}
              </label>
              <div className={styles.priceInputWrapper}>
                <span className={styles.currencySymbol}>$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${styles.formInput} ${styles.priceInput}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSaving}
                  placeholder="0.00"
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
              >
                {isSaving ? (
                  <span className={styles.loadingSpinner}></span>
                ) : (
                  t("save-changes")
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseSettingsModal;
