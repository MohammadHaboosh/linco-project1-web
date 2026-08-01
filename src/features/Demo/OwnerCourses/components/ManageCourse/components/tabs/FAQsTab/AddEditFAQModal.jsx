import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import styles from "./FAQsTab.module.css";
import { useTranslation } from "react-i18next";

const AddEditFAQModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { t } = useTranslation();

  const [question, setQuestion] = useState(initialData?.question || "");
  const [answer, setAnswer] = useState(initialData?.answer || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    onSubmit({
      question: question.trim(),
      answer: answer.trim(),
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{t("add-new-faq")}</h3>
          <button
            type="button"
            className={styles.iconOnlyBtn}
            onClick={onClose}
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>{t("question")}</label>
            <input
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
            <label className={styles.formLabel}>{t("answer")}</label>
            <textarea
              className={styles.formTextarea}
              placeholder={t(
                "provide-a-clear-detailed-answer-for-the-students",
              )}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              {t("cancel")}
            </button>
            <button type="submit" className={styles.submitBtn}>
              {initialData ? t("save-changes") : t("add-faq")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditFAQModal;
