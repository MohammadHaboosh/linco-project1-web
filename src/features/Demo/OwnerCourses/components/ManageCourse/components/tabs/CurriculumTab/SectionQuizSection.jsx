import React from "react";
import {
  IoShieldCheckmarkOutline,
  IoTimeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import styles from "./SectionQuizSection.module.css";

const SectionQuizSection = ({ quiz, onAddQuiz, onDeleteQuiz }) => {
  return (
    <div className={styles.quizBox}>
      <div className={styles.header}>
        <h5 className={styles.title}>
          <IoShieldCheckmarkOutline className={styles.titleIcon} /> Section
          Assessment
        </h5>
      </div>

      {quiz ? (
        <div className={styles.quizCard}>
          <div className={styles.quizInfo}>
            <span className={styles.quizBadge}>Quiz:</span>
            <span className={styles.quizTitle}>{quiz.title}</span>
          </div>
          <div className={styles.quizMeta}>
            <span className={styles.duration}>
              <IoTimeOutline /> {quiz.duration} Mins
            </span>
            <button type="button" className={styles.iconBtn}>
              <IoPencilOutline />
            </button>
            <button
              type="button"
              className={styles.iconBtnDanger}
              onClick={onDeleteQuiz}
            >
              <IoTrashOutline />
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className={styles.addQuizBtn} onClick={onAddQuiz}>
          <IoAddCircleOutline /> Add Section Quiz
        </button>
      )}
    </div>
  );
};

export default SectionQuizSection;
