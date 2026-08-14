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
          {t("publish-course-to-public-library-0", "Publish Course")}
        </h3>

        <p className={styles.modalDesc} style={{ marginBottom: "12px" }}>
          {t("are-you-sure-you-want-to-publish")}{" "}
          <strong>{course.title}</strong>?
        </p>

        <div className={styles.infoBanner}>
          <IoInformationCircleOutline size={22} className={styles.infoIcon} />
          <p>
            {isPublic
              ? t(
                  "publish-public-desc",
                  "This course is PUBLIC. It will be published to your Demo Library and the Global Public Library.",
                )
              : t(
                  "publish-private-desc",
                  "This course is PRIVATE. It will be published ONLY to your Demo Library.",
                )}
          </p>
        </div>

        <div className={styles.warningBanner}>
          <IoWarningOutline size={22} className={styles.warningIcon} />
          <p>
            {t(
              "publish-warning",
              "Warning: Once published, you cannot edit the course curriculum or lessons. You can only update the price and visibility.",
            )}
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
          >
            {isPublishing ? t("publishing") : t("yes-publish")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmationModal;
