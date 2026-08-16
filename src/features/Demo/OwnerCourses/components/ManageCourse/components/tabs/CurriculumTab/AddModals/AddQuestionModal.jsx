import { useState } from "react";
import {
  IoCloseOutline,
  IoAddCircleOutline,
  IoTrashOutline,
  IoAddOutline,
  IoCheckbox,
  IoSquareOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";
import { useTranslation } from "react-i18next";

const AddQuestionModal = ({ isOpen, onClose, onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [note, setNote] = useState("");
  const [choices, setChoices] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleChoiceTextChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index].text = value;
    setChoices(newChoices);
  };

  const handleToggleCorrectChoice = (index) => {
    const updated = [...choices];
    updated[index].isCorrect = !updated[index].isCorrect;
    setChoices(updated);
  };

  const handleAddChoice = () => {
    if (choices.length < 6) {
      setChoices([...choices, { text: "", isCorrect: false }]);
    }
  };

  const handleRemoveChoice = (index) => {
    if (choices.length > 2) {
      const updated = choices.filter((_, i) => i !== index);
      if (!updated.some((c) => c.isCorrect)) {
        updated[0].isCorrect = true;
      }
      setChoices(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!choices.some((c) => c.isCorrect)) {
      alert(t("select-at-least-one-correct-answer"));
      return;
    }

    const hasEmptyChoices = choices.some((c) => !c.text.trim());
    if (hasEmptyChoices) {
      alert(t("fill-all-choices"));
      return;
    }

    const choiceTexts = choices.map((c) => c.text.trim().toLowerCase());
    const uniqueChoices = new Set(choiceTexts);
    if (uniqueChoices.size !== choices.length) {
      alert(t("choices-must-be-unique"));
      return;
    }

    const payload = {
      question: question.trim(),
      note: note.trim(),
      choices: choices.map((c) => ({
        text: c.text.trim(),
        isCorrect: c.isCorrect,
      })),
    };

    if (onSubmit) {
      onSubmit({
        id: `temp_q_${Date.now()}`,
        ...payload,
        isNew: true,
      });
    }

    setQuestion("");
    setNote("");
    setChoices([
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContainer} ${styles.largeModal}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="question-dialog-title"
        aria-describedby="question-dialog-description"
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={`${styles.iconBadge} ${styles.emeraldBadge}`}>
              <IoAddCircleOutline aria-hidden="true" />
            </div>
            <div>
              <h3 id="question-dialog-title">{t("add-question-to-bank")}</h3>
              <p id="question-dialog-description">
                {t("create-question-text-note-and-set-a-correct-answer")}
              </p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            type="button"
            onClick={onClose}
            aria-label={t("close-question-dialog")}
          >
            <IoCloseOutline aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalBodyScrollable}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="new-question-text">
                {t("question-text")}
              </label>
              <textarea
                id="new-question-text"
                required
                rows="3"
                className={styles.textarea}
                placeholder={t("question-text-placeholder")}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="new-question-note">
                {t("question-note-optional")}
              </label>
              <textarea
                id="new-question-note"
                rows="2"
                className={styles.textarea}
                placeholder={t("question-note-placeholder")}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label}>{t("answer-choices")}</label>
                <span className={styles.hintLabel}>
                  {t(
                    "select-one-or-more-correct-answers",
                    "Select one or more correct answers",
                  )}
                </span>
              </div>

              <div className={styles.choicesList}>
                {choices.map((choice, index) => (
                  <div key={index} className={styles.choiceRow}>
                    <button
                      type="button"
                      className={`${styles.correctRadioBtn} ${choice.isCorrect ? styles.activeChoice : ""}`}
                      onClick={() => handleToggleCorrectChoice(index)}
                      title={t("toggle-correct-answer")}
                      aria-pressed={choice.isCorrect}
                      aria-label={t("toggle-choice-correct-label", {
                        choice: String.fromCharCode(65 + index),
                      })}
                    >
                      {choice.isCorrect ? <IoCheckbox /> : <IoSquareOutline />}
                    </button>

                    <input
                      type="text"
                      required
                      className={styles.input}
                      placeholder={t("choice-placeholder", {
                        choice: String.fromCharCode(65 + index),
                      })}
                      aria-label={t("choice-input-label", {
                        choice: String.fromCharCode(65 + index),
                      })}
                      value={choice.text}
                      onChange={(e) =>
                        handleChoiceTextChange(index, e.target.value)
                      }
                    />

                    {choices.length > 2 && (
                      <button
                        type="button"
                        className={styles.removeChoiceBtn}
                        onClick={() => handleRemoveChoice(index)}
                        aria-label={t("remove-choice-label", {
                          choice: String.fromCharCode(65 + index),
                        })}
                      >
                        <IoTrashOutline />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {choices.length < 6 && (
                <button
                  type="button"
                  className={styles.addChoiceBtn}
                  onClick={handleAddChoice}
                >
                  <IoAddOutline /> {t("add-choice-option")}
                </button>
              )}
            </div>
          </div>

          <div className={styles.modalFooterFixed}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className={`${styles.submitBtn} ${styles.emeraldBtn}`}
            >
              {t("save-question")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
