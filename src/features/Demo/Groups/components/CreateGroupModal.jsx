import { useState } from "react";
import { IoCloseOutline, IoPeopleOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./Groups.module.css";

const CreateGroupModal = ({ onClose, createGroup, isCreating }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    managerId: "01a00b46-6049-74bf-9ef8-cf34fc8802f4",
  });
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      await createGroup({
        name: formData.name,
        description: formData.description,
        isGroup: true,
        managerId: formData.managerId,
      });
      onClose();
    } catch (error) {
      setLocalError(
        error.message || t("failed-to-create-group", "Failed to create group."),
      );
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div className={styles.modalTitleIcon}>
              <IoPeopleOutline />
            </div>
            <div>
              <h2>{t("create-new-group", "Create New Group")}</h2>
              <p>
                {t(
                  "create-group-desc",
                  "Setup a dedicated space for specific topics.",
                )}
              </p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isCreating}
          >
            <IoCloseOutline />
          </button>
        </div>

        <form className={styles.modalBody} onSubmit={handleSubmit}>
          {localError && (
            <div
              style={{
                color: "var(--app-danger-text)",
                fontSize: "0.85rem",
                padding: "8px",
                background: "var(--app-danger-surface)",
                borderRadius: "8px",
              }}
            >
              {localError}
            </div>
          )}

          <div className={styles.formGroup}>
            <label>{t("group-name", "Group Name")}</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. backend7"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isCreating}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("description", "Description")}</label>
            <textarea
              required
              rows="3"
              className={styles.textarea}
              placeholder="What is this group about?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isCreating}
            />
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isCreating}
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isCreating}
            >
              {isCreating
                ? t("creating", "Creating...")
                : t("create-group", "Create Group")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
