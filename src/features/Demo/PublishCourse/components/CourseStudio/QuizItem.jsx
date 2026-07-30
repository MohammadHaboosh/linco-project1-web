import React from "react";
import {
  IoShieldCheckmarkOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";

const QuizItem = ({ quiz, onEdit, onDelete, styles }) => {
  return (
    <div className={styles.finalQuizItem}>
      <div className={styles.lessonLeft}>
        <div className={styles.quizIconWrapper}>
          <IoShieldCheckmarkOutline />
        </div>
        <div className={styles.itemDetails}>
          <span className={styles.itemTitle}>
            {quiz.title} <span className={styles.finalTag}>Section Final</span>
          </span>
          <span className={styles.quizMeta}>
            {quiz.questionsCount} Questions • Random Generation
          </span>
        </div>
      </div>
      <div className={styles.lessonRight}>
        <button
          className={styles.iconBtn}
          onClick={onEdit}
          title="Edit Assessment"
        >
          <IoPencilOutline />
        </button>
        <button
          className={styles.iconBtnDanger}
          onClick={onDelete}
          title="Delete Assessment"
        >
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );
};

export default QuizItem;
