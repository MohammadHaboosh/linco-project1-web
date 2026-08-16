import { useState } from "react";
import {
  IoCloseOutline,
  IoHelpCircleOutline,
  IoTimeOutline,
  IoListOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";
import { useTranslation } from "react-i18next";

const AddQuizModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: "",
    numberOfQuestions: 5,
    durationMinutes: 30,
    passingScore: 60,
  });

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);

    if (isOpen) {
      setFormData({
        title: initialData?.title || "",
        numberOfQuestions: initialData?.numberOfQuestions || 5,
        durationMinutes: initialData?.durationMinutes || 30,
        passingScore: initialData?.passingScore || 60,
      });
    }
  }

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const quizPayload = {
      title: formData.title.trim(),
      numberOfQuestions: Number(formData.numberOfQuestions),
      durationMinutes: Number(formData.durationMinutes),
      passingScore: Number(formData.passingScore),
    };

    if (onSubmit) {
      onSubmit({
        id: initialData?.id || `temp_quiz_${Date.now()}`,
        ...quizPayload,
        isNew: !initialData?.id,
        isModified: !!initialData?.id,
      });
    }
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-dialog-title"
        aria-describedby="quiz-dialog-description"
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={`${styles.iconBadge} ${styles.purpleBadge}`}>
              <IoHelpCircleOutline aria-hidden="true" />
            </div>
            <div>
              <h3 id="quiz-dialog-title">
                {initialData ? t("edit-section-quiz") : t("add-new-quiz")}
              </h3>
              <p id="quiz-dialog-description">
                {t("configure-assessment-details-and-time-constraints")}
              </p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            type="button"
            onClick={onClose}
            aria-label={t("close-quiz-dialog")}
          >
            <IoCloseOutline aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="section-quiz-title">
              {t("quiz-title")}
            </label>
            <input
              id="section-quiz-title"
              type="text"
              required
              className={styles.input}
              placeholder={t("quiz-title-placeholder")}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className={styles.gridTwoCols}>
            <div className={styles.formGroup}>
              <label
                className={styles.label}
                htmlFor="section-quiz-question-count"
              >
                <IoListOutline aria-hidden="true" />
                {t("number-of-questions-required")}
              </label>
              <input
                id="section-quiz-question-count"
                type="number"
                min="1"
                required
                className={styles.input}
                placeholder={t("question-count-placeholder")}
                value={formData.numberOfQuestions}
                onChange={(e) =>
                  handleChange("numberOfQuestions", e.target.value)
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label
                className={styles.label}
                htmlFor="section-quiz-duration"
              >
                <IoTimeOutline aria-hidden="true" />
                {t("duration-minutes-required")}
              </label>
              <input
                id="section-quiz-duration"
                type="number"
                min="1"
                required
                className={styles.input}
                placeholder={t("duration-minutes-placeholder")}
                value={formData.durationMinutes}
                onChange={(e) =>
                  handleChange("durationMinutes", e.target.value)
                }
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="section-quiz-score">
              <IoCheckmarkCircleOutline aria-hidden="true" />
              {t("passing-score-required")}
            </label>
            <input
              id="section-quiz-score"
              type="number"
              min="1"
              max="100"
              required
              className={styles.input}
              placeholder={t("passing-score-placeholder")}
              value={formData.passingScore}
              onChange={(e) => handleChange("passingScore", e.target.value)}
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
            <button
              type="submit"
              className={`${styles.submitBtn} ${styles.purpleBtn}`}
            >
              {t("save-quiz")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizModal;
