import { useState } from "react";
import {
  IoCloseOutline,
  IoAddCircleOutline,
  IoCheckmarkCircle,
  IoRadioButtonOff,
  IoTrashOutline,
  IoAddOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";

const AddQuestionModal = ({ isOpen, onClose, onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  if (!isOpen) return null;

  const handleChoiceTextChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index].text = value;
    setChoices(newChoices);
  };

  const handleSetCorrectChoice = (selectedIndex) => {
    const updated = choices.map((choice, i) => ({
      ...choice,
      isCorrect: i === selectedIndex,
    }));
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
      // تأكيد وجود خيار صحيح واحد على الأقل
      if (!updated.some((c) => c.isCorrect)) {
        updated[0].isCorrect = true;
      }
      setChoices(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // إرجاع البنية المطابقة تماماً لتوقع الباك إند
    onSubmit({
      question: question.trim(),
      choices: choices.map((c) => ({
        text: c.text.trim(),
        isCorrect: c.isCorrect,
      })),
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContainer} ${styles.largeModal}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={`${styles.iconBadge} ${styles.emeraldBadge}`}>
              <IoAddCircleOutline />
            </div>
            <div>
              <h3>Add Question to Bank</h3>
              <p>Create question text and set single correct answer</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        {/* جسم النموذج */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {/* نص السؤال */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Question Text *</label>
            <textarea
              required
              rows="3"
              className={styles.textarea}
              placeholder="e.g. What is Authentication?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* قائمة الخيارات */}
          <div className={styles.formGroup}>
            <div className={styles.labelRow}>
              <label className={styles.label}>Answer Choices *</label>
              <span className={styles.hintLabel}>
                Select the checkmark for the correct answer
              </span>
            </div>

            <div className={styles.choicesList}>
              {choices.map((choice, index) => (
                <div key={index} className={styles.choiceRow}>
                  {/* زر اختيار الإجابة الصحيحة */}
                  <button
                    type="button"
                    className={`${styles.correctRadioBtn} ${
                      choice.isCorrect ? styles.activeChoice : ""
                    }`}
                    onClick={() => handleSetCorrectChoice(index)}
                    title="Mark as correct answer"
                  >
                    {choice.isCorrect ? (
                      <IoCheckmarkCircle />
                    ) : (
                      <IoRadioButtonOff />
                    )}
                  </button>

                  {/* نص الخيار */}
                  <input
                    type="text"
                    required
                    className={styles.input}
                    placeholder={`Choice ${String.fromCharCode(65 + index)}`}
                    value={choice.text}
                    onChange={(e) =>
                      handleChoiceTextChange(index, e.target.value)
                    }
                  />

                  {/* زر حذف الخيار */}
                  {choices.length > 2 && (
                    <button
                      type="button"
                      className={styles.removeChoiceBtn}
                      onClick={() => handleRemoveChoice(index)}
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
                <IoAddOutline /> Add Choice Option
              </button>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.submitBtn} ${styles.emeraldBtn}`}
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;
