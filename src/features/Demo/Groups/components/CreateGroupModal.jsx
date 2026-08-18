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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className={styles.header}>
          <div className={styles.modalTitle}>
            <div className={styles.modalTitleIcon}>
              <IoPeopleOutline />
            </div>
            <div>
              <h2>{t("create-new-group", "Create New Group")}</h2>
              <p>
                {t(
                  "create-group-desc",
                  "Setup a dedicated workspace for your team.",
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
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
            <label>{t("group-name", "Group Name")}</label>
            <input
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
            <label>{t("group-desc", "Description")}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.textarea}
              placeholder={"e.g. For build LinCo Project"}
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
