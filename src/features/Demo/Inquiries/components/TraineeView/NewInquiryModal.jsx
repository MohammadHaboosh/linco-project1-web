import { useState } from "react";
import { IoCloseOutline, IoSendOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import styles from "../Inquiries.module.css";
import { getApiErrorMessage } from "../../../../../utils/getApiErrorMessage";

const NewInquiryModal = ({ onClose, onSend, isSubmitting }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    subject: "",
    question: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event?.preventDefault();
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
      setError(
        getApiErrorMessage(
          requestError,
          t("failed-to-create-inquiry"),
        ),
      );
    }
  };

  return (
    <div className={styles.modalOverlay} role="presentation">
      <form
        className={styles.modalContainer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-inquiry-title"
        aria-busy={isSubmitting}
        onSubmit={handleSubmit}
        noValidate
      >
        <div className={styles.modalHeader}>
          <h3 id="new-inquiry-title">{t("submit-new-inquiry")}</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label={t("close-new-inquiry-dialog")}
            disabled={isSubmitting}
          >
            <IoCloseOutline />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && (
            <div className={styles.errorAlert} role="alert">
              {error}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="inquiry-subject">{t("subject")}</label>
            <input
              id="inquiry-subject"
              type="text"
              placeholder={t("subject-placeholder")}
              value={formData.subject}
              disabled={isSubmitting}
              required
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="inquiry-question">{t("question")}</label>
            <textarea
              id="inquiry-question"
              rows="5"
              placeholder={t("question-placeholder")}
              value={formData.question}
              disabled={isSubmitting}
              required
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            <IoSendOutline />
            {isSubmitting ? t("creating-inquiry") : t("send-inquiry")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewInquiryModal;
