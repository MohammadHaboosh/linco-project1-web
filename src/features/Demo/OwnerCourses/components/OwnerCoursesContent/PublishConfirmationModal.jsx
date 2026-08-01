import { IoCloudUploadOutline, IoCloseOutline } from "react-icons/io5";
import styles from "./OwnerCoursesContent.module.css";
import { useTranslation } from "react-i18next";

const PublishConfirmationModal = ({
  course,
  isPublishing,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation();
  if (!course) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => !isPublishing && onClose()}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalIconContainer}>
            <IoCloudUploadOutline size={28} className={styles.publishIcon} />
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isPublishing}
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        <h3 className={styles.modalTitle}>
          {t("publish-course-to-public-library-0")}
        </h3>
        <p className={styles.modalDesc}>
          {t("are-you-sure-you-want-to-publish")}{" "}
          <strong>{course.title}</strong>?{" "}
          {t("once-published-it-will-be-available")}
          {t("for-everyone-in-the-public-library")}
        </p>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isPublishing}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className={styles.confirmPublishBtn}
            onClick={onConfirm}
            disabled={isPublishing}
          >
            {isPublishing ? t("publishing") : t("yes-publish")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmationModal;
