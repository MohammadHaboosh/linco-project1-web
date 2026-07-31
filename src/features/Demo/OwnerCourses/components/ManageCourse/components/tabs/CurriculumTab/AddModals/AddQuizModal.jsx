import { useState } from "react";
import {
  IoCloseOutline,
  IoHelpCircleOutline,
  IoTimeOutline,
  IoListOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";
import { useQuiz } from "../../../../../../hooks/useQuiz";

const AddQuizModal = ({ isOpen, onClose, onSubmit, sectionId }) => {
  const [formData, setFormData] = useState({
    title: "",
    numberOfQuestions: 5,
    durationMinutes: 30,
  });
  const { createQuiz, isCreating } = useQuiz();

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isTempId = (id) => {
    if (!id) return true;
    const strId = String(id);
    return strId.startsWith("temp-") || strId.startsWith("temp_");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quizPayload = {
      title: formData.title.trim(),
      numberOfQuestions: Number(formData.numberOfQuestions),
      durationMinutes: Number(formData.durationMinutes),
    };

    try {
      if (sectionId && !isTempId(sectionId)) {
        const createdQuiz = await createQuiz(sectionId, quizPayload);
        if (onSubmit) {
          onSubmit(createdQuiz);
        }
      } else {
        if (onSubmit) {
          onSubmit({
            id: `temp_quiz_${Date.now()}`,
            ...quizPayload,
            isNew: true,
          });
        }
      }

      setFormData({
        title: "",
        numberOfQuestions: 5,
        durationMinutes: 30,
      });
      onClose();
    } catch (err) {
      console.error("Error creating quiz:", err);
      alert(err.message || "Failed to create quiz");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleGroup}>
            <div className={`${styles.iconBadge} ${styles.purpleBadge}`}>
              <IoHelpCircleOutline />
            </div>
            <div>
              <h3>Add New Quiz</h3>
              <p>Configure assessment details and time constraints</p>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            disabled={isCreating}
          >
            <IoCloseOutline />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Quiz Title *</label>
            <input
              type="text"
              required
              disabled={isCreating}
              className={styles.input}
              placeholder="e.g. Section 1 Exam: Auth"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className={styles.gridTwoCols}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <IoListOutline /> Number of Questions *
              </label>
              <input
                type="number"
                min="1"
                required
                disabled={isCreating}
                className={styles.input}
                placeholder="5"
                value={formData.numberOfQuestions}
                onChange={(e) =>
                  handleChange("numberOfQuestions", e.target.value)
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                <IoTimeOutline /> Duration (Minutes) *
              </label>
              <input
                type="number"
                min="1"
                required
                disabled={isCreating}
                className={styles.input}
                placeholder="30"
                value={formData.durationMinutes}
                onChange={(e) =>
                  handleChange("durationMinutes", e.target.value)
                }
              />
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className={`${styles.submitBtn} ${styles.purpleBtn}`}
            >
              {isCreating ? "Saving..." : "Save Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizModal;
