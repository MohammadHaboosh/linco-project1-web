import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import styles from "./FAQsTab.module.css";

const AddEditFAQModal = ({ isOpen, onClose, onSubmit, initialData }) => {
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
          <h3 className={styles.modalTitle}>
            {initialData ? "Edit FAQ" : "Add New FAQ"}
          </h3>
          <button type="button" className={styles.actionBtn} onClick={onClose}>
            <IoCloseOutline size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Question</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. What are the prerequisites for this course?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Answer</label>
            <textarea
              className={styles.formTextarea}
              placeholder="Provide a clear and concise answer..."
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
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {initialData ? "Save Changes" : "Add FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditFAQModal;
