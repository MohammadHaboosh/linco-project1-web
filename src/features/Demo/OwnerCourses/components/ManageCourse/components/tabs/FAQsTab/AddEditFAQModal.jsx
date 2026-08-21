import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import styles from "./FAQsTab.module.css";
import { useTranslation } from "react-i18next";

const AddEditFAQModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { t } = useTranslation();

  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        setQuestion(initialData?.question || "");
        setAnswer(initialData?.answer || "");
        setSubmitError("");
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [initialData, isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setQuestion(initialData?.question || "");
    setAnswer(initialData?.answer || "");
    setSubmitError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setIsSubmitting(true);
    setSubmitError("");
    const result = await onSubmit({
      question: question.trim(),
      answer: answer.trim(),
    });
    setIsSubmitting(false);

    if (result?.success) {
      setQuestion("");
      setAnswer("");
      onClose();
    } else {
      setSubmitError(result?.error || t("faq-create-failed"));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-dialog-title"
      >
        <div className={styles.modalHeader}>
          <h3 id="faq-dialog-title" className={styles.modalTitle}>
            {initialData ? t("edit-faq-item") : t("add-new-faq")}
          </h3>
          <button
            type="button"
            className={styles.iconOnlyBtn}
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label={t("close-faq-dialog")}
          >
            <IoCloseOutline size={22} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="faq-question">
              {t("question")}
            </label>
            <input
              id="faq-question"
              type="text"
              className={styles.formInput}
              placeholder={t(
                "e-g-what-are-the-prerequisites-for-taking-this-course",
              )}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="faq-answer">
              {t("answer")}
            </label>
            <textarea
              id="faq-answer"
              className={styles.formTextarea}
              placeholder={t(
                "provide-a-clear-detailed-answer-for-the-students",
              )}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>

          {submitError && (
            <p className={styles.modalError} role="alert">
              {submitError}
            </p>
          )}

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleClose}
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
              {isSubmitting
                ? t("adding-faq")
                : initialData
                  ? t("save-changes")
                  : t("add-faq")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditFAQModal;
