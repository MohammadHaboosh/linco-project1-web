import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoCloseOutline, IoPeopleOutline } from "react-icons/io5";
import { useCreateGroup } from "../hooks/useCreateGroup";
import styles from "./CreateGroupModal.module.css";

const CreateGroupModal = ({ demoId, currentUserId, onClose, onSuccess }) => {
  const { t } = useTranslation();

  const { formData, handleChange, isSubmitting, error, handleSubmit } =
    useCreateGroup(demoId, currentUserId, () => {
      if (onSuccess) onSuccess();
      onClose();
    });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-group-title"
      >
        <div className={styles.header}>
          <div className={styles.modalTitle}>
            <div className={styles.modalTitleIcon}>
              <IoPeopleOutline />
            </div>
            <div>
              <h2 id="create-group-title">
                {t("create-new-group", "Create New Group")}
              </h2>
              <p>
                {t(
                  "create-group-desc",
                  "Set up a dedicated workspace for your team.",
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("close", "Close")}
          >
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.body}>
          {error && (
            <div className={styles.errorAlert} role="alert">
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="create-group-name">
              {t("group-name", "Group Name")}
            </label>
            <input
              id="create-group-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder={t("group-name-placeholder", "e.g. Back-End Team")}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="create-group-description">
              {t("group-desc", "Description")}
            </label>
            <textarea
              id="create-group-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder={t(
                "group-description-placeholder",
                "What is this group about?",
              )}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("cancel", "Cancel")}
          </button>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting
              ? t("creating-group", "Creating...")
              : t("create-group", "Create Group")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
