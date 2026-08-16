import {
  IoCloudUploadOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";
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

  const isPublic = course.visibility === "PUBLIC";

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => !isPublishing && onClose()}
    >
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-course-title"
        aria-describedby="publish-course-description"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalIconContainer}>
            <IoCloudUploadOutline size={28} className={styles.publishIcon} />
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isPublishing}
            aria-label={t("close-publish-dialog")}
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        <h3 id="publish-course-title" className={styles.modalTitle}>
          {t("publish-course-to-public-library-0")}
        </h3>

        <p
          id="publish-course-description"
          className={styles.modalDesc}
          style={{ marginBottom: "12px" }}
        >
          {t("publish-course-confirmation", { courseTitle: course.title })}
        </p>

        <div className={styles.infoBanner}>
          <IoInformationCircleOutline size={22} className={styles.infoIcon} />
          <p>
            {isPublic
              ? t("publish-public-desc")
              : t("publish-private-desc")}
          </p>
        </div>

        <div className={styles.warningBanner}>
          <IoWarningOutline size={22} className={styles.warningIcon} />
          <p>
            {t("publish-warning")}
          </p>
        </div>

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
            aria-busy={isPublishing}
          >
            {isPublishing ? t("publishing-course") : t("yes-publish")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmationModal;
