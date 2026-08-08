import { useState } from "react";
import { IoCloseOutline, IoSendOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "../Inquiries.module.css";

const NewInquiryModal = ({ onClose, onSend, isSubmitting }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    subject: "",
    question: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!formData.subject.trim() || !formData.question.trim()) {
      setError(t("please-fill-all-fields"));
      return;
    }

    setError("");
    try {
      await onSend({
        subject: formData.subject.trim(),
        question: formData.question.trim(),
      });
    } catch (requestError) {
      setError(requestError.message || t("failed-to-create-inquiry"));
    }
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
            disabled={isSubmitting}
          >
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.inputGroup}>
            <label>{t("subject")} *</label>
            <input
              type="text"
              placeholder={t("subject-placeholder")}
              value={formData.subject}
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <IoSendOutline />
            {isSubmitting ? t("creating-inquiry") : t("send-inquiry")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewInquiryModal;
