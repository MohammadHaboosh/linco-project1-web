import { IoAlertCircleOutline, IoCloseOutline } from "react-icons/io5";
import styles from "./OwnerCoursesContent.module.css";
import { useTranslation } from "react-i18next";

const ErrorModal = ({ message, onClose }) => {
  const { t } = useTranslation();
  if (!message) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div
            className={`${styles.modalIconContainer} ${styles.errorIconBox}`}
          >
            <IoAlertCircleOutline size={28} className={styles.errorIcon} />
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline size={20} />
          </button>
        </div>

        <h3 className={styles.modalTitle}>{t("oops-something-went-wrong")}</h3>
        <p className={styles.modalDesc}>{message}</p>

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
