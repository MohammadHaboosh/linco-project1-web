import { IoAlertCircleOutline, IoCloseOutline } from "react-icons/io5";
import styles from "./OwnerCoursesContent.module.css";
import { useTranslation } from "react-i18next";

const ErrorModal = ({ message, onClose }) => {
  const { t } = useTranslation();
  if (!message) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="course-error-title"
        aria-describedby="course-error-description"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div
            className={`${styles.modalIconContainer} ${styles.errorIconBox}`}
          >
            <IoAlertCircleOutline size={28} className={styles.errorIcon} />
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t("close-error-dialog")}
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        <h3 id="course-error-title" className={styles.modalTitle}>
          {t("oops-something-went-wrong")}
        </h3>
        <p id="course-error-description" className={styles.modalDesc}>
          {message}
        </p>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.confirmPublishBtn}
            onClick={onClose}
          >
            {t("ok")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
