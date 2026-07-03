import { IoCloseOutline, IoMailOutline } from "react-icons/io5";
import styles from "./InviteModal.module.css";
import { useTranslation } from "react-i18next";

const InviteModal = ({ onClose }) => {
  const { t } = useTranslation();
  const handleInvite = (e) => {
    e.preventDefault();
    ///// TO BACKEND
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>{t("invite-new-member")}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <form onSubmit={handleInvite} className={styles.modalBody}>
          <div className={styles.inputGroup}>
            <label>{t("email-address")}</label>
            <div className={styles.inputWrapper}>
              <IoMailOutline className={styles.inputIcon} />
              <input
                type="email"
                placeholder="user@company.com"
                required
                autoFocus
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>{t("assign-role")}</label>
            <select className={styles.selectInput}>
              <option value="trainee">{t("trainee")}</option>
              <option value="sectionManager">{t("section-manager")}</option>
            </select>
            <span className={styles.helperText}>
              {t("section-managers-can-manage-courses-and-tasks")}
            </span>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              {t("cancel")}
            </button>
            <button type="submit" className={styles.submitBtn}>
              {t("send-invitation")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
