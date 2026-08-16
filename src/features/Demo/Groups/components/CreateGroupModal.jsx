import { useState } from "react";
import {
  IoCloseOutline,
  IoPeopleOutline,
  IoGlobeOutline,
  IoLockClosedOutline,
} from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "./Groups.module.css";

const CreateGroupModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    privacy: "PUBLIC",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
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
            disabled={isSubmitting}
          >
            <IoCloseOutline />
          </button>
        </div>

        <form className={styles.modalBody} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{t("group-name", "Group Name")}</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. React Native Experts"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("privacy", "Privacy Setting")}</label>
            <div className={styles.radioGrid}>
              <label
                className={`${styles.radioCard} ${formData.privacy === "PUBLIC" ? styles.activeRadio : ""}`}
              >
                <input
                  type="radio"
                  name="privacy"
                  value="PUBLIC"
                  checked={formData.privacy === "PUBLIC"}
                  onChange={() =>
                    setFormData({ ...formData, privacy: "PUBLIC" })
                  }
                  hidden
                />
                <IoGlobeOutline className={styles.radioIcon} />
                <div className={styles.radioText}>
                  <strong>{t("public", "Public")}</strong>
                  <span>{t("public-desc", "Anyone can join")}</span>
                </div>
              </label>

              <label
                className={`${styles.radioCard} ${formData.privacy === "PRIVATE" ? styles.activeRadio : ""}`}
              >
                <input
                  type="radio"
                  name="privacy"
                  value="PRIVATE"
                  checked={formData.privacy === "PRIVATE"}
                  onChange={() =>
                    setFormData({ ...formData, privacy: "PRIVATE" })
                  }
                  hidden
                />
                <IoLockClosedOutline className={styles.radioIcon} />
                <div className={styles.radioText}>
                  <strong>{t("private", "Private")}</strong>
                  <span>{t("private-desc", "Invitation only")}</span>
                </div>
              </label>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting
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
