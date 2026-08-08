import { useState } from "react";
import { IoCloseOutline, IoSendOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "../Inquiries.module.css";

const NewInquiryModal = ({ onClose, onSend }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    to: "Owner",
    subject: "",
    question: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!formData.subject.trim() || !formData.question.trim()) {
      setError(t("please-fill-all-fields"));
      return;
    }
    onSend(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h3>{t("submit-new-inquiry")}</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t("close")}
          >
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.inputGroup}>
            <label>{t("recipient")} *</label>
            <select
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
            >
              <option value="Owner">{t("workspace-owner-general-issues")}</option>
              <option value="Front-End Manager">{t("front-end-manager")}</option>
              <option value="UI/UX Manager">{t("ui-ux-manager")}</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>{t("subject")} *</label>
            <input
              type="text"
              placeholder={t("subject-placeholder")}
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>{t("question")} *</label>
            <textarea
              rows="5"
              placeholder={t("question-placeholder")}
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t("cancel")}
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            <IoSendOutline /> {t("send-inquiry")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewInquiryModal;
