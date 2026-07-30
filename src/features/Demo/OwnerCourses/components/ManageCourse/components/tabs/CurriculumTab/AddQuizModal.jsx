import { useState } from "react";
import {
  IoCloseOutline,
  IoHelpCircleOutline,
  IoTimeOutline,
  IoListOutline,
} from "react-icons/io5";
import styles from "./Modal.module.css";

const AddQuizModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    numberOfQuestions: 5,
    durationMinutes: 30,
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // إرجاع البنية المحددة للباك إند تماماً
    onSubmit({
      title: formData.title,
      numberOfQuestions: Number(formData.numberOfQuestions),
      durationMinutes: Number(formData.durationMinutes),
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
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
          <button className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        {/* جسم النموذج */}
        <form onSubmit={handleSubmit} className={styles.modalBody}>
          {/* عنوان الكويز */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Quiz Title *</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="e.g. Section 1 Exam: Auth"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className={styles.gridTwoCols}>
            {/* عدد الأسئلة */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <IoListOutline /> Number of Questions *
              </label>
              <input
                type="number"
                min="1"
                required
                className={styles.input}
                placeholder="5"
                value={formData.numberOfQuestions}
                onChange={(e) =>
                  handleChange("numberOfQuestions", e.target.value)
                }
              />
            </div>

            {/* المدة بالدقائق */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <IoTimeOutline /> Duration (Minutes) *
              </label>
              <input
                type="number"
                min="1"
                required
                className={styles.input}
                placeholder="30"
                value={formData.durationMinutes}
                onChange={(e) =>
                  handleChange("durationMinutes", e.target.value)
                }
              />
            </div>
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
              className={`${styles.submitBtn} ${styles.purpleBtn}`}
            >
              Save Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizModal;
